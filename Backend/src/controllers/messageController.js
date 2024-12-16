const messageService = require('../services/messageService');

// Set Socket.IO instance in the service
exports.setSocketIO = (io) => {
  messageService.setSocketIO(io);
};

// Controller: Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user;
    const { receiverid, senderid, message: messageContent } = req.body.message;

    // Call the service to send the message
    const response = await messageService.sendMessage(messageContent, receiverid, senderid);

    if (!response.success) {
      return res.sendResponse(400, false, response.message); // Return the message received from the service
    }

    res.sendResponse(200, true, 'Message sent successfully', response.message, { accessToken, refreshToken });
  } catch (error) {
    console.error("Error in sendMessage controller:", error); // Log the full error
    res.sendResponse(500, false, error.message); // Return the actual error message to the client
  }
};



// Receive Message
exports.receiveMessage = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.user;  // Get tokens from req.user
    const receiverid = req.params.id;  // The receiver's ID from the URL parameter
    const senderid = req.userid;       // The sender's ID from the authenticated user data

    // Call the service to get the messages
    const response = await messageService.receiveMessage(receiverid, senderid);

    if (!response.success) {
      return res.sendResponse(400, false, 'No messages found');
    }

    res.sendResponse(200, true, 'Messages fetched successfully', response.messages, { accessToken, refreshToken });
  } catch (error) {
    res.sendResponse(500, false, error.message);
  }
};