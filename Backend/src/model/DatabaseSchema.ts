import console = require("node:console");

const mongoose=require("mongoose");

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
    Password:{
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
    },
    PreviousOrderes:{
        type: [mongoose.Schema.Types.ObjectId], // reference type
          ref: "Dishes",
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
    Password:{
        type:String,
        required:true
    },
    PhoneNumber:{
              type:Number,
              required:true
    },
    Location:{
            City:{
                type:String,
                index:true,
                required:true,
            },
            State:{
                type:String,
                required:true
            },
            Country:{
                type:String,
                required:true
            },
            AddLine1:{
                type:String,
                required:true,
            },
        },
    

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
        // index:true

    },
    Password:{
        type:String,
        required:true
    },
    PhoneNumber:{
              type:Number,
              required:true
    },
      Location:{
        type:String,
        required:true,
        index:true,
    },
    Availabitystatus:{
        type:String,
        required:true,
        default:"Offline",
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
    DishId:{
       type: mongoose.Schema.Types.ObjectId, // reference type
    ref: "Dishes",
        required:true
    },
    PaymentType:{
        type:String,
        required:true
    },
    OrderPrice:{
      type:Number,
        required:true,
    },
    OrderStatus:{
         type:String,
        required:true

    },
    OrderedAt:{
        type:Date,
        default:Date.now,
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
    Photos:{
        type:[{}],

    },
    Keywords:{
        type:[String],
    },
    City:{
        type:String,
        required:true,

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
 const Dishes=mongoose.model("Dishe",DishesModel);
 module.exports={User,Restaurent,DelAgent,Order,Dishes};