import { useState } from 'react';

const CycleForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    flow: 'medium',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ startDate: '', endDate: '', flow: 'medium', notes: '' });
  };

  return (
    <div className="card">
      <h3 style={{ color: '#9b59b6', marginBottom: '20px' }}>➕ Log New Cycle</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
            Period Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
            Period End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
            Flow Intensity
          </label>
          <select
            name="flow"
            value={formData.flow}
            onChange={handleChange}
            className="input-field"
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '600' }}>
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="input-field"
            placeholder="Symptoms, mood, etc."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-primary">
            Save Cycle
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CycleForm;