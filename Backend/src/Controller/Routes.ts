const express =require("express");
const Router=express.Router();
const {UserRegister,UserLogin,AgentUpdateStatus,Logout,OrderHistory}= require("./UserAuthApi.ts")
const controller=Router;
const {ProtectRoute}=require("./middleware");
const {PlaceOrder,CompleteOrderStatus,fetchDetails}=require("./OrderApi.ts");
const {upload} =require("./../services/multer.ts");
const {UploadDish,FetchDishes,DeleteDish,DeleteImage,UpdateDish}=require("./DishApi.ts");
//  Authentication routes

controller.post("/User-Register",UserRegister);
controller.get("/User-Login",UserLogin);
controller.put("/User-Logout",ProtectRoute,Logout);
controller.put("/Agent-status-update",ProtectRoute,AgentUpdateStatus);

//   Order Routes

controller.post("/Place-Order",ProtectRoute,PlaceOrder);
controller.put("/updateOrderStatus",ProtectRoute,CompleteOrderStatus);
controller.get("/Get-History",ProtectRoute,OrderHistory);
controller.get("/Get-Detils",ProtectRoute,fetchDetails);

//  Dish Image upload route

controller.post("/Upload-Dish",ProtectRoute,upload.array("files",5),UploadDish);
controller.get("/Fetch-dishes",ProtectRoute,FetchDishes);
controller.delete("/Delete-Image",ProtectRoute,DeleteImage);
controller.put("/Update-Dish",ProtectRoute,UpdateDish);
controller.delete("/Delete-dish",ProtectRoute,DeleteDish);

module.exports={controller};