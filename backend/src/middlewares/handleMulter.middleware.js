const multer = require('multer');

const storage = multer.memoryStorage();

const filtro = (req, file, cb) => {
    if(file && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const subirImagen = multer({
    storage: storage,
    fileFilter: filtro
});

module.exports = subirImagen;