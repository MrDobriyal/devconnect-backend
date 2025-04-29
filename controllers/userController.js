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


  // exports.getUserById =async(req,res)=>{
  //   try{
  //     const { userId } = req.params;
  //       const user =await User.findById(userId).select('-password');
  //       return res.json(user);
  //   }catch(err){
  //       throw err; 
  //   }
  // }
  exports.getUserById = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.json(user);
    } catch (err) {
      console.error(err);  // Log the error for debugging
      return res.status(500).json({ message: 'Server Error' });
    }
  };

  exports.updateProfile = async (req, res) => {
    try {
      const { name ,userId} = req.body;
  
      // Find the user first
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update fields manually
      if (name) {
        user.name = name;
      }
  
      if (req.file) {
        user.profilePicture = req.file.path;
      }
  
      // Save the updated user
      await user.save();
  
      // Exclude password from response
      const { password, ...userWithoutPassword } = user.toObject();
  
      res.json(userWithoutPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  exports.searchUsers = async (req, res) => {
    try {
      const { q } = req.query; // Grab search query from URL parameters (e.g., `/api/user/search?q=John`)
      if (!q) {
        return res.status(400).json({ error: 'Search query is required.' });
      }
  
      // Search users by name or email (case-insensitive)
      const users = await User.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },  // Case-insensitive search by name
          { email: { $regex: q, $options: 'i' } }, // Case-insensitive search by email
        ],
      }).select('-password'); // Exclude password field
  
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong while searching for users' });
    }
  };
  