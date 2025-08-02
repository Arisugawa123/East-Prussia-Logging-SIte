import React, { useState, useEffect } from 'react';
import './LowRankLoggingNew.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaSpinner, FaSync } from 'react-icons/fa';
import { loggingService, personnelService, subscriptions, utils } from './lib/supabase';

const LowRankLoggingNew = () => {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Load low rank training data from Supabase
  useEffect(() => {
    loadLowRankData();
    
    // Set up real-time subscriptions for both personnel and promotion changes
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      console.log('Personnel data changed, reloading Low Rank data...');
      loadLowRankData();
    });

    // Listen for promotion events
    const handlePromotionUpdate = () => {
      console.log('Promotion detected, reloading Low Rank data...');
      setTimeout(() => loadLowRankData(), 1000); // Add delay to ensure DB is updated
    };

    window.addEventListener('promotionLogsUpdated', handlePromotionUpdate);
    
    // Also listen for custom personnel update events
    const handlePersonnelUpdate = () => {
      console.log('Personnel update detected, reloading Low Rank data...');
      setTimeout(() => loadLowRankData(), 500);
    };
    
    window.addEventListener('personnelUpdated', handlePersonnelUpdate);

    return () => {
      personnelSubscription.unsubscribe();
      window.removeEventListener('promotionLogsUpdated', handlePromotionUpdate);
      window.removeEventListener('personnelUpdated', handlePersonnelUpdate);
    };
  }, []);

  const loadLowRankData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get low rank personnel and their training logs
      const allPersonnel = await personnelService.getAllPersonnel();
      const lowRankPersonnel = allPersonnel.filter(person => 
        ['Rekrut', 'Musketier', 'Gefreiter', 'Frei Korporal'].includes(person.rank)
      );

      // Get existing logs
      const existingLogs = await loggingService.getLowRankLogs();
      console.log('Raw logs from database:', existingLogs);
      console.log('Logs with status:', existingLogs.filter(log => log.status && log.status !== 'None'));
      
      // Create training data for personnel
      const trainingData = [];
      
      for (const person of lowRankPersonnel) {
        let existingLog = existingLogs.find(log => log.personnel_id === person.id);
        
        if (!existingLog) {
          // Create new training log entry for this person
          const newLogData = {
            personnel_id: person.id,
            rank: person.rank,
            username: person.username,
            training_completed: JSON.stringify({
              basicTraining: 0,
              combatTraining: 0,
              internalPracticalRaid: 0,
              practiceRaid: 0
            }),
            performance_notes: 'New recruit - Training in progress',
            disciplinary_actions: 'None',
            last_activity_date: new Date().toISOString().split('T')[0],
            logged_by: 'System'
          };
          
          existingLog = await loggingService.addLowRankLog(newLogData);
        } else {
          // Update existing log with current rank from personnel table
          if (existingLog.rank !== person.rank) {
            console.log(`Updating Low Rank log rank from ${existingLog.rank} to ${person.rank} for ${person.username}`);
            await loggingService.updateLowRankLog(existingLog.id, {
              rank: person.rank,
              username: person.username
            });
            existingLog.rank = person.rank;
            existingLog.username = person.username;
          }
        }
        
        // Parse training scores from JSON or set defaults
        let trainingScores = { basicTraining: 0, combatTraining: 0, internalPracticalRaid: 0, practiceRaid: 0 };
        try {
          if (existingLog.training_completed) {
            trainingScores = JSON.parse(existingLog.training_completed);
          }
        } catch (e) {
          console.warn('Failed to parse training scores for', person.username);
        }
        
        // Get status from database or set default
        let status = existingLog.status || 'None';
        console.log(`Loading status for ${person.username}:`, {
          logId: existingLog.id,
          personnelId: person.id,
          statusFromDB: existingLog.status,
          finalStatus: status,
          fullLogData: existingLog
        });
        
        trainingData.push({
          id: existingLog.id,
          rank: person.rank, // Use current rank from personnel table, not cached log
          username: person.username, // Use current username from personnel table
          basicTraining: trainingScores.basicTraining || 0,
          combatTraining: trainingScores.combatTraining || 0,
          internalPracticalRaid: trainingScores.internalPracticalRaid || 0,
          practiceRaid: trainingScores.practiceRaid || 0,
          status: status
        });
      }

      setPersonnelData(trainingData.sort((a, b) => utils.getRankOrder(a.rank) - utils.getRankOrder(b.rank)));

    } catch (err) {
      console.error('Error loading low rank training data:', err);
      console.error('Full error details:', err.message, err.details, err.hint);
      setError(`Failed to load training data: ${err.message}. Please try again.`);
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
    console.log('handleStatusSave called', { 
      editingCell, 
      editValue, 
      newStatusValue, 
      statusValue,
      newStatusValueType: typeof newStatusValue 
    });
    
    if (editingCell && editingCell.field === 'status') {
      const { personId } = editingCell;
      const person = personnelData.find(p => p.id === personId);

      console.log('Status save attempt:', { personId, currentStatus: person?.status, newStatus: statusValue });

      console.log('Comparison check:', { 
        personExists: !!person, 
        currentStatus: person?.status, 
        newStatus: statusValue, 
        areEqual: person?.status === statusValue 
      });

      if (person && person.status !== statusValue) {
        try {
          console.log('Updating status in database...');
          
          // Update in database - save status in a dedicated field
          console.log('About to update database with:', {
            personId,
            statusValue,
            updateData: {
              performance_notes: `Status updated to: ${statusValue}`,
              status: statusValue,
              last_activity_date: new Date().toISOString().split('T')[0]
            }
          });
          
          const updateResult = await loggingService.updateLowRankLog(personId, {
            performance_notes: `Status updated to: ${statusValue}`,
            status: statusValue, // Save status directly
            last_activity_date: new Date().toISOString().split('T')[0]
          });
          
          console.log('Database update result:', updateResult);
          console.log('Database result status field:', updateResult?.status);
          
          // Verify the update worked by checking the returned status
          if (updateResult?.status !== statusValue) {
            console.error('❌ Database update failed! Expected status:', statusValue, 'but got:', updateResult?.status);
            alert(`Database update failed! Status should be "${statusValue}" but database returned "${updateResult?.status}"`);
            return;
          }

          // Update local state
          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, status: statusValue }
              : p
          ));

          console.log(`✅ Successfully updated status for personnel ${personId} to ${statusValue}`);
          
        } catch (error) {
          console.error('❌ Error updating status:', error);
          alert('Failed to update status. Please try again.');
          return;
        }
      } else {
        console.log('No status change needed or person not found');
      }
      
      setEditingCell(null);
      setEditValue('');
    } else {
      console.log('Not a status edit or editingCell is null');
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
          // Update training scores in database
          const updatedScores = {
            basicTraining: person.basicTraining,
            combatTraining: person.combatTraining,
            internalPracticalRaid: person.internalPracticalRaid,
            practiceRaid: person.practiceRaid,
            [field]: newValue
          };

          // Keep existing status when updating training scores
          const currentStatus = person.status;

          // Update in database
          await loggingService.updateLowRankLog(personId, {
            training_completed: JSON.stringify(updatedScores),
            performance_notes: `Training progress updated. Status: ${currentStatus}`,
            last_activity_date: new Date().toISOString().split('T')[0]
          });

          // Update local state
          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, [field]: newValue }
              : p
          ));

          console.log(`Updated ${field} for ${person.username} to ${newValue}`);
          
        } catch (error) {
          console.error('Error updating training data:', error);
          alert('Failed to save changes. Please try again.');
          return; // Don't clear editing state on error
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
      <div className="lowrank-logging">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading low rank training data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lowrank-logging">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadLowRankData} className="retry-button">
            <FaSync />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lowrank-logging">
      <div className="lowrank-header">
        <div className="lowrank-header-wrapper">
          <div className="lowrank-header-brand">
            <div className="lowrank-logo-container">
              <div className="lowrank-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="lowrank-brand-logo" />
              </div>
              <div className="lowrank-brand-text">
                <span className="lowrank-brand-title">Prussia Low Rank Management</span>
                <span className="lowrank-brand-subtitle">Training progress tracking for enlisted personnel</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Background Effects */}
        <div className="lowrank-header-bg-effects">
          <div className="lowrank-header-particle"></div>
          <div className="lowrank-header-particle"></div>
          <div className="lowrank-header-particle"></div>
        </div>
      </div>

      <div className="lowrank-table-container">
        <table className="lowrank-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Basic Training</th>
              <th>Combat Training</th>
              <th>Internal Practical Raid</th>
              <th>Practice Raid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.length > 0 ? personnelData.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.rank}</td>
                <td className="username-cell">{person.username}</td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'basicTraining' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'basicTraining')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'basicTraining' ? (
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
                    person.basicTraining
                  )}
                </td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'combatTraining' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'combatTraining')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'combatTraining' ? (
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
                    person.combatTraining
                  )}
                </td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'internalPracticalRaid' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'internalPracticalRaid')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'internalPracticalRaid' ? (
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
                    person.internalPracticalRaid
                  )}
                </td>
                <td 
                  className={`score-cell ${editingCell?.personId === person.id && editingCell?.field === 'practiceRaid' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'practiceRaid')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'practiceRaid' ? (
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
                    person.practiceRaid
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
                        console.log('Status dropdown changed from:', editValue, 'to:', newValue);
                        setEditValue(newValue);
                        
                        // Immediate save without timeout
                        console.log('Immediately calling handleStatusSave with value:', newValue);
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
                  No low rank personnel found for training tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="lowrank-instructions">
        <h3>
          <FaClipboardList className="instruction-header-icon" />
          Instructions
        </h3>
        <ul>
          <li>
            <FaMouse className="instruction-icon" />
            <span>Click on any training score to edit it</span>
          </li>
          <li>
            <FaKeyboard className="instruction-icon" />
            <span>Press Enter to save changes or Escape to cancel</span>
          </li>
          <li>
            <FaChartBar className="instruction-icon" />
            <span>Values represent completed training sessions for each enlisted personnel</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LowRankLoggingNew;