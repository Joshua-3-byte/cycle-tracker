import mongoose from "mongoose";

const cycleSchema = new mongoose.Schema({
user : {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
startDate : {
  type: Date,
  required: true
},
endDate : {
  type: Date,
},
periodLength : {
  type: Number,
},
cycleLength : {
  type: Number
},
flow : {
  type: String,
  enum: ['light', 'medium', 'heavy'],
  default: 'Medium'
},
notes: {
      type: String,
      trim: true,
    }
},{timestamps: true})

const Cycle = mongoose.model('Cycle', cycleSchema)

export default Cycle





























