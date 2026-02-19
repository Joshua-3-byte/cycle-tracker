import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cycleRoutes from './routes/cycleRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

dotenv.config()

const app = express()

// CORS configuration - allow both production and development
app.use(cors({
  origin: ['https://cyclestracker.netlify.app', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/cycles', cycleRoutes)
app.use('/api/profile', profileRoutes)

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Cycle Tracker API is running' })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
})