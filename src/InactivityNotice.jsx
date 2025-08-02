import React, { useState, useEffect } from 'react';
import './InactivityNotice.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaSpinner, FaSync } from 'react-icons/fa';
import { loggingService, personnelService, subscriptions, utils } from './lib/supabase';

const InactivityNotice = () => {
  console.log("InactivityNotice component is rendering");
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Inactivity Notice data from Supabase
  useEffect(() => {
    loadInactivityData();
    
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      console.log('Personnel data changed, reloading Inactivity data...');
      loadInactivityData();
    });

    const handlePromotionUpdate = () => {
      console.log('Promotion detected, reloading Inactivity data...');
      setTimeout(() => loadInactivityData(), 1000);
    };

    window.addEventListener('promotionLogsUpdated', handlePromotionUpdate);
    
    const handlePersonnelUpdate = () => {
      console.log('Personnel update detected, reloading Inactivity data...');
      setTimeout(() => loadInactivityData(), 500);
    };
    
    window.addEventListener('personnelUpdated', handlePersonnelUpdate);

    return () => {
      personnelSubscription.unsubscribe();
      window.removeEventListener('promotionLogsUpdated', handlePromotionUpdate);
      window.removeEventListener('personnelUpdated', handlePersonnelUpdate);
    };
  }, []);

  const loadInactivityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const allPersonnel = await personnelService.getAllPersonnel();
      const existingNotices = await loggingService.getInactivityNotices();
      console.log('Raw inactivity notices from database:', existingNotices);
      
      const inactivityData = [];
      const currentDate = new Date();
      
      for (const person of allPersonnel) {
        let existingNotice = existingNotices.find(notice => notice.personnel_id === person.id);
        
        const lastSeenDate = person.date_joined ? new Date(person.date_joined) : new Date();
        const daysInactive = Math.floor((currentDate - lastSeenDate) / (1000 * 60 * 60 * 24));
        
        if (daysInactive > 7 || existingNotice) {
          if (!existingNotice) {
            const newNoticeData = {
              personnel_id: person.id,
              rank: person.rank,
              username: person.username,
              last_seen_date: lastSeenDate.toISOString().split('T')[0],
              days_inactive: daysInactive,
              notice_type: 'warning',
              reason_for_absence: 'Extended absence without notice',
              contact_attempts: 'Initial contact pending',
              action_taken: 'Notice generated',
              notice_date: currentDate.toISOString().split('T')[0],
              status: 'None',
              logged_by: 'System'
            };
            
            existingNotice = await loggingService.addInactivityNotice(newNoticeData);
          } else {
            // Always update rank and username to reflect current personnel data
            if (existingNotice.rank !== person.rank || existingNotice.username !== person.username) {
              console.log(`Updating Inactivity notice: ${existingNotice.username} (${existingNotice.rank}) → ${person.username} (${person.rank})`);
              await loggingService.updateInactivityNotice(existingNotice.id, {
                rank: person.rank,
                username: person.username,
                last_activity_date: new Date().toISOString().split('T')[0]
              });
              existingNotice.rank = person.rank;
              existingNotice.username = person.username;
            }
          }
          
          let status = existingNotice.status || 'None';
          
          inactivityData.push({
            id: existingNotice.id,
            rank: person.rank,
            username: person.username,
            reason: existingNotice.reason_for_absence || 'Unknown',
            dateGone: existingNotice.last_seen_date || lastSeenDate.toISOString().split('T')[0],
            dateReturn: existingNotice.action_taken || 'Pending',
            status: status
          });
        }
      }

      setPersonnelData(inactivityData);

    } catch (err) {
      console.error('Error loading Inactivity data:', err);
      setError(`Failed to load Inactivity data: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && (field === 'reason' || field === 'dateGone' || field === 'dateReturn' || field === 'status')) {
      setEditingCell({ personId, field });
      setEditValue(person[field]);
    }
  };

  const handleStatusSave = async (newStatusValue = null) => {
    const statusValue = newStatusValue || editValue;
    console.log('Inactivity handleStatusSave called', { 
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
          console.log('Updating Inactivity status in database...');
          
          await loggingService.updateInactivityNotice(personId, {
            action_taken: `Status updated to: ${statusValue}`,
            status: statusValue,
            notice_date: new Date().toISOString().split('T')[0]
          });

          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, status: statusValue }
              : p
          ));

          console.log(`✅ Successfully updated Inactivity status for personnel ${personId} to ${statusValue}`);
          
        } catch (error) {
          console.error('❌ Error updating Inactivity status:', error);
          alert('Failed to update status. Please try again.');
          return;
        }
      } else {
        console.log('No Inactivity status change needed or person not found');
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

      if (person && person[field] !== editValue) {
        try {
          // Map UI fields to database fields
          const dbFieldMap = {
            reason: 'reason_for_absence',
            dateGone: 'last_seen_date',
            dateReturn: 'action_taken'
          };

          const dbField = dbFieldMap[field] || field;
          
          await loggingService.updateInactivityNotice(personId, {
            [dbField]: editValue,
            notice_date: new Date().toISOString().split('T')[0]
          });

          setPersonnelData(prev => prev.map(p => 
            p.id === personId 
              ? { ...p, [field]: editValue }
              : p
          ));

          console.log(`Updated ${field} for ${person.username} to ${editValue}`);
          
        } catch (error) {
          console.error('Error updating Inactivity data:', error);
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

  const getReasonFontSize = (reason) => {
    if (reason.length > 80) return 'reason-text-small';
    if (reason.length > 50) return 'reason-text-medium';
    return 'reason-text-normal';
  };

  if (loading) {
    return (
      <div className="inactivity-logging">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading Inactivity Notice data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inactivity-logging">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadInactivityData} className="retry-button">
            <FaSync />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inactivity-logging">
      <div className="inactivity-header">
        <div className="inactivity-header-wrapper">
          <div className="inactivity-header-brand">
            <div className="inactivity-logo-container">
              <div className="inactivity-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="inactivity-brand-logo" />
              </div>
              <div className="inactivity-brand-text">
                <span className="inactivity-brand-title">Prussia Inactivity Notice</span>
                <span className="inactivity-brand-subtitle">Personnel absence tracking and management</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Background Effects */}
        <div className="inactivity-header-bg-effects">
          <div className="inactivity-header-particle"></div>
          <div className="inactivity-header-particle"></div>
          <div className="inactivity-header-particle"></div>
        </div>
      </div>

      <div className="inactivity-table-container">
        <table className="inactivity-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Reason</th>
              <th>Date Gone</th>
              <th>Date Return</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.length > 0 ? personnelData.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.rank}</td>
                <td className="username-cell">{person.username}</td>
                <td 
                  className={`reason-cell ${getReasonFontSize(person.reason)} ${editingCell?.personId === person.id && editingCell?.field === 'reason' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'reason')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'reason' ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="reason-input"
                      rows="2"
                    />
                  ) : (
                    person.reason
                  )}
                </td>
                <td 
                  className={`date-cell ${editingCell?.personId === person.id && editingCell?.field === 'dateGone' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'dateGone')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'dateGone' ? (
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
                    person.dateGone
                  )}
                </td>
                <td 
                  className={`date-cell ${editingCell?.personId === person.id && editingCell?.field === 'dateReturn' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'dateReturn')}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'dateReturn' ? (
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
                    person.dateReturn
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
                        console.log('Inactivity Status dropdown changed from:', editValue, 'to:', newValue);
                        setEditValue(newValue);
                        
                        // Immediate save without timeout
                        console.log('Immediately calling Inactivity handleStatusSave with value:', newValue);
                        if (editingCell?.field === 'status') {
                          await handleStatusSave(newValue);
                        }
                      }}
                      onBlur={() => {
                        if (editingCell?.field === 'status') {
                          handleStatusSave(editValue);
                        } else {
                          handleCellSave();
                        }
                      }}
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
                <td colSpan="5" style={{textAlign: 'center', fontStyle: 'italic', color: '#6c757d'}}>
                  No inactivity notices found. Personnel with extended absences will appear here automatically.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="inactivity-instructions">
        <h3>
          <FaClipboardList className="instruction-header-icon" />
          Instructions
        </h3>
        <ul>
          <li>
            <FaMouse className="instruction-icon" />
            <span>Click on any field to edit reason or dates</span>
          </li>
          <li>
            <FaKeyboard className="instruction-icon" />
            <span>Press Enter to save changes or Escape to cancel</span>
          </li>
          <li>
            <FaChartBar className="instruction-icon" />
            <span>Reason text automatically adjusts size based on length</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InactivityNotice;