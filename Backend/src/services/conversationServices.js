const User = require("../models/userModel");
const userService = require('../services/userService');
const Conversation = require("../models/conversationModel");

// Get All Users (excluding the current user)
exports.getAllUsers = async (userId) => {
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("-password -email");
    if (!users || users.length === 0) {
      throw new Error("No users found.");
    }
    return { success: true, users };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching users.");
  }
};

// Get Chat Stack (list of conversations with user details)
exports.chatstack = async (userId) => {
  try {
    const currentChatStack = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate("messages");

    if (!currentChatStack || currentChatStack.length === 0) {
      return { success: true, currentChatStack: [], message: "No Previous Chat Found." };
    }

    const participantsIDs = new Set();
    currentChatStack.forEach((conversation) => {
      const otherParticipants = conversation.participants.filter(
        (id) => id.toString() !== userId.toString()
      );
      otherParticipants.forEach((id) => participantsIDs.add(id.toString()));
    });

    const participantsDetails = await Promise.all(
      Array.from(participantsIDs).map(async (id) => {
        try {
          const user = await userService.getUserById(id);
          const lastMessage = currentChatStack
            .find((conversation) => conversation.participants.includes(id))
            ?.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

          return {
            ...user.toObject(),
            lastMessage: lastMessage ? lastMessage.createdAt : null, // Keep original format
          };
        } catch (err) {
          console.error(`Error fetching user with ID ${id}:`, err.message);
          return null;
        }
      })
    );

    return { 
      success: true, 
      currentChatStack: participantsDetails.filter(Boolean) 
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching the chat stack.");
  }
};


// Find Conversation between two users
exports.findConversation = async (userId1, userId2) => {
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] },
    }).populate({
      path: "messages",
      populate: {
        path: "senderid",
        select: "username name",
      },
    });
    
    if (!conversation) {
      return { success: true, conversation: [], message: "No Previous Chat Found." };
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
    const formattedMessages = conversation.messages.map((message) => {
      return {
        id: message._id.toString(),
        senderId: message.senderid._id.toString(),
        senderUsername: message.senderid.username,
        senderName: message.senderid.name,
        message: message.message,
        time: formatDate(message.createdAt),
      };
    });    

    return {
      success: true,
      data: {conversationId: conversation._id.toString(), messages: formattedMessages}
    };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching conversation.");
  }
};
