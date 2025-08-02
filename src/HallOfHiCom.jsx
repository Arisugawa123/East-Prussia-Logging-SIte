import React, { useState, useEffect } from 'react';
import './HallOfHiCom.css';
import { personnelService, subscriptions, utils } from './lib/supabase';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaSpinner, FaSync } from 'react-icons/fa';

const HallOfHiCom = ({ readOnly = false, userRank = 'LOW_RANK' }) => {
  const [personnelData, setPersonnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Load High Command personnel from Supabase
  useEffect(() => {
    loadHighCommandData();
    
    // Set up real-time subscriptions
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      loadHighCommandData();
    });

    return () => {
      personnelSubscription.unsubscribe();
    };
  }, []);

  const loadHighCommandData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all personnel from database
      const allPersonnel = await personnelService.getAllPersonnel();
      
      // Filter for High Command ranks only
      const highCommandPersonnel = allPersonnel
        .filter(person => ['Oberst', 'Oberstleutnant', 'Major'].includes(person.rank))
        .map(person => ({
          id: person.id,
          highCommandRank: person.rank,
          username: person.username,
          promotedBy: person.promoted_by || 'General Staff Command',
          promotedIn: utils.formatDate(person.date_joined),
          retiredOn: person.status === 'retired' ? utils.formatDate(person.retired_date) : 'Still on Duty'
        }))
        .sort((a, b) => utils.getRankOrder(a.highCommandRank) - utils.getRankOrder(b.highCommandRank));

      setPersonnelData(highCommandPersonnel);

    } catch (err) {
      console.error('Error loading High Command data:', err);
      setError('Failed to load High Command data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (personId, field) => {
    // Prevent editing if user has read-only access
    if (readOnly) {
      alert('You have read-only access. Only officers and above can edit High Command data.');
      return;
    }
    
    const person = personnelData.find(p => p.id === personId);
    if (person && (field === 'username' || field === 'promotedBy' || field === 'promotedIn' || field === 'retiredOn')) {
      setEditingCell({ personId, field });
      setEditValue(person[field]);
    }
  };

  const handleCellSave = async () => {
    if (editingCell) {
      const { personId, field } = editingCell;
      const person = personnelData.find(p => p.id === personId);

      // Only proceed if the value actually changed
      if (person && person[field] !== editValue) {
        try {
          // Prepare database update based on field
          let dbUpdate = {};
          
          switch(field) {
            case 'username':
              dbUpdate.username = editValue;
              break;
            case 'promotedBy':
              dbUpdate.promoted_by = editValue;
              break;
            case 'promotedIn':
              // Convert date format for database
              dbUpdate.date_joined = new Date(editValue).toISOString();
              break;
            case 'retiredOn':
              if (editValue === 'Still on Duty') {
                dbUpdate.status = 'active';
                dbUpdate.retired_date = null;
              } else {
                dbUpdate.status = 'retired';
                dbUpdate.retired_date = new Date(editValue).toISOString();
              }
              break;
          }

          // Update in database
          await personnelService.updatePersonnel(personId, dbUpdate);

          // Update local state to reflect changes
          setPersonnelData(prev => prev.map(person => 
            person.id === personId 
              ? { ...person, [field]: editValue }
              : person
          ));

          console.log(`Successfully updated ${field} for ${person.username}`);
          
        } catch (error) {
          console.error('Error updating High Command data:', error);
          alert('Failed to save changes. Please try again.');
          // Revert the edit value on error
          setEditValue(person[field]);
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
      <div className="hicom-logging">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading High Command data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hicom-logging">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadHighCommandData} className="retry-button">
            <FaSync />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hicom-logging">
      <div className="hicom-header">
        <div className="hicom-header-wrapper">
          <div className="hicom-header-brand">
            <div className="hicom-logo-container">
              <div className="hicom-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="hicom-brand-logo" />
              </div>
              <div className="hicom-brand-text">
                <span className="hicom-brand-title">Prussia Hall of High Command</span>
                <span className="hicom-brand-subtitle">Distinguished leadership and command structure</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Background Effects */}
        <div className="hicom-header-bg-effects">
          <div className="hicom-header-particle"></div>
          <div className="hicom-header-particle"></div>
          <div className="hicom-header-particle"></div>
        </div>
      </div>

      <div className="hicom-table-container">
        <table className={`hicom-table ${readOnly ? 'read-only' : ''}`}>
          <thead>
            <tr>
              <th>High Command Rank</th>
              <th>Username</th>
              <th>Promoted By</th>
              <th>Promoted In</th>
              <th>Retired On</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.length > 0 ? personnelData.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.highCommandRank}</td>
                <td 
                  className={`username-cell ${editingCell?.personId === person.id && editingCell?.field === 'username' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'username')}
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit username'}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'username' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="username-input"
                    />
                  ) : (
                    person.username
                  )}
                </td>
                <td 
                  className={`promoted-by-cell ${editingCell?.personId === person.id && editingCell?.field === 'promotedBy' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'promotedBy')}
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit promoted by'}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'promotedBy' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="promoted-by-input"
                    />
                  ) : (
                    person.promotedBy
                  )}
                </td>
                <td 
                  className={`date-cell ${editingCell?.personId === person.id && editingCell?.field === 'promotedIn' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'promotedIn')}
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit promotion date'}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'promotedIn' ? (
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
                    person.promotedIn
                  )}
                </td>
                <td 
                  className={`retired-cell ${person.retiredOn === 'Still on Duty' ? 'still-duty' : ''} ${editingCell?.personId === person.id && editingCell?.field === 'retiredOn' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'retiredOn')}
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit retirement status'}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'retiredOn' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="retired-input"
                      placeholder="Still on Duty or date"
                    />
                  ) : (
                    person.retiredOn
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', fontStyle: 'italic', color: '#6c757d'}}>
                  No High Command personnel found. Promote personnel to Major, Oberstleutnant, or Oberst ranks.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="hicom-instructions">
        <h3>
          <FaClipboardList className="instruction-header-icon" />
          Instructions
        </h3>
        <ul>
          <li>
            <FaMouse className="instruction-icon" />
            <span>Click on any field to edit personnel information</span>
          </li>
          <li>
            <FaKeyboard className="instruction-icon" />
            <span>Press Enter to save changes or Escape to cancel</span>
          </li>
          <li>
            <FaChartBar className="instruction-icon" />
            <span>High Command consists only of Major, Oberstleutnant, and Oberst ranks</span>
          </li>
          {readOnly && (
            <li style={{ color: '#dc3545', fontWeight: 'bold' }}>
              <FaClipboardList className="instruction-icon" />
              <span>READ-ONLY ACCESS: You can view data but cannot make changes. Contact an officer for modifications.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HallOfHiCom;