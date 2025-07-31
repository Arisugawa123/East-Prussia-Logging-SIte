import React, { useState } from 'react';
import './InactivityNotice.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const InactivityNotice = () => {
  console.log("InactivityNotice component is rendering");
  const [personnelData, setPersonnelData] = useState([
    {
      id: 1,
      rank: "Hauptmann",
      username: "Mueller_H",
      reason: "Medical leave",
      dateGone: "2024-01-15",
      dateReturn: "2024-02-15"
    },
    {
      id: 2,
      rank: "Feldwebel",
      username: "Schmidt_K",
      reason: "Family emergency requiring extended absence for personal matters",
      dateGone: "2024-01-20",
      dateReturn: "2024-02-10"
    },
    {
      id: 3,
      rank: "Unteroffizier",
      username: "Weber_F",
      reason: "Military training course at external facility",
      dateGone: "2024-01-10",
      dateReturn: "2024-01-30"
    },
    {
      id: 4,
      rank: "Gefreiter",
      username: "Fischer_M",
      reason: "Vacation",
      dateGone: "2024-01-25",
      dateReturn: "2024-02-05"
    },
    {
      id: 5,
      rank: "Oberleutnant",
      username: "Wagner_A",
      reason: "Temporary assignment to headquarters for administrative duties and strategic planning",
      dateGone: "2024-01-12",
      dateReturn: "2024-02-20"
    },
    {
      id: 6,
      rank: "Stabsgefreiter",
      username: "Becker_L",
      reason: "Sick leave",
      dateGone: "2024-01-18",
      dateReturn: "2024-01-28"
    },
    {
      id: 7,
      rank: "Leutnant",
      username: "Schulz_R",
      reason: "Educational leave for advanced military studies and leadership development program",
      dateGone: "2024-01-08",
      dateReturn: "2024-03-01"
    },
    {
      id: 8,
      rank: "Hauptgefreiter",
      username: "Hoffmann_T",
      reason: "Personal leave",
      dateGone: "2024-01-22",
      dateReturn: "2024-02-12"
    }
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && (field === 'reason' || field === 'dateGone' || field === 'dateReturn')) {
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
            </tr>
          </thead>
          <tbody>
            {personnelData.map((person) => (
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
              </tr>
            ))}
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