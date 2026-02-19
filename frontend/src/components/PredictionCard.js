const PredictionCard = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="card">
        <h3 style={{ color: '#9b59b6' }}> Predictions</h3>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Log at least 2 cycles to see predictions
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, #9b59b6 0%, #ff69b4 100%)' }}>
      <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}> Your Predictions</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px'
      }}>
        
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', marginBottom: '5px' }}>
            Next Period
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', wordBreak: 'break-word' }}>
            {formatDate(prediction.nextPeriodStart)}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', marginBottom: '5px' }}>
            Ovulation Day
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', wordBreak: 'break-word' }}>
            {formatDate(prediction.ovulationDay)}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', marginBottom: '5px' }}>
            Fertile Window
          </div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', wordBreak: 'break-word' }}>
            {formatDate(prediction.fertileWindowStart)} - {formatDate(prediction.fertileWindowEnd)}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', marginBottom: '5px' }}>
            Avg Cycle Length
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
            {prediction.avgCycleLength} days
          </div>
        </div>

      </div>
    </div>
  );
};

export default PredictionCard;