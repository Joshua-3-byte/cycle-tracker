const CycleList = ({ cycles, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (cycles.length === 0) {
    return (
      <div className="card">
        <h3 style={{ color: '#9b59b6' }}> Your Cycles</h3>
        <p style={{ color: '#666', marginTop: '10px' }}>No cycles logged yet. Start tracking!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}> Your Cycles</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {cycles.map((cycle) => (
          <div
            key={cycle._id}
            style={{
              border: '2px solid #e8daef',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '15px', 
                color: '#6c3483', 
                marginBottom: '8px',
                wordBreak: 'break-word'
              }}>
                {formatDate(cycle.startDate)}
                {cycle.endDate && ` - ${formatDate(cycle.endDate)}`}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                marginBottom: '5px'
              }}>
                <span className={`badge badge-${cycle.flow}`}>
                  {cycle.flow} flow
                </span>
                
                {cycle.periodLength && (
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    Period: {cycle.periodLength}d
                  </span>
                )}
                
                {cycle.cycleLength && (
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    Cycle: {cycle.cycleLength}d
                  </span>
                )}
              </div>
              
              {cycle.notes && (
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '13px', 
                  color: '#666', 
                  fontStyle: 'italic',
                  wordBreak: 'break-word'
                }}>
                  "{cycle.notes}"
                </div>
              )}
            </div>

            <button
              onClick={() => onDelete(cycle._id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff69b4',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '5px',
                flexShrink: 0,
              }}
              title="Delete cycle"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleList;