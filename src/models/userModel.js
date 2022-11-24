const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ['Mr', 'Mrs', 'Miss'],
      trim: true,

    },

     name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    list:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'books',
      default:[]
   }]
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("newusers", userSchema);
