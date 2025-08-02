// Clean RetiredPersonnel.jsx - copy this content to replace the current file

import React, { useState, useEffect } from 'react';
import './RetiredPersonnel.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaSpinner, FaSync } from 'react-icons/fa';
import { loggingService, personnelService, subscriptions, utils, supabase } from './lib/supabase';

const RetiredPersonnel = () => {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Load Retired Personnel data from Supabase
  useEffect(() => {
    loadRetiredData();
    
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      console.log('Personnel data changed, reloading Retired data...');
      loadRetiredData();
    });

    // Listen for promotion events to update ranks
    const handlePromotionUpdate = () => {
      console.log('Promotion detected, reloading Retired data to update ranks...');
      setTimeout(() => loadRetiredData(), 1000);
    };

    window.addEventListener('promotionLogsUpdated', handlePromotionUpdate);
    
    const handlePersonnelUpdate = () => {
      console.log('Personnel update detected, reloading Retired data...');
      setTimeout(() => loadRetiredData(), 500);
    };
    
    window.addEventListener('personnelUpdated', handlePersonnelUpdate);

    // Listen for retirement events
    const handleRetirementUpdate = () => {
      console.log('Retirement detected, reloading Retired data...');
      setTimeout(() => loadRetiredData(), 500);
    };
    
    window.addEventListener('personnelRetired', handleRetirementUpdate);

    return () => {
      personnelSubscription.unsubscribe();
      window.removeEventListener('promotionLogsUpdated', handlePromotionUpdate);
      window.removeEventListener('personnelUpdated', handlePersonnelUpdate);
      window.removeEventListener('personnelRetired', handleRetirementUpdate);
    };
  }, []);

  const loadRetiredData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading retired personnel data...');
      
      // Test direct Supabase query to bypass our service
      console.log('Testing direct Supabase query...');
      const { data: directData, error: directError } = await supabase
        .from('retired_personnel')
        .select('*');
      console.log('Direct Supabase query result:', { directData, directError, count: directData?.length });
      
      const retiredRecords = await loggingService.getRetiredPersonnel();
      console.log('Raw retired personnel from database:', retiredRecords);
      console.log('Number of retired records found:', retiredRecords.length);
      
      const retiredData = retiredRecords.map(record => {
        // Note: Retired personnel ranks should remain as rank_at_retirement
        // They don't get updated when active personnel are promoted
        return {
          id: record.id,
          username: record.username,
          rank: record.rank_at_retirement, // Keep retirement rank, don't update
          date: record.retirement_date,
          reason: record.retirement_reason || 'Not specified',
          processedBy: record.processed_by || 'System',
          originalCategory: record.final_position || record.rank_at_retirement,
          enlistedBy: 'Historical Record',
          joinIn: record.created_at ? record.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
        };
      });

      console.log('Processed retired data:', retiredData);
      console.log('Setting personnel data with', retiredData.length, 'records');
      setPersonnelData(retiredData);

    } catch (err) {
      console.error('Error loading Retired Personnel data:', err);
      console.error('Full error details:', err);
      setError(`Failed to load Retired Personnel data: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && (field === 'username' || field === 'date' || field === 'reason')) {
      setEditingCell({ personId, field });
      setEditValue(person[field]);
    }
  };

  const handleStatusSave = async (newStatusValue = null) => {
    const statusValue = newStatusValue || editValue;
    console.log('Retired Personnel handleStatusSave called', { 
      editingCell, 
      editValue, 
      newStatusValue, 
      statusValue,
      newStatusValueType: typeof newStatusValue 
    });
    
    if (editingCell && editingCell.field === 'status') {
      const { personId } = editingCell;
      const person = personnelData.find(p => p.id === personId);

      if (person && person.status !== statusValue) {
        try {
          console.log('Updating Retired Personnel status in database...');
          
          await loggingService.updateRetiredPersonnel(personId, {
            status: statusValue,
            updated_at: new Date().toISOString()
          });

          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, status: statusValue }
              : p
          ));

          console.log(`✅ Successfully updated Retired Personnel status for ${personId} to ${statusValue}`);
          
        } catch (error) {
          console.error('❌ Error updating Retired Personnel status:', error);
          alert('Failed to update status. Please try again.');
          return;
        }
      } else {
        console.log('No Retired Personnel status change needed or person not found');
      }
      
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellSave = async () => {
    if (editingCell) {
      const { personId, field } = editingCell;
      const person = personnelData.find(p => p.id === personId);

      if (person && person[field] !== editValue) {
        try {
          const dbFieldMap = {
            reason: 'retirement_reason',
            date: 'retirement_date'
          };

          const dbField = dbFieldMap[field] || field;
          
          await loggingService.updateRetiredPersonnel(personId, {
            [dbField]: editValue,
            updated_at: new Date().toISOString()
          });

          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, [field]: editValue }
              : p
          ));

          console.log(`Updated ${field} for ${person.username} to ${editValue}`);
          
        } catch (error) {
          console.error('Error updating Retired Personnel data:', error);
          alert('Failed to save changes. Please try again.');
          return;
        }
      }
      
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  if (loading) {
    return (
      <div className="retired-logging">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading Retired Personnel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retired-logging">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadRetiredData} className="retry-button">
            <FaSync />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="retired-logging">
      <div className="retired-header">
        <div className="retired-header-wrapper">
          <div className="retired-header-brand">
            <div className="retired-logo-container">
              <div className="retired-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="retired-brand-logo" />
              </div>
              <div className="retired-brand-text">
                <span className="retired-brand-title">Prussia Retired Personnel</span>
                <span className="retired-brand-subtitle">Honoring those who served with distinction</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="retired-header-bg-effects">
          <div className="retired-header-particle"></div>
          <div className="retired-header-particle"></div>
          <div className="retired-header-particle"></div>
        </div>
      </div>

      <div className="retired-table-container">
        <table className="retired-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.length > 0 ? personnelData.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.rank}</td>
                <td className="username-cell">{person.username}</td>
                <td 
                  className={`date-cell ${editingCell?.personId === person.id && editingCell?.field === 'date' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'date')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'date' ? (
                    <input
                      type="date"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="date-input"
                    />
                  ) : (
                    person.date
                  )}
                </td>
                <td 
                  className={`reason-cell ${editingCell?.personId === person.id && editingCell?.field === 'reason' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'reason')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'reason' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="reason-input"
                    />
                  ) : (
                    person.reason
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', fontStyle: 'italic', color: '#6c757d'}}>
                  No retired personnel found. Retired soldiers will appear here automatically.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="retired-instructions">
        <h3>
          <FaClipboardList className="instruction-header-icon" />
          Instructions
        </h3>
        <ul>
          <li>
            <FaMouse className="instruction-icon" />
            <span>Click on any field to edit retirement information</span>
          </li>
          <li>
            <FaKeyboard className="instruction-icon" />
            <span>Press Enter to save changes or Escape to cancel</span>
          </li>
          <li>
            <FaChartBar className="instruction-icon" />
            <span>Retired personnel are automatically added when soldiers are retired</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RetiredPersonnel;