

const express=require("express");
import type {Request,Response,NextFunction} from "express"
import type {JwtPayload} from "jsonwebtoken";
import type jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
import type{Socket} from "socket.io"
 interface JwtUser{
   id:string,
   role:string,
   iat:number,
   exp:number
 };
 interface CustomSocket extends Socket{
   data:{
      user:JwtUser;
   }

 };
const ProtectRoute=(req:Request,res:Response,next:NextFunction)=>{
    let token=req.headers.cookie;
     token=token?.split("=")[1];


    if(!token){
        res.status(401).json({message:"Not Authenticated please Login"});
        return;
    }
    try{

    jwt.verify(token as string,process.env.JWT_SECRET! as string,(err: jsonwebtoken.VerifyErrors | null, decoded: JwtPayload| undefined)=>{
        if(err){
            console.log("error",(err as Error).message);
             res.status(401).json({message:"Token Expired"});
             return;
        }
            
            next();
        
    })
   }catch(err){
    console.log((err as Error).message);
     res.status(401).json({message:"Please Login again"});
   }



}
const socketInit=(socket:CustomSocket,next:NextFunction)=>{
     let token=socket.handshake.headers.cookie;
     token=token?.split("=")[1];


    if(!token){
        throw new Error("Not Authenticated please Login");
        
    }
    try{

    jwt.verify(token as string,process.env.JWT_SECRET! as string,(err: jsonwebtoken.VerifyErrors | null, decoded: JwtUser)=>{
        if(err){
            console.log("error",(err as Error).message);
             throw new Error("Token Expired");
            
        }
            socket.data.user=decoded;
            next();
        
    })
   }catch(err){
    console.log((err as Error).message);
     throw new Error("Please Login again");
   }



}



module.exports={ProtectRoute,socketInit};