/* <----------------------- MODULOS --------------------------> */
const multer = require('multer');

// storage: Configuracion de almacenamiento en memoria
const storage = multer.memoryStorage();
// limits: Limite de tamano de archivo (5MB)
const limits = { fileSize: 1024 * 1024 * 5 };

// filtro: Funcion de fultro para permitir solo archivos de imagen (PNG, JPEG, JPG)
const filtro = (req, file, cb) => {
    if(file && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// Configuración de Multer
const subirImagen = multer({
    storage: storage,
    fileFilter: filtro,
    limits
});

module.exports = subirImagen;