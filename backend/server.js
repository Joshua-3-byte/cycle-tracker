import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cycleRoutes from './routes/cycleRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

dotenv.config()

const app = express()

// CORS configuration
app.use(cors({
  origin: '*'
}))

app.use(express.json())

// Log all requests (for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/cycles', cycleRoutes)
app.use('/api/profile', profileRoutes)

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Cycle Tracker API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on  port ${PORT}`)
  })
})