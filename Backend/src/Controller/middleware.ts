

const express=require("express");
import type {Request,Response,NextFunction} from "express"
import type {JwtPayload} from "jsonwebtoken";
import type jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

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
module.exports={ProtectRoute};