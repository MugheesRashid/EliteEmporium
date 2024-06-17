const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/dp');
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4(); 
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/productImg');
    },
    filename: function (req, file, cb) {
      const uniqueName = uuidv4(); // Call uuidv4 function to get a unique identifier
      cb(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|avif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/storedp');
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4(); // Call uuidv4 function to get a unique identifier
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/banner');
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4(); // Call uuidv4 function to get a unique identifier
    cb(null, uniqueName + path.extname(file.originalname));
  }
});


const picUpload = multer({
  storage: storage2,
  limits: { fileSize: 1024 * 1024 * 5 }, 
  fileFilter: fileFilter
});
const dpUpload = multer({ storage: storage });
const storeUpload = multer({ storage: storage3 });
const bannerUpload = multer({ storage: storage4 });
module.exports = {
    picUpload,
    dpUpload,
    bannerUpload,
    storeUpload
};