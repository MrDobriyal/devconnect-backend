const express = require('express');
const router = express.Router();
const { createPost, getPosts ,likePost, commentOnPost,likedCount
    ,AllCommentsForPost,editComment,deleteComment,getAllPostByUserId} = require('../controllers/postController');
const protect = require('../middleware/auth');
const upload =require('../middleware/upload');
router.post('/', protect,upload.single('image'), createPost);
router.get('/', getPosts);
router.put('/like/:postId', protect, likePost); 
router.post('/comment/:postId', protect, commentOnPost);
router.get('/likedCount/:postId',likedCount);
router.get('/comment/:postId',AllCommentsForPost);
router.put('/editComment/:postId/:commentId',protect,editComment);  
router.delete('/deleteComment/:postId/:commentId',protect,deleteComment);
router.get("/user/:userId",protect,getAllPostByUserId);

module.exports = router;