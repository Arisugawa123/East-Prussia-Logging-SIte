import React, { useState } from 'react';
import './RetiredPersonnel.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const RetiredPersonnel = () => {
  const [personnelData, setPersonnelData] = useState([
    {
      id: 1,
      username: "von_Bismarck_O",
      date: "2023-12-15",
      reason: "Honorable discharge after 25 years of distinguished service"
    },
    {
      id: 2,
      username: "Mueller_H",
      date: "2023-11-20",
      reason: "Medical retirement"
    },
    {
      id: 3,
      username: "Schmidt_K",
      date: "2023-10-30",
      reason: "Voluntary retirement to pursue civilian career opportunities"
    },
    {
      id: 4,
      username: "von_Weber_F",
      date: "2023-09-18",
      reason: "Age retirement after reaching mandatory retirement age"
    },
    {
      id: 5,
      username: "Fischer_M",
      date: "2023-08-25",
      reason: "Family obligations requiring relocation outside service area"
    },
    {
      id: 6,
      username: "Wagner_A",
      date: "2023-07-12",
      reason: "Disability retirement due to service-related injury sustained during training exercise"
    },
    {
      id: 7,
      username: "Becker_L",
      date: "2023-06-08",
      reason: "Early retirement package acceptance"
    },
    {
      id: 8,
      username: "von_Schulz_R",
      date: "2023-05-14",
      reason: "Transfer to reserve status upon completion of active duty commitment"
    },
    {
      id: 9,
      username: "Hoffmann_T",
      date: "2023-04-22",
      reason: "Medical discharge"
    },
    {
      id: 10,
      username: "von_Klein_J",
      date: "2023-03-30",
      reason: "Honorable discharge for exemplary service and leadership contributions to the regiment"
    }
  ]);

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