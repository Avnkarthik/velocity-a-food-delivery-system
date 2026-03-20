const  mongoose =require("mongoose");
const  dotenv=require('dotenv');
import type {Connection} from "mongoose"
dotenv.config();
 class DataBase{
private DBConnection !:Connection;
private static instance:DataBase;
private constructor(){};
public static getInstance(){
    if(!this.instance){
        this.instance=new DataBase();

    }
    return this.instance;

}
  public async ConnectToDB(){
    if(!this.DBConnection){
      try{
        await mongoose.connect(process.env.DBURL!).then(()=>{
            console.log("Connected to mongodb successfully");
        });
        this.DBConnection=mongoose.connection;
      }catch(err){
        console.log("Error Occured:",err);
      }
       
     }

    
    return this.DBConnection;
 }

}
module.exports={DataBase};
