const  express =require("express");
const bcrypt=require("bcrypt");
import type {Request,Response} from "express";
const { DelAgent, Restaurent, User }=require("../model/DatabaseSchema.ts");
const {DataBase} =require("./../model/DatabaseConnection.ts");
require("dotenv").config();
const jwt =require("jsonwebtoken");
interface bodytype{
     Name:String,
        Email:String,
        Password:String,
        PhoneNumber:String,
        Location:String,
        Role:String

}
/////   API for User Register
const UserRegister=async (req:Request,res:Response)=>{
    if(req.body==null){
        res.status(404).json({message:"No details Provided"});
        return;
    }
    try{
    const {Name,Email,Password,PhoneNumber,Location,Role}:bodytype=req.body!;
    const hashedpass= await bcrypt.hash(Password,parseInt(process.env.Saltround as string ,10));
    if(Role=="Customer"){
       const newUser= new User({
        Name,
        Email,
        Password:hashedpass,
        PhoneNumber,
        Location
       });
       const resobj=await newUser.save();
       const token=jwt.sign({id:resobj._id,role:"Customer"},process.env.JWT_SECRET!,{expiresIn:"7d"})
       res.cookie("Access_Token",token,{
        sameSite:"none",
        httpOnly:true,
        secure:false,
        maxAge:7*60*60*1000*60,
       });
       res.status(201).json({message:"User Register Successfull",user:resobj});
       return;

    }else if(Role=="Restaurent"){
         const newUser= new Restaurent({
        Name,
        Email,
        Password:hashedpass,
        PhoneNumber,
        Location
       });
        const resobj=await newUser.save();
        const token=jwt.sign({id:resobj._id,role:"Restaurent"},process.env.JWT_SECRET!,{expiresIn:"7d"})
       res.cookie("Access_Token",token,{
        sameSite:"none",
        httpOnly:true,
        secure:false,
        maxAge:7*60*60*1000*60,
       });
       res.status(201).json({message:"Restaurent Register Successfull",user:resobj});
       return;
    }else if(Role=="DeliveryAgent"){
         const newUser= new DelAgent({
        Name,
        Email,
        Password:hashedpass,
        PhoneNumber,
        Location,
       
       });
      const resobj=await newUser.save();
       const token=jwt.sign({id:resobj._id,role:"DeliveryAgent"},process.env.JWT_SECRET!,{expiresIn:"7d"})
       res.cookie("Access_Token",token,{
        sameSite:"none",
        httpOnly:true,
        secure:false,
        maxAge:7*60*60*1000*60,
       });
       
       res.status(201).json({message:"Agent Register Successfull",user:resobj});
       return;
    }

        
    res.status(404).json({message:"Error With your Request"});

    }catch(err){
        console.log("error:",(err as Error).message);
          res.status(500).json({message:"Internal server error"});

    }
}



/// API for User Login

const UserLogin=async(req:Request,res:Response)=>{
      if(req.body==null){
        res.status(404).json({message:"Invalid or no details Provided"});
        return;
    }
    try{
       
         let Reqtoken=req.headers.cookie;
     Reqtoken=Reqtoken?.split("=")[1];
           const {Email,Password,Role}=req.body;
   
    let Custommodel;
     if(Role=="Customer") Custommodel=User;
   else  if(Role=="Restaurent") Custommodel=Restaurent;
   else   if(Role=="DeliveryAgent") Custommodel=DelAgent;
   else{ 
    res.status(403).json({message:"Invalid Credentials"});
      return;

            }
      
    const userobj= await Custommodel.findOne({Email});
    if(userobj==null || userobj==undefined){
         res.status(404).json({"message":"No user found with given credentials"});
         return;

    }
    const ismatched= await bcrypt.compare(Password,userobj.Password);
    if(!ismatched){
         res.status(404).json({message:"Invalid Credentials"});
         return;
    }
    const token=jwt.sign({id:userobj._id,role:userobj.Role},process.env.JWT_SECRET!,{expiresIn:"7d"});
       res.cookie("Access_Token",token,{
        sameSite:"none",
        httpOnly:true,
        secure:false,
        maxAge:60*60*60*7*1000,
       });
       res.status(200).json({message:"User Login Successful!",user:userobj});
       
   }catch(err){
    console.log("error:",(err as Error).message);
    res.status(403).json({message:"Error in Credentials"});

   }

}

const AgentUpdateStatus=async (req:Request,res:Response)=>{
    const {AgentId,curStatus}=req.body;
    if(AgentId==null || AgentId=="" || AgentId==undefined){
        res.status(200).json("Insufficient details");
        return;
    }
    try{
    const agentobj=await DelAgent.updateOne({_id:AgentId},{$set:{ Availabitystatus:curStatus}});
    res.status(200).json({message:"request successfull",details:agentobj});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}




module.exports={UserRegister,UserLogin,AgentUpdateStatus};