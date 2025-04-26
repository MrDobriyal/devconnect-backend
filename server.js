const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path =require('path');

dotenv.config();  //load enviornment variable form env files to process.env
connectDB();

const app = express();
app.use(cors({
  origin: '*', // Allow all origins (for testing)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*',
}));
app.use(express.json());

const http = require('http');
const socketIo = require('socket.io');

app.use('/api/auth', require('./routes/authRoutes'));  //This mounts your authentication routes under the /api/auth path.
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app); // Create HTTP server for socket.io
const io = socketIo(server, {
    cors: {
      origin: "*", // or restrict to your frontend URL
      methods: ["GET", "POST","DELETE","PUT"],
      credentials:true
    }
  });

// Store active users
  let users = [];
  const addUser = (userId, socketId) => {
    !users.some(u => u.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter(u => u.socketId !== socketId);
  };
  
  const getUser = (userId) => users.find(u => u.userId === userId);

  // Handle socket events
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // When user joins with their ID
    socket.on('addUser', (userId) => {
      console.log("user added:" ,userId);
      addUser(userId, socket.id);
      io.emit('getUsers', users); // optional: to show who's online
    });
  
    // Send message
    socket.on('sendMessage', ({ senderId, receiverId,text,conversationId }) => {
      const user = getUser(receiverId);
      console.log("this is user: ",user);
     
      console.log('Sending message to:', receiverId ,senderId);
      if (user) {
        io.to(user.socketId).emit('getMessage', {
          senderId,
          text,
          conversationId,   
          createdAt: new Date().toISOString()
        });
      }
    });
  
    // When user disconnects
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
      removeUser(socket.id);
      io.emit('getUsers', users);
    });
  });

  server.listen(5000, () => {
    console.log('Socket Server running on port 5000');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));