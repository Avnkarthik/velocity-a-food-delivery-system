const express=require("express")

const ContiansAll=(reqparams:Record<string,any>)=>{
     return Object.values(reqparams).every((feild)=>{
        return feild!=null &&  feild!=undefined && feild!="" ;
               
      });
     

}
module.exports={ContiansAll};