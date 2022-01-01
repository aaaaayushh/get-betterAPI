const util = require("util");
const gc = require("../config/");
const bucket = gc.bucket("postpictures");

const uploadImage = (file) =>
  new Promise((res, rej) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({ resumable: true });
    blobStream
      .on("finish", async () => {
        const publicUrl = util.format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        await res(publicUrl);
      })
      .on("error", (err) => {
        console.log(err);
        rej("unable to upload image");
      })
      .end(buffer);
  });
module.exports = uploadImage;
