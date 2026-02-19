import mongoose from "mongoose";

const connectDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGODB_URI),
    console.log('Mongo DB Connected ===')
  } catch (error) {
    console.log('Error in connecting to Mongo DB', error)
    process.exit(1)
  }
}

export default connectDB