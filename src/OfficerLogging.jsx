import React, { useState, useEffect } from 'react';
import './OfficerLogging.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaSpinner, FaSync } from 'react-icons/fa';
import { loggingService, personnelService, subscriptions, utils } from './lib/supabase';

const OfficerLogging = () => {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Load Officer data from Supabase
  useEffect(() => {
    loadOfficerData();
    
    // Set up real-time subscriptions for both personnel and promotion changes
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      console.log('Personnel data changed, reloading Officer data...');
      loadOfficerData();
    });

    // Listen for promotion events
    const handlePromotionUpdate = () => {
      console.log('Promotion detected, reloading Officer data...');
      setTimeout(() => loadOfficerData(), 1000); // Add delay to ensure DB is updated
    };

    window.addEventListener('promotionLogsUpdated', handlePromotionUpdate);
    
    // Also listen for custom personnel update events
    const handlePersonnelUpdate = () => {
      console.log('Personnel update detected, reloading Officer data...');
      setTimeout(() => loadOfficerData(), 500);
    };
    
    window.addEventListener('personnelUpdated', handlePersonnelUpdate);

    return () => {
      personnelSubscription.unsubscribe();
      window.removeEventListener('promotionLogsUpdated', handlePromotionUpdate);
      window.removeEventListener('personnelUpdated', handlePersonnelUpdate);
    };
  }, []);

  const loadOfficerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const allPersonnel = await personnelService.getAllPersonnel();
      const officerPersonnel = allPersonnel.filter(person => 
        ['Sekondeleutnant', 'Premierleutnant', 'Hauptmann'].includes(person.rank)
      );

      const existingLogs = await loggingService.getOfficerLogs();
      const officerData = [];
      
      for (const person of officerPersonnel) {
        let existingLog = existingLogs.find(log => log.personnel_id === person.id);
        
        if (!existingLog) {
          const newLogData = {
            personnel_id: person.id,
            rank: person.rank,
            username: person.username,
            command_assignments: JSON.stringify({
              hostedBT: 0, hostedCT: 0, hostedPR: 0, recruitmentTraining: 0
            }),
            strategic_planning: 'New Officer - Developing strategic skills',
            officer_training: 'Basic officer training completed',
            leadership_assessment: 'Assessment pending',
            mission_reports: 'No missions assigned yet',
            last_activity_date: new Date().toISOString().split('T')[0],
            logged_by: 'System'
          };
          existingLog = await loggingService.addOfficerLog(newLogData);
        } else {
          // Update existing log with current rank from personnel table
          if (existingLog.rank !== person.rank) {
            console.log(`Updating Officer log rank from ${existingLog.rank} to ${person.rank} for ${person.username}`);
            await loggingService.updateOfficerLog(existingLog.id, {
              rank: person.rank,
              username: person.username
            });
            existingLog.rank = person.rank;
            existingLog.username = person.username;
          }
        }
        
        let trainingScores = { hostedBT: 0, hostedCT: 0, hostedPR: 0, recruitmentTraining: 0 };
        try {
          if (existingLog.command_assignments) {
            trainingScores = JSON.parse(existingLog.command_assignments);
          }
        } catch (e) {
          console.warn('Failed to parse Officer training scores for', person.username);
        }
        
        let status = existingLog.status || 'None';
        
        officerData.push({
          id: existingLog.id,
          rank: person.rank, // Use current rank from personnel table, not cached log
          username: person.username, // Use current username from personnel table
          hostedBT: trainingScores.hostedBT || 0,
          hostedCT: trainingScores.hostedCT || 0,
          hostedPR: trainingScores.hostedPR || 0,
          recruitmentTraining: trainingScores.recruitmentTraining || 0,
          status: status
        });
      }

      setPersonnelData(officerData.sort((a, b) => utils.getRankOrder(a.rank) - utils.getRankOrder(b.rank)));

    } catch (err) {
      console.error('Error loading Officer data:', err);
      setError(`Failed to load Officer data: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && (typeof person[field] === 'number' || field === 'status')) {
      setEditingCell({ personId, field });
      setEditValue(field === 'status' ? person[field] : person[field].toString());
    }
  };

  const handleStatusSave = async (newStatusValue = null) => {
    const statusValue = newStatusValue || editValue;
    console.log('Officer handleStatusSave called', { 
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
          console.log('Updating Officer status in database...');
          
          await loggingService.updateOfficerLog(personId, {
            leadership_assessment: `Status updated to: ${statusValue}`,
            status: statusValue, // Save status directly
            last_activity_date: new Date().toISOString().split('T')[0]
          });

          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, status: statusValue }
              : p
          ));

          console.log(`✅ Successfully updated Officer status for personnel ${personId} to ${statusValue}`);
          
        } catch (error) {
          console.error('❌ Error updating Officer status:', error);
          alert('Failed to update status. Please try again.');
          return;
        }
      } else {
        console.log('No Officer status change needed or person not found');
      }
      
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleCellSave = async () => {
    if (editingCell) {
      // Handle status field separately
      if (editingCell.field === 'status') {
        return handleStatusSave();
      }

      const { personId, field } = editingCell;
      const person = personnelData.find(p => p.id === personId);
      const newValue = parseInt(editValue);

      if (!isNaN(newValue) && newValue >= 0 && person) {
        try {
          const updatedScores = {
            hostedBT: person.hostedBT,
            hostedCT: person.hostedCT,
            hostedPR: person.hostedPR,
            recruitmentTraining: person.recruitmentTraining,
            [field]: newValue
          };

          await loggingService.updateOfficerLog(personId, {
            command_assignments: JSON.stringify(updatedScores),
            leadership_assessment: `Training progress updated. Status: ${person.status}`,
            last_activity_date: new Date().toISOString().split('T')[0]
          });

          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, [field]: newValue }
              : p
          ));

          console.log(`Updated ${field} for ${person.username} to ${newValue}`);
          
        } catch (error) {
          console.error('Error updating Officer training data:', error);
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
      <div className="officer-logging">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading Officer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="officer-logging">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadOfficerData} className="retry-button">
            <FaSync />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="officer-logging">
      <div className="officer-header">
        <div className="officer-header-wrapper">
          <div className="officer-header-brand">
            <div className="officer-logo-container">
              <div className="officer-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="officer-brand-logo" />
              </div>
              <div className="officer-brand-text">
                <span className="officer-brand-title">Prussia Officer Management</span>
                <span className="officer-brand-subtitle">Training progress tracking for officer personnel</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Background Effects */}
        <div className="officer-header-bg-effects">
          <div className="officer-header-particle"></div>
          <div className="officer-header-particle"></div>
          <div className="officer-header-particle"></div>
        </div>
      </div>

      <div className="officer-table-container">
        <table className="officer-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Hosted BT</th>
              <th>Hosted CT</th>
              <th>Hosted PR</th>
              <th>Recruitment Training</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.length > 0 ? personnelData.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.rank}</td>
                <td className="username-cell">{person.username}</td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'hostedBT' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'hostedBT')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'hostedBT' ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      min="0"
                      autoFocus
                      className="score-input"
                    />
                  ) : (
                    person.hostedBT
                  )}
                </td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'hostedCT' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'hostedCT')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'hostedCT' ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      min="0"
                      autoFocus
                      className="score-input"
                    />
                  ) : (
                    person.hostedCT
                  )}
                </td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'hostedPR' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'hostedPR')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'hostedPR' ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      min="0"
                      autoFocus
                      className="score-input"
                    />
                  ) : (
                    person.hostedPR
                  )}
                </td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'recruitmentTraining' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'recruitmentTraining')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'recruitmentTraining' ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      min="0"
                      autoFocus
                      className="score-input"
                    />
                  ) : (
                    person.recruitmentTraining
                  )}
                </td>
                <td 
                  className={`status-cell ${editingCell?.personId === person.id && editingCell?.field === 'status' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'status')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'status' ? (
                    <select 
                      value={editValue}
                      onChange={async (e) => {
                        const newValue = e.target.value;
                        console.log('Officer Status dropdown changed from:', editValue, 'to:', newValue);
                        setEditValue(newValue);
                        
                        // Immediate save without timeout
                        console.log('Immediately calling Officer handleStatusSave with value:', newValue);
                        if (editingCell?.field === 'status') {
                          await handleStatusSave(newValue);
                        }
                      }}
                      onBlur={handleCellSave}
                      autoFocus
                      className="status-dropdown"
                    >
                      <option value="None">None</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                      <option value="Ready For Promotion">Ready For Promotion</option>
                    </select>
                  ) : (
                    person.status
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{textAlign: 'center', fontStyle: 'italic', color: '#6c757d'}}>
                  No Officer personnel found for training tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="officer-instructions">
        <h3>
          <FaClipboardList className="instruction-header-icon" />
          Instructions
        </h3>
        <ul>
          <li>
            <FaMouse className="instruction-icon" />
            <span>Click on any hosted training count to edit it</span>
          </li>
          <li>
            <FaKeyboard className="instruction-icon" />
            <span>Press Enter to save changes or Escape to cancel</span>
          </li>
          <li>
            <FaChartBar className="instruction-icon" />
            <span>Values represent number of training sessions hosted by each Officer</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OfficerLogging;