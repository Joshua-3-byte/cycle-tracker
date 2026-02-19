import express from "express";
import { createCycle, deleteCycleById, getCycle, getCycleById, predictCycle, updateCycleById } from "../controllers/cycleController.js";
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes below are protected — user must be logged in
router.use(protect); // applies protect to every route in this file

router.get('/predict', predictCycle)

router.get('/', getCycle)

router.post('/', createCycle)

router.get('/:id', getCycleById)

router.put('/:id', updateCycleById)

router.delete('/:id', deleteCycleById)

export default router