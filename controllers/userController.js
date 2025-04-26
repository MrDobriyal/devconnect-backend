const User = require('../models/User.js');

exports.getMyProfile = async (req, res) => {
    res.json(req.user); // user is attached by auth middleware
  };
  
  exports.updateMyProfile = async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      user.name = name || user.name;
      user.email = email || user.email;
  
      await user.save();
  
      res.json(user);
    } catch (err) {
      res.status(500).send('Server error');
    }
  };


  exports.updateProfilePicture = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.profilePicture = req.file.path;
      await user.save();
      res.json({ message: 'Profile picture updated', path: req.file.path });
    } catch (err) {
      res.status(500).send('Error uploading image');
    }
  };


  exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user._id);
      const isMatch = await require('bcryptjs').compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Old password is incorrect' });
  
      user.password = newPassword;
      await user.save();
      res.json({ msg: 'Password changed successfully' });
    } catch (err) {
      res.status(500).send('Server error');
    }
  };


  exports.getAllUsers =async(req,res) =>{
    try{
      const users = await User.find().select('-password'); //this will exclude password
      res.status(200).json(users);
    }
    catch(err){
      res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
  }