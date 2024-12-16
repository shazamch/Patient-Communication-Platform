const User = require("../models/userModel");
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
    const currentChatStack = await Conversation.find({
      participants: userId
    })
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

    const participantArray = Array.from(participantsIDs);
    const users = await User.find({ _id: { $in: participantArray } }).select("-password -email");

    const participantsDetails = participantArray
      .map((id) => {
        const user = users.find((u) => u._id.toString() === id);
        const lastMessage = currentChatStack
          .find((conversation) => conversation.participants.includes(id))
          ?.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        return {
          ...user.toObject(),
          lastMessage: lastMessage ? lastMessage.createdAt : null,
        };
      })
      .filter(Boolean);

    return { success: true, currentChatStack: participantsDetails };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching chat stack.");
  }
};

// Find Conversation between two users
exports.findConversation = async (userId1, userId2) => {
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    }).populate({
      path: "messages",
      populate: {
        path: "senderid", // Populate senderid to get user details
        select: "name", // Select only the fields you need from the User model
      },
    });

    if (!conversation) {
      return { success: true, conversation: [], message: "No Previous Chat Found." };
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedMessages = conversation.messages.map((message) => {
      return {
        id: message._id.toString(),
        userId: message.senderid._id.toString(),
        sender: message.senderid.name,
        message: message.message,
        time: formatDate(message.createdAt),
      };
    });

    return { success: true, conversation: formattedMessages };
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching conversation.");
  }
};