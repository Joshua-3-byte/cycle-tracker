import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
name: {
  type: String,
  required: true
},
email: {
  type: String,
  required: true,
  unique: true
},
password: {
  type: String,
  required: true,
  minLength: 6
},
dateofBirth: {
  type: Date,
},
averageCycleLength: {
  type: Number,
  default: 28,
},
averagePeriodLength: {
  type: Number,
  default: 5,
},
emailReminders: {
      type: Boolean,
      default: false,
    },
    reminderDaysBefore: {
      type: Number,
      default: 2, // notify 2 days before predicted period
    },
},{timestamps:true})

const User = mongoose.model('User', userSchema)

export default User