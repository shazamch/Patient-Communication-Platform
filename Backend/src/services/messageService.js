const Conversation = require("../models/conversationModel");
const Message = require("../models/messagesModel");

let io; // Declare io variable

// Function to set the Socket.IO instance
exports.setSocketIO = (socketIO) => {
    io = socketIO;
};

// Service: Send Message
exports.sendMessage = async (messageContent, receiverid, senderid) => {
  try {
    // Find existing conversation or create a new one
    let chats = await Conversation.findOne({
      participants: { $all: [senderid, receiverid] }
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderid, receiverid]
      });
    }

    // Create new message
    const newMessages = new Message({
      senderid: senderid.toString(),
      receiverid: receiverid.toString(),
      message: messageContent,
      conversationid: chats._id.toString()
    });

    // Push message ID into conversation's message array
    if (newMessages) {
      chats.messages.push(newMessages._id);
    }

    // Save both conversation and new message
    await Promise.all([chats.save(), newMessages.save()]);

    // Emit the new message to the recipient via Socket.IO
    if (io) {
      io.to(receiverid).emit('newMessage', newMessages);
    }

    return { success: true, message: newMessages };
  } catch (error) {
    console.error("Error in sendMessage service:", error);
    return { success: false, message: "An error occurred while sending the message." }; // Provide a simple error message
  }
};


// Receive Messages
exports.receiveMessage = async (receiverid, senderid) => {
  try {
    // Find conversation and populate messages
    let chats = await Conversation.findOne({
      participants: { $all: [senderid, receiverid] }
    }).populate("messages");

    if (!chats) {
      throw new Error("No messages found.");
    }

    return { success: true, messages: chats.messages };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching messages.");
  }
};
