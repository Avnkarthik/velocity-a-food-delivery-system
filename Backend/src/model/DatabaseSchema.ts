import mongoose from "mongoose";

const UserModel=new mongoose.Schema({
    Name:{
        type:String,
        required:true,

    },
    Email:{
        type:String,
        required:true,
        unique:true,
        index:true

    },
    password:{
        type:String,
        required:true
    },
    PhoneNumber:{
              type:Number,
              required:true
    },
    Location:{
        type:String,
        required:true
    }

});
const RestaurentModel=new mongoose.Schema({
    Name:{
        type:String,
        required:true,

    },
    Email:{
        type:String,
        required:true,
        unique:true,
         index:true

    },
    password:{
        type:String,
        required:true
    },
    PhoneNumber:{
              type:Number,
              required:true
    },
    Location:{
        type:String,
        required:true
    }

});
const DeliveryAgentModel=new mongoose.Schema({
    Name:{
        type:String,
        required:true,

    },
    Email:{
        type:String,
        required:true,
        unique:true,
         index:true

    },
    password:{
        type:String,
        required:true
    },
    PhoneNumber:{
              type:Number,
              required:true
    },
      Location:{
        type:String,
        required:true
    }

});
const OrderDetailsModel=new mongoose.Schema({
    UserId:{
        type: mongoose.Schema.Types.ObjectId, // reference type
          ref: "User",
        required:true
    },
    DeliveryAgentId:{
         type: mongoose.Schema.Types.ObjectId, // reference type
    ref: "DelAgent",
        required:true
    },
    RestaurentId:{
       type: mongoose.Schema.Types.ObjectId, // reference type
    ref: "Restaurent",
        required:true
    },
    DeliveryType:{
        type:String,
        required:true
    },
    OrderPrice:{
      type:Number,
        required:true,
    },
    Orderstatus:{
         type:String,
        required:true

    }
    

});
const DishesModel=new mongoose.Schema({
    DishName:{
        type:String,
        required:true,
        index:true
    },
    Price:{
        type:Number,
        required:true,

    },
    photos:[String],
    Keywords:[String],
    RestaurentName:{
        type:String,
        required:true
    },
     RestaurentLocation:{
        type:String,
        required:true
    },
    RestaurentId:{
          type: mongoose.Schema.Types.ObjectId, // reference type
    ref: "Restaurent",
    required:true,
    }

});

const User=mongoose.model("User",UserModel);
const Restaurent=mongoose.model("Restaurent",RestaurentModel);
const DelAgent=mongoose.model("DelAgent",DeliveryAgentModel);
const Order=mongoose.model("Order",OrderDetailsModel);
const Dishes=mongoose.model("Dishe",DishesModel)