const multer = require('multer');
const path = require('path');  //buit in module

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
    return cb(new Error('Only images are allowed'), false);   //first parameter is error if any you want to throw ,second is what to use parameter is is different for all.
  }
  cb(null, true); //if file is valid 
};

const upload = multer({ storage, fileFilter });
module.exports = upload;