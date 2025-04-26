const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Array of user IDs who liked the post
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true , maxlength: 300 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date } 
    }
  ]
});

module.exports = mongoose.model('Post', postSchema);