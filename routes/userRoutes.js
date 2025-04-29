const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile ,updateProfilePicture ,
    changePassword,getAllUsers,getUserById,updateProfile,searchUsers} = require('../controllers/userController');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/',protect,getAllUsers);
router.put('/me/avatar', protect, upload.single('avatar'), updateProfilePicture);
router.put('/me/password', protect, changePassword);
router.get('/search', protect, searchUsers); 
router.get("/:userId",protect,getUserById);
router.put('/update-profile', protect, upload.single('avatar'), updateProfile);



module.exports = router;