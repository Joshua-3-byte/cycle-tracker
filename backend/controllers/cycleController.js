import Cycle from '../models/Cycle.js'

// ─── Helper: calculate cycle length ───────────────────────────
// cycleLength = days between this period's start and the previous period's start
const calculateCycleLength = (currentStart, previousStart) => {
  const diff = new Date(currentStart) - new Date(previousStart);
  return Math.round(diff / (1000 * 60 * 60 * 24)); // convert ms → days
};

// ─── Helper: calculate period length ──────────────────────────
// periodLength = days from startDate to endDate
const calculatePeriodLength = (startDate, endDate) => {
  const diff = new Date(endDate) - new Date(startDate);
  return Math.round(diff / (1000 * 60 * 60 * 24));
};

// Get cycle
export async function getCycle(req,res) {
try {
  const cycles = await Cycle.find({user: req.user._id}).sort({startDate: -1})

  res.json(cycles)
} catch (error) {
  console.error('Error in getCycle controller', error)
   res.status(500).json({ message: error.message });
}
}

// Create a Cycle
export async function createCycle(req,res) {
try {
  const { startDate, endDate, flow, notes } = req.body;

    // Find the most recent cycle for this user (to calculate cycleLength)
    const lastCycle = await Cycle.findOne({ user: req.user._id })
      .sort({ startDate: -1 }); // -1 = descending (most recent first)

    // Build the cycle object
    const cycleData = {
      user: req.user._id,  // comes from our protect middleware!
      startDate,
      flow,
      notes,
    };

    // If endDate provided, calculate period length
    if (endDate) {
      cycleData.endDate = endDate;
      cycleData.periodLength = calculatePeriodLength(startDate, endDate);
    }

    // If there's a previous cycle, calculate cycle length
    if (lastCycle) {
      cycleData.cycleLength = calculateCycleLength(startDate, lastCycle.startDate);
    }

    const cycle = await Cycle.create(cycleData);
    res.status(201).json(cycle);
} catch (error) {
   console.error('Error in createCycle controller ')
  res.status(500).json({ message: error.message })
}
}

// Predict cycle
export async function predictCycle(req,res) {
try {
      // Get the last 6 cycles (enough data to average)
    const cycles = await Cycle.find({ user: req.user._id })
      .sort({ startDate: -1 })
      .limit(6);

    if (cycles.length < 2) {
      return res.status(400).json({
        message: 'Log at least 2 cycles to get predictions'
      });
    }

        // Average cycle length from cycles that have cycleLength recorded
    const cyclesWithLength = cycles.filter(c => c.cycleLength);
    const avgCycleLength = Math.round(
      cyclesWithLength.reduce((sum, c) => sum + c.cycleLength, 0) /
      cyclesWithLength.length
    );

    // Average period length
    const cyclesWithPeriod = cycles.filter(c => c.periodLength);
    const avgPeriodLength = cyclesWithPeriod.length > 0
      ? Math.round(
          cyclesWithPeriod.reduce((sum, c) => sum + c.periodLength, 0) /
          cyclesWithPeriod.length
        )
      : 5; // fallback default

    // Most recent period start
    const lastPeriodStart = new Date(cycles[0].startDate);

    // Predict next period start
    const nextPeriodStart = new Date(lastPeriodStart);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);

    // Predict next period end
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + avgPeriodLength);

        // Fertile window: roughly days 10-16 of cycle (from last period start)
    const fertileWindowStart = new Date(lastPeriodStart);
    fertileWindowStart.setDate(fertileWindowStart.getDate() + 10);

    const fertileWindowEnd = new Date(lastPeriodStart);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 16);

    // Ovulation day: ~14 days before next period
    const ovulationDay = new Date(nextPeriodStart);
    ovulationDay.setDate(ovulationDay.getDate() - 14)

        res.json({ avgCycleLength, avgPeriodLength, lastPeriodStart, nextPeriodStart,nextPeriodEnd, fertileWindowStart,fertileWindowEnd,ovulationDay,
    });
} catch (error) {
        console.error('Error in predictCycle controller ')
  res.status(500).json({ message: error.message })
}
}


// get cycle by Id
export async function getCycleById(req,res) {
try {
  const cycle = await Cycle.findById(req.params.id)

      if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    // Make sure the cycle belongs to the logged-in user
    if (cycle.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(cycle)
} catch (error) {
    console.error('Error in getCycleById controller', error)
   res.status(500).json({ message: error.message });
}
}

// Update cycle by Id
export async function updateCycleById(req,res) {
try {
  const cycle = await Cycle.findById(req.params.id)

      if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

        if (cycle.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {startDate, endDate, flow, notes} = req.body


    // Update fields if provided
    if (startDate) cycle.startDate = startDate;
    if (flow) cycle.flow = flow;
    if (notes) cycle.notes = notes;

    // Recalculate period length if endDate is updated
    if (endDate) {
      cycle.endDate = endDate;
      cycle.periodLength = calculatePeriodLength(
        cycle.startDate,
        endDate
      );
    }

   const updatedCycle = await cycle.save();
    res.json(updatedCycle);
} catch (error) {
  console.error('Error in updateCycleById controller ')
  res.status(500).json({ message: error.message })
}
}


// Delete cycle by Id
export async function deleteCycleById(req,res) {
  try {
        const cycle = await Cycle.findById(req.params.id);

    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }

    if (cycle.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await cycle.deleteOne();
    res.json({ message: 'Cycle removed' });
  } catch (error) {
      console.error('Error in deleteCycleById controller ')
  res.status(500).json({ message: error.message })
  }
}