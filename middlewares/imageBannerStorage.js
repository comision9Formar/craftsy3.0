const multer = require('multer'),
        path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        callback(null,'./public/images/banner')
    },
    filename: (req,file,callback) => {
        callback(null,'banner-' + Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({
    storage
})

module.exports = upload;