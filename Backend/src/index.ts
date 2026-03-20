const express =require("express");
const { DataBase }=require("./model/DatabaseConnection.ts");
const {controller}=require("./Controller/Routes.ts");
 
 const app=express();
 app.use(express.json());
 app.use("/api",controller);

 const db=DataBase.getInstance();
 db.ConnectToDB();
 app.listen(8080,()=>{
    console.log("app listening on port 8080");
 })

