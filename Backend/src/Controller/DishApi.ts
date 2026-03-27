const express=require("express")
import type {Request,Response} from "express"
import type AnyConnectionBulkWriteModel = require("mongoose");
import mongoose = require("mongoose");
const {cloudinary} =require("./../services/Cloudinary.ts")
const {ContiansAll}=require("./Utils.ts");
const {Dishes,Restaurent}=require("./../model/DatabaseSchema.ts");
const UploadDish=async(req:Request,res:Response)=>{
     if(req.files==null || req.files.length==0){
        res.status(200).json({message:"No file/files for Images uploaded"});
        return;
    }
    try{
        const {DishName, Price,Keywords, RestaurentId,City}=req.body;
        if(!ContiansAll(req.body)){
            res.status(200).json({message:"Incomplete details in your request"});
            return;
            
        }
    const files=req.files as Express.Multer.File[];
    const uploadFiles=files.map((file)=>{
        return new  Promise((resolve,reject)=>{
            const stream=cloudinary.uploader.upload_stream({folder:"Dishes"},(error:any,result:any)=>{
                if(error){
                    reject(error);
                }else resolve(result?.secure_url);
            });
            stream.end(file.buffer);
        });
    });
    const urls=await Promise.all(uploadFiles);
    
    const newDissh=new Dishes({
        DishName,
        Price,
        Photos:urls,
        Keywords,
        City,
        RestaurentId,
    });
    const resobj=await newDissh.save();
    
    res.status(200).json("Dish Uploded sucessfully");
  }catch(err){
    console.log((err as Error ).message);
    res.status(500).json({message:"Internal server error"});
  }
    

}

const FetchDishes=async (req:Request,res:Response)=>{
    const {city}=req.body;
    if(city==undefined || city==null || city==""){
        res.status(200).json({mesage:"Invalid city details"});
        return;
    }
   
    try{
        const [restaurentslist,disheslist]=await  Promise.all([
            Restaurent.find({"Location.City":city}),
            Dishes.find({City:city})
        ]);
        var resultArray:any[]=[];
       // console.log("restaurents:",restaurentslist,"dishes:",disheslist);
        restaurentslist.map((rest:any)=>{
            disheslist.map((dish:any)=>{
                if(dish.RestaurentId==rest._id.toString()){
                     resultArray.push({restaurentDetails:rest,dishDetails:dish});
                }
            })

        });
        if(resultArray.length==0){
              res.status(200).json({mesage:"We are not serving in this city, we will start soon...."});
              return;

        }
        res.status(200).json({message:"Fetch successful",data:resultArray});


    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Internal server Error"});
    }
}

module.exports={UploadDish,FetchDishes};