const fs = require("fs");
const uuid = require('uuid');

/* <----------------------- MODELOS --------------------------> */
const Hashtag = require("../models/hashtag.model");

/**
 * Lee un archivo (imagen) de forma sincronica desde el sistema de archivos y lo convierte en una cadena base64
 * @param {string} filePath - La ruta del archivo que se va a leer.
 * @returns {string|null} - La representacion base64 del archivo o null si ocurre un error.
 */
// DEBERIA SER ASYNC??? REVISAR
function readFileBase64(filePath) {
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
 * 
 * @param {*} file 
 * @returns 
 */
async function saveImagePost(file){
  if (file) {
    const imageBuffer = file.buffer;
    const extension = file.originalname.split('.').pop();
    const fileName = `${uuid.v4()}.${extension}`;
    fs.writeFileSync(`src/uploads/images/${fileName}`, imageBuffer);
    return fileName;
  }
  return null;
}

async function saveHashtagsPost(hashtags){
  const hashtagsIDs = [];
  if (typeof hashtags === 'string') {
      let hashtag = await Hashtag.findOne({ nameHashtag: hashtags });
      if (!hashtag) {
          hashtag = new Hashtag({ nameHashtag: hashtags });
          await hashtag.save();
      }
      hashtagsIDs.push(hashtag._id);
  } else if (Array.isArray(hashtags) && hashtags.length > 0) {
      for (const hashtagItem of hashtags) {
          let hashtag = null;
          let hashtagExist = await Hashtag.findOne({ nameHashtag: hashtagItem });
          if (!hashtagExist) {
              hashtag = new Hashtag({ nameHashtag: hashtagItem });
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
  saveHashtagsPost
};
