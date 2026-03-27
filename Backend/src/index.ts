const express =require("express");
const { DataBase }=require("./model/DatabaseConnection.ts");
const {controller}=require("./Controller/Routes.ts");
 const http =require("http");
 const {Server}=require("socket.io");
 import  type {Socket} from "socket.io";
 const jwt =require("jsonwebtoken");
 const {ContiansAll} =require("./Controller/Utils.ts")
const {socketInit}=require("./Controller/middleware.ts");
 const app=express();
 app.use(express.json());
 app.use("/api",controller);

const server=http.createServer(app);
const io=new Server(server);
io.use(socketInit);
io.on("connection",(socket:any)=>{
   socket.on("register",()=>{
      const UserId=socket.data.user.id;
       socket.join(UserId);


   });
 

});
 

 const db=DataBase.getInstance();
 db.ConnectToDB();
 server.listen(8080,()=>{
    console.log("app listening on port 8080");
 })


