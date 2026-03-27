const express=require("express");
import type{Request,Response} from "express";
const {DelAgent}=require("./../model/DatabaseSchema.ts");
const {Order}=require("./../model/DatabaseSchema.ts");
const {ContiansAll}=require("./Utils.ts");
const {Restaurent}=require("./../model/DatabaseSchema.ts");
const {User}=require("./../model/DatabaseSchema.ts");
const {io} =require("socket.io");
const AssingAgent=async(city:String)=>{
    const agent= await DelAgent.findOne({Location:city, Availabitystatus:"Online"});
    return agent;


}
const PlaceOrder=async(req:Request,res:Response)=>{
    if(req.body==null || req.body==undefined){
        res.status(404).json({message:"Invalid Order Request"});
        return;
    }
    try{
      const {Price,RestaurentId,UserId,PaymentType,DishId}=req.body;
      if(!ContiansAll(req.body)){
        console.log(req.body);
        res.status(404).json({message:"Incomplete Order Details"});
        return;

      }
      const restaurentobj=await Restaurent.findOne({_id:RestaurentId});
       const Userobj=await User.findOne({_id:UserId});
       console.log(restaurentobj," ",Userobj);
       if(restaurentobj==null ||restaurentobj==undefined || Userobj==null || Userobj==undefined ){
               res.status(404).json({message:"Incorrect Order Details"});
        return;

       }
      const AssingnedAgent= await AssingAgent(restaurentobj.Location.city);
       if(AssingnedAgent==null || AssingnedAgent==undefined){
          res.status(404).json({message:"No delivery Agents Available"});
        return;
       }

       const newOrder=new Order({
          UserId,
          DeliveryAgentId:AssingnedAgent._id,
          RestaurentId,
          DishId,
          PaymentType,
          OrderPrice:Price,
          OrderStatus:"Pending",
       })
    const  resobj=await newOrder.save();
    io.to(RestaurentId).emit({message:"Order placed for your restaurent",Details:newOrder._id});
    io.to(AssingnedAgent._id).emit({message:" you have an Order to deliver ",Details:newOrder._id});
    res.status(200).json({message:"order Placed sucessfully",Details:resobj});
    }catch(err){
        console.log("error:",(err as Error).message);
        res.status(500).json({message:"Internal server Error"});
    }



}

const CompleteOrderStatus=async(req:Request,res:Response)=>{

    const {orderId,changerId,Upstatus}=req.body;
    if(!ContiansAll(req.body)){
        res.status(404).json({message:"Incomplete Order Details"});
        return;
    }
    if(Upstatus!="Picked" && Upstatus!="Delivered"){
        res.status(404).json({message:"Invalid Request"});
        return;
    }
    const orderobj=await Order.findOne({_id:orderId});
     if(orderId!=orderId._id ||( changerId!=orderobj.DeliveryAgentId && changerId!=orderobj.UserId && changerId!=orderobj.RestaurentId)){
        res.status(401).json({message:" NO autharization for modification"});
     }
     await Order.updateOne({_id:orderId},{$set:{OrderStatus:Upstatus}});
      io.to(orderobj.UserId).emit({message:` your Order get ${Upstatus}`});
       io.to(orderobj.DeliveryAgentId).emit({message:` your Order get ${Upstatus}`});
        io.to(orderobj.RestaurentId).emit({message:` your Order get ${Upstatus}`});
     res.status(200).json({message:"Status Updated Successfully"});



}

module.exports={PlaceOrder,CompleteOrderStatus};
