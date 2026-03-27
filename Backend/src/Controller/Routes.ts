const express =require("express");
const Router=express.Router();
const {UserRegister,UserLogin,AgentUpdateStatus}= require("./UserAuthApi.ts")
const controller=Router;
const {ProtectRoute}=require("./middleware");
const {PlaceOrder,CompleteOrderStatus}=require("./OrderApi.ts");
const {upload} =require("./../services/multer.ts");
const {UploadDish,FetchDishes}=require("./DishApi.ts");
//  Authentication routes

controller.post("/User-Register",UserRegister);
controller.get("/User-Login",UserLogin);

//   Order Routes

controller.post("/Place-Order",ProtectRoute,PlaceOrder);
controller.put("/updateOrderStatus",ProtectRoute,CompleteOrderStatus);
controller.put("/Agent-status-update",ProtectRoute,AgentUpdateStatus);


//  Dish Image upload route

controller.post("/Upload-Dish",upload.array("files",5),UploadDish);
controller.get("/Fetch-dishes",ProtectRoute,FetchDishes);

module.exports={controller};