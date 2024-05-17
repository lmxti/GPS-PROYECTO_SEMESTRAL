const fs = require('fs').promises;
const uuid = require('uuid');

/* <----------------------- MODELOS --------------------------> */
const Hashtag = require("../models/hashtag.model");

/**
 * Lee un archivo (imagen) de forma sincronica desde el sistema de archivos y lo convierte en una cadena base64
 * @param {string} filePath - La ruta del archivo que se va a leer.
 * @returns {string|null} - La representacion base64 del archivo o null si ocurre un error.
 */
async function readFileBase64(filePath) {
  try {
    // Lee el archivo de forma sincrónica y lo convierte a base64
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString("base64");
    return base64Data;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return null;
  }
};
/**
 *  Guarda la imagen de una publicacion en el sistema de archivos
 * @param {Object} file  - Objeto que contiene la informacion del archivo de imagen.
 * @returns {String|null} - Nombre de archivo de imagen guardado, o null si no se proporciono ningun archivo.
 */
async function saveImagePost(file){
  if (file) {
    const imageBuffer = file.buffer;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuid.v4()}.${extension}`;
    await fs.writeFile(`src/uploads/images/${fileName}`, imageBuffer);
    return fileName;
  }
  return null;
}

async function saveImageProfile(file){
  if (file) {
    const imageBuffer = file.buffer;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuid.v4()}.${extension}`;
    await fs.writeFile(`src/uploads/profiles/${fileName}`, imageBuffer);
    return fileName;
  }
  return null;
}




/**
 * Guarda los hashtags en la base de datos, asegurándose de que no haya duplicados y devolviendo los IDs correspondientes.
 * @param {string | string[]} hashtags - Los hashtags a guardar, puede ser una cadena o un array de cadenas.
 * @returns {Promise<string[]>} - Un array de IDs de los hashtags guardados.
 */
async function saveHashtagsPost(hashtags){
  const hashtagsIDs = [];
  if (typeof hashtags === 'string') {
      const hashtagLower = hashtags.toLowerCase();
      let hashtag = await Hashtag.findOne({ nameHashtag: hashtagLower });
      if (!hashtag) {
          hashtag = new Hashtag({ nameHashtag: hashtagLower });
          await hashtag.save();
      }
      hashtagsIDs.push(hashtag._id);
  } else if (Array.isArray(hashtags) && hashtags.length > 0) {
      for (const hashtagItem of hashtags) {
        const hashtagLower = hashtagItem.toLowerCase();
          let hashtag = null;
          let hashtagExist = await Hashtag.findOne({ nameHashtag: hashtagLower });
          if (!hashtagExist) {
              hashtag = new Hashtag({ nameHashtag: hashtagLower });
              await hashtag.save();
          } else {
              hashtag = hashtagExist;
          }
          hashtagsIDs.push(hashtag._id);
      }
  }
  return hashtagsIDs;
}

module.exports = {
  readFileBase64,
  saveImagePost,
  saveHashtagsPost,
  saveImageProfile
};
