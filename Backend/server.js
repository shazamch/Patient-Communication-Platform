require('dotenv').config();
const express = require('express');
const responseHandler = require('./src/middlewares/responseHandler.js');
const cors = require('./src/middlewares/cors.js');
const logger = require('./src/middlewares/logger.js');
const authenticateToken = require('./src/middlewares/authToken.js');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
          "http://localhost:5173",
          "https://patient-communication-platform.vercel.app/",
          ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
app.use(express.json());
app.use(cors);
app.use(logger);
app.use(responseHandler);


const authRoutes = require('./src/routes/authRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const messageRoutes = require('./src/routes/messageRoutes.js');
const conversationRoutes = require('./src/routes/conversationRoutes.js');

app.use('/protected', authenticateToken);

app.use('/auth', authRoutes);
app.use('/protected/users', userRoutes);
app.use('/protected/message', messageRoutes);
app.use('/protected/conversation', conversationRoutes);


const port = process.env.PORT || 3000;
const dbConnect = require('./src/utils/dbConnect.js');

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

// Socket.io Connection and Event Handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on("room:join", (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
      });
    
      socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });
    
      socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });
    
      socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
    
      socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });

      socket.on('disconnect', () => {
        const email = socketidToEmailMap.get(socket.id);
        emailToSocketIdMap.delete(email);
        socketidToEmailMap.delete(socket.id);
        console.log('User disconnected:', socket.id);
    });
    
});

// Server startup
server.listen(port, () => {
    dbConnect(); // Connect to the database when the server starts
    console.log(`Server Running at Port ${port}`);
});
