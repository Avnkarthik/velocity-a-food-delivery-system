import multer = require("multer");

//const multer=require("multer");

const storage=multer.memoryStorage();

const fileFilter=(req:Express.Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
       const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
       if(allowedTypes.includes(file?.mimetype)) {
        cb(null,true);
       }   else{
        cb(new Error("Un supported file Type"));
       }

};
const upload=multer({
    storage,
    fileFilter,
    limits:{
        fileSize:5*1024*1024,
        files:5
    }
});
module.exports={upload};
