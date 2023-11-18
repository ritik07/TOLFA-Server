const multer = require("multer");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

let FILE_NAME = "";

const imageStorage = multer.diskStorage({
  destination: "file", // Destination to store image
  filename: (req, file, cb) => {
    FILE_NAME =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  },
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
});

const upload = multer({
  // dest: "uploads/",
  storage: imageStorage,
}).single("image");

exports.postFile = async (req, res, next) => {
  upload(req, res, function (err, data) {
    if (err) {
      console.log("err", err);
    }
    req.body.file_name = FILE_NAME;
    console.log("req.body.file_name", req.body.file_name);
    const apiUrl =
      "https://arihantchemical.in/upload-service/upload_service.php";
    // console.log("req", req.file);
    const formData = new FormData();
    if (req.file === undefined) {
      return next();
    }
    formData.append(
      "file",
      fs.createReadStream(`./file/${req.body.file_name}`)
    );
    axios
      .post(apiUrl, formData, {
        headers: formData.getHeaders(),
      })
      .then((response) => {
        console.log("sucesssss", response.data);
        next();
      })
      .catch((error) => {
        console.error("errrr", error);
      });

    // res.status(200).json({ message: "OK" });
    console.log(req.file, req.body);
  });
};

/* 

  // fileFilter(req, file, cb) {
  //   if (!file.originalname.match(/\.(png|jpg)$/)) {
  //     // upload only png and jpg format
  //     return cb(new Error("Please upload a Image"));
  //   }
  //   cb(undefined, true);
  // },

*/
