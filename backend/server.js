import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cycleRoutes from './routes/cycleRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/cycles', cycleRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT || 5000


connectDB().then(()=>{
app.listen(PORT, () =>{
  console.log(`server running on port ${PORT}`)
})
})