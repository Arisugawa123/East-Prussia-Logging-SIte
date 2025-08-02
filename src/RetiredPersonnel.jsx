import React, { useState } from 'react';
import './RetiredPersonnel.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const RetiredPersonnel = () => {
  const [personnelData, setPersonnelData] = useState([]);

  // Load retired personnel from localStorage on component mount
  React.useEffect(() => {
    const loadRetiredPersonnel = () => {
      const storedRetired = JSON.parse(localStorage.getItem('retiredPersonnel') || '[]');
      const defaultRetired = [
        {
          id: 1,
          username: "von_Bismarck_O",
          rank: "Oberst",
          date: "2023-12-15",
          reason: "Honorable discharge after 25 years of distinguished service",
          processedBy: "General Staff Command",
          originalCategory: "High Command",
          enlistedBy: "High Command Appointment",
          joinIn: "2020-01-10"
        },
        {
          id: 2,
          username: "Mueller_H",
          rank: "Hauptmann",
          date: "2023-11-20",
          reason: "Medical retirement",
          processedBy: "Medical Board",
          originalCategory: "Officers",
          enlistedBy: "Officer Academy Berlin",
          joinIn: "2021-03-15"
        },
        {
          id: 3,
          username: "Schmidt_K",
          rank: "Korporal",
          date: "2023-10-30",
          reason: "Voluntary retirement to pursue civilian career opportunities",
          processedBy: "Personnel Office",
          originalCategory: "NCOs",
          enlistedBy: "NCO Academy Berlin",
          joinIn: "2022-06-15"
        },
        {
          id: 4,
          username: "von_Weber_F",
          rank: "Major",
          date: "2023-09-18",
          reason: "Age retirement after reaching mandatory retirement age",
          processedBy: "Personnel Office",
          originalCategory: "Officers",
          enlistedBy: "General Staff Command",
          joinIn: "2020-03-15"
        },
        {
          id: 5,
          username: "Fischer_M",
          rank: "Gefreiter",
          date: "2023-08-25",
          reason: "Family obligations requiring relocation outside service area",
          processedBy: "Company Commander",
          originalCategory: "Low Ranks",
          enlistedBy: "Recruiting Office Munich",
          joinIn: "2023-03-10"
        }
      ];
      
      // Combine default data with stored data, avoiding duplicates
      const combinedData = [...defaultRetired];
      storedRetired.forEach(stored => {
        if (!combinedData.find(existing => existing.username === stored.username)) {
          combinedData.push(stored);
        }
      });
      
      // Sort by retirement date (newest first)
      combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setPersonnelData(combinedData);
    };

    loadRetiredPersonnel();

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadRetiredPersonnel();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    window.addEventListener('retiredPersonnelUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('retiredPersonnelUpdated', handleStorageChange);
    };
  }, []);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && (field === 'username' || field === 'date' || field === 'reason')) {
      setEditingCell({ personId, field });
      setEditValue(person[field]);
    }
  };

  const handleCellSave = () => {
    if (editingCell) {
      setPersonnelData(prev => prev.map(person => 
        person.id === editingCell.personId 
          ? { ...person, [editingCell.field]: editValue }
          : person
      ));
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
                <span className="retired-brand-subtitle">Records of honorably discharged regiment members</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Background Effects */}
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
              <th>Username</th>
              <th>Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {personnelData.map((person) => (
              <tr key={person.id}>
                <td 
                  className={`username-cell ${editingCell?.personId === person.id && editingCell?.field === 'username' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'username')}
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
              </tr>
            ))}
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
            <span>Click on any field to edit username, date, or reason</span>
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

export default RetiredPersonnel;