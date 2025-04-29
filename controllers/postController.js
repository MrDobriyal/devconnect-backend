const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({ content: req.body.content, author: req.user._id, image: req.file ? req.file.path : null });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).send('Error creating post ' + err);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture')
    .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Error fetching posts');
  }
};

exports.likePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
  
      // Check if the user has already liked the post
      if (post.likes.includes(req.user._id)) {
        // User has already liked, so remove their like (unlike)
        post.likes = post.likes.filter(userId => userId.toString() !== req.user._id.toString());
        await post.save();
        return res.json({ msg: 'Post unliked' });
      }
  
      // If the user hasn't liked the post yet, add their like
      post.likes.push(req.user._id);
      await post.save();
      res.json({ msg: 'Post liked' });
    } catch (err) {
      res.status(500).send('Error toggling like');
    }
  };


  exports.commentOnPost = async (req, res) => {
    const { text } = req.body;
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
  
      // Add a comment to the post
      post.comments.push({
        user: req.user._id,
        text,
        createdAt: new Date()
      });
      await post.save();
      res.json({ msg: 'Comment added' });
    } catch (err) {
      res.status(500).send('Error adding comment');
    }
  };

  exports.likedCount = async (req,res) =>{
    const post =await Post.findById(req.params.postId);
    if(!post) return res.status(404).json("post not found");

    return res.json(post.likes.length);
  }


  exports.AllCommentsForPost =async (req,res)=>{
    const post =await Post.findById(req.params.postId);
    if(!post){
        return res.status(404).json("post not found");
    }

    return res.json(post.comments);
  }

  exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
  
    try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
  
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ msg: 'Comment not found' });
  
      // Only the original commenter can delete
      if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Not authorized to delete this comment' });
      }
  
      comment.deleteOne();
      await post.save();
  
      res.json({ msg: 'Comment deleted' });
    } catch (err) {
      res.status(500).send('Error deleting comment:'+ err);
    }
  };

  exports.editComment =async (req,res)=>{
    const {postId,commentId} =(req.params);
    try{
        let post =await Post.findById(postId); 
    if(!post){
        return res.status(404).json("post not found");
    }

    let comment =post.comments.id(commentId);
    if(!comment){
        return res.status(404).json("Comment not found");
    }

    if(comment.user.toString()!==req.user._id.toString()){
        return res.status(403).json("not Authorized to Edit this Comment");
    }

    comment.text =req.body.text;
    comment.updatedAt = new Date(); 
    await post.save();
    return res.json({msg:"Comment Updated",comment});
    }catch(err){
        res.status(500).json("error editing comment");
    }

  }

  exports.getAllPostByUserId = async (req, res) => {
    try {
      const { userId } = req.params; // get userId from route parameter
      const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }); // -1 for newest first
      return res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  };