const express=require("express")

const ContiansAll=(reqparams:Record<string,any>)=>{
     return Object.values(reqparams).every((feild)=>{
        return feild!=null &&  feild!=undefined && feild!="" ;
               
      });
     

}
const fetchRecord=async (recordId:String,recordModel:any)=>{
     if(recordId==null || recordModel==null || recordId==undefined || recordModel==undefined){
      return {};
     }
    
     const res=await recordModel.findOne({_id:recordId});
     return res;
   
}
module.exports={ContiansAll,fetchRecord};