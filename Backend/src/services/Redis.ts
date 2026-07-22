import console = require("node:console");

const {createClient}=require("redis")
require("dotenv").config();
const RedisClient=async()=>{
const client=createClient({
   username:process.env.REDIS_USERNAME ,
    password:process.env.REDIS_PASSWORD  ,
    socket: {
        host: process.env.REDIS_CONNECTION_STRING ,
        port: 18270
    }

});
     await client.on('error',(err:any)=>console.log("Redis Error: ",err));
     await client.connect();
     return client;
}

module.exports={RedisClient};