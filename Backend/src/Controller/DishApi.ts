const express=require("express")
import type {Request,Response} from "express"
import type jsonwebtoken = require("jsonwebtoken");
import type AnyConnectionBulkWriteModel = require("mongoose");
import mongoose = require("mongoose");
const {RedisClient}=require("../services/Redis.ts");
const {cloudinary} =require("./../services/Cloudinary.ts")
const {ContiansAll}=require("./Utils.ts");
const {Dishes,Restaurent}=require("./../model/DatabaseSchema.ts");
const {jwt}=require("jsonwebtoken");


// ################ Upload disd ################


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
                }else resolve({url:result?.secure_url,id:result?.public_id});
            });
            stream.end(file.buffer);
        });
    });
    const urls=await Promise.all(uploadFiles);
   // console.log(urls);
    
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


  // #########################  fetch dishes #############################



const FetchDishes=async (req:Request,res:Response)=>{
    const {city}=req.body;
    if(city==undefined || city==null || city==""){
        res.status(200).json({mesage:"Invalid city details"});
        return;
    }
   
    try{
        const client=await RedisClient();
        const resultArray:any[]=[];
        const resultCached= await client.get(`Dishes:${city}`);
        if(resultCached!=null && resultCached!=undefined){
            console.log("cache hit");
             res.status(200).json({message:"Fetch successful",data:JSON.parse(resultCached)});
             return;
        }
        
        const [restaurentslist,disheslist]=await  Promise.all([
            Restaurent.find({"Location.City":city}),
            Dishes.find({City:city})
        ]);
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
        console.log("cache miss");
       await client.set(`Dishes:${city}`,JSON.stringify(resultArray),{EX:60});
       
        res.status(200).json({message:"Fetch successful",data:resultArray});


    }catch(err){
        console.log("error:",err);
        res.status(500).json({message:"Internal server Error"});
    }
}


 // #########################  delete dishe #############################


const DeleteDish=async (req:Request,res:Response)=>{
    console.log(req.body);
    const {DishId}=req.body;
    if(DishId=="" || DishId==null || DishId==undefined){
        res.status(200).json({message:"No complete Details provided"});
        return;
    }
    try{
   const  dishobj=await Dishes.findOne({_id:DishId});
   const restobj=await Restaurent.findOne({_id:dishobj.RestaurentId});
     if(restobj==null || restobj==undefined){
        res.status(200).json({message:"Invalid request"});
        return;
     }
     let token=req.headers.cookie;
     token=token?.split("=")[1];
     jwt.verify(token as string,process.env.JWT_SECRET! as string,(err: jsonwebtoken.VerifyErrors | null, decoded: jsonwebtoken.JwtPayload| undefined)=>{
        if(err){
            console.log("error",(err as Error).message);
             res.status(401).json({message:"Token Expired"});
             return;
        }
        if(decoded?.id!=dishobj.RestaurentId){
             res.status(401).json({message:"No Authorization"});
             return;
        }
    });
  
     await Promise.all(dishobj.Photos.map((id:any)=>{
        cloudinary.uploader.destroy(id.id);
     }));
  const resobj= await Dishes.deleteOne({_id:DishId});
     res.status(200).json({message:"Dish deleted succesfully",resobj});
    }catch(err){
        console.log((err as Error).message);
        res.status(500).json({message:"Internal Server error"});
    }

}

  // #########################  update dishes #############################


 const UpdateDish=async (req:Request,res:Response)=>{

    try{
          const {DishName, Price,Keywords,DishId }=req.body;
         const files=req.files as Express.Multer.File[];
        
         if(files!=null && files!=undefined && files.length>0){
              const uploadFiles=files.map((file)=>{
        return new  Promise((resolve,reject)=>{
            const stream=cloudinary.uploader.upload_stream({folder:"Dishes"},(error:any,result:any)=>{
                if(error){
                    reject(error);
                }else resolve({url:result?.secure_url,id:result?.public_id});
            });
            stream.end(file.buffer);
        });
    });
      const  urls=await Promise.all(uploadFiles);

        const res=await Dishes.updateOne({_id:DishId},{$set:{
            DishName,
            Price,
            Keywords
          }},{$push:{Photos:{urls}}});

         }else{

             const res=await Dishes.updateOne({_id:DishId},{$set:{
            DishName,
            Price,
            Keywords
          }});

         }
         
         
  res.status(200).json({message:"Updated Details Successfully"});
        



    }catch(err){
        console.log(err);
        res.status(500).json("Internal server Error");
    }



 }

   // #########################  delete Image #############################


 const DeleteImage=async(req:Request,res:Response)=>{

    const {photo}=req.body();
    if(photo==null || photo==undefined ){
        res.status(200).json({message:"Invalid Request"});
        return;
    }
    try{
      
        cloudinary.uploader.destroy(photo);
   res.status(200).json({message:"Image Deleted Successfully"});

    }catch(err){
        console.log(err);
        res.status(200).json({message:"Internal Server Error"});
    }

 }


module.exports={UploadDish,FetchDishes,DeleteDish,UpdateDish,DeleteImage};