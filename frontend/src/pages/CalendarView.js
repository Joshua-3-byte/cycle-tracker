import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { isSameDay, parseISO, addDays, isWithinInterval } from 'date-fns';
import { getCycles, getPrediction } from '../utils/api';
import '../Calendar.css';
import Navbar from '../components/Navbar';

const CalendarView = () => {
  const [cycles, setCycles] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cyclesRes, predictionRes] = await Promise.all([
        getCycles(),
        getPrediction().catch(() => null),
      ]);

      setCycles(cyclesRes.data);
      if (predictionRes) {
        setPrediction(predictionRes.data);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Check if a date is a period day (from logged cycles)
  const isPeriodDay = (date) => {
    return cycles.some((cycle) => {
      const start = parseISO(cycle.startDate);
      const end = cycle.endDate ? parseISO(cycle.endDate) : start;

      return isWithinInterval(date, { start, end });
    });
  };

  // Helper: Check if a date is in the predicted next period
  const isPredictedPeriodDay = (date) => {
    if (!prediction) return false;

    const start = parseISO(prediction.nextPeriodStart);
    const end = parseISO(prediction.nextPeriodEnd);

    return isWithinInterval(date, { start, end });
  };

  // Helper: Check if a date is in the fertile window
  const isFertileDay = (date) => {
    if (!prediction) return false;

    const start = parseISO(prediction.fertileWindowStart);
    const end = parseISO(prediction.fertileWindowEnd);

    return isWithinInterval(date, { start, end });
  };

  // Helper: Check if a date is ovulation day
  const isOvulationDay = (date) => {
    if (!prediction) return false;
    return isSameDay(date, parseISO(prediction.ovulationDay));
  };

  // Add custom classes to calendar tiles
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const classes = [];

    if (isPeriodDay(date)) {
      classes.push('period-day');
    } else if (isPredictedPeriodDay(date)) {
      classes.push('predicted-period-day');
    } else if (isOvulationDay(date)) {
      classes.push('ovulation-day');
    } else if (isFertileDay(date)) {
      classes.push('fertile-day');
    }

    return classes.join(' ');
  };

  // Add content to calendar tiles (optional - for showing notes)
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const cycleForDate = cycles.find((cycle) => {
      const start = parseISO(cycle.startDate);
      return isSameDay(date, start);
    });

    if (cycleForDate && cycleForDate.notes) {
      return (
        <div style={{ fontSize: '10px', marginTop: '2px' }} title={cycleForDate.notes}>
          📝
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '24px', color: '#9b59b6' }}>Loading calendar...</div>
      </div>
    );
  }

  return (
    <>

    <Navbar />
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h1 style={{ color: '#6c3483', marginBottom: '10px' }}> Your Cycle Calendar</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Track your cycle patterns and predictions at a glance
        </p>

        {/* Calendar */}
        <div className="card" style={{ padding: '30px' }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            showNeighboringMonth={false}
          />

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color period"></div>
              <span>Period Days</span>
            </div>
            <div className="legend-item">
              <div className="legend-color predicted"></div>
              <span>Predicted Period</span>
            </div>
            <div className="legend-item">
              <div className="legend-color fertile"></div>
              <span>Fertile Window</span>
            </div>
            <div className="legend-item">
              <div className="legend-color ovulation"></div>
              <span>Ovulation Day 🥚</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {cycles.length > 0 && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#9b59b6', marginBottom: '15px' }}> Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Cycles Logged</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>{cycles.length}</div>
              </div>
              {prediction && (
                <>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Avg Cycle Length</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff69b4' }}>
                      {prediction.avgCycleLength} days
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Avg Period Length</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
                      {prediction.avgPeriodLength} days
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {cycles.length === 0 && (
          <div className="card" style={{ marginTop: '20px', textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#9b59b6', marginBottom: '10px' }}>No cycles logged yet</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Start tracking your cycles to see them visualized on the calendar
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default CalendarView;