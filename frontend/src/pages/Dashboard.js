import { useState, useEffect } from 'react';
import { getCycles, createCycle, deleteCycle, getPrediction } from '../utils/api';
import PredictionCard from '../components/PredictionCard';
import CycleForm from '../components/CycleForm';
import CycleList from '../components/CycleList';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [cycles, setCycles] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCycle = async (formData) => {
    try {
      await createCycle(formData);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Create error:', error);
      alert(error.response?.data?.message || 'Failed to create cycle');
    }
  };

  const handleDeleteCycle = async (id) => {
    if (!window.confirm('Delete this cycle?')) return;
    
    try {
      console.log('Deleting cycle with ID:', id); // Debug log
      await deleteCycle(id);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error details:', error.response); // Debug log
      alert(error.response?.data?.message || 'Failed to delete cycle');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ fontSize: '24px', color: '#9b59b6' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <PredictionCard prediction={prediction} />

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
              style={{ marginBottom: '20px' }}
            >
              Log New Cycle
            </button>
          )}

          {showForm && (
            <CycleForm
              onSubmit={handleCreateCycle}
              onCancel={() => setShowForm(false)}
            />
          )}

          <CycleList cycles={cycles} onDelete={handleDeleteCycle} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
