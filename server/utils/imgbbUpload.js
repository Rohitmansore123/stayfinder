const axios = require("axios");

/**
 * Upload image to ImgBB
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} apiKey - ImgBB API key
 * @returns {Promise<string>} - Image URL
 */
const uploadToImgBB = async (imageBuffer, apiKey) => {
  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer]);
    formData.append("image", blob);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data.url;
  } catch (error) {
    throw new Error(`ImgBB upload failed: ${error.message}`);
  }
};

module.exports = { uploadToImgBB };
