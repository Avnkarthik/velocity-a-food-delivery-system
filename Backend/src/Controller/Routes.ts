const express =require("express");
const Router=express.Router();
const {UserRegister,UserLogin}= require("./UserAuthApi.ts")
const controller=Router;
const {ProtectRoute}=require("./middleware");

controller.post("/User-Register",UserRegister);
controller.get("/User-Login",ProtectRoute,UserLogin);

module.exports={controller};