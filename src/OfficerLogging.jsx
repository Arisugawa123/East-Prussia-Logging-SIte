import React, { useState } from 'react';
import './OfficerLogging.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const OfficerLogging = () => {
  const [personnelData, setPersonnelData] = useState([
    {
      id: 1,
      rank: "Leutnant",
      username: "von_Weber_K",
      hostedBT: 25,
      hostedCT: 22,
      hostedPR: 18,
      recruitmentTraining: 15,
      status: "Active"
    },
    {
      id: 2,
      rank: "Oberleutnant",
      username: "von_Mueller_H",
      hostedBT: 30,
      hostedCT: 28,
      hostedPR: 22,
      recruitmentTraining: 19,
      status: "Ready for Promotion"
    },
    {
      id: 3,
      rank: "Hauptmann",
      username: "von_Schmidt_F",
      hostedBT: 35,
      hostedCT: 32,
      hostedPR: 25,
      recruitmentTraining: 20,
      status: "Active"
    },
    {
      id: 4,
      rank: "Major",
      username: "von_Fischer_M",
      hostedBT: 45,
      hostedCT: 42,
      hostedPR: 35,
      recruitmentTraining: 28,
      status: "Ready for Promotion"
    },
    {
      id: 5,
      rank: "Oberstleutnant",
      username: "von_Wagner_A",
      hostedBT: 38,
      hostedCT: 36,
      hostedPR: 28,
      recruitmentTraining: 22,
      status: "Active"
    },
    {
      id: 6,
      rank: "Leutnant",
      username: "von_Becker_L",
      hostedBT: 18,
      hostedCT: 15,
      hostedPR: 12,
      recruitmentTraining: 8,
      status: "In Training"
    },
    {
      id: 7,
      rank: "Hauptmann",
      username: "von_Schulz_R",
      hostedBT: 32,
      hostedCT: 29,
      hostedPR: 24,
      recruitmentTraining: 18,
      status: "Active"
    },
    {
      id: 8,
      rank: "Oberst",
      username: "von_Hoffmann_T",
      hostedBT: 50,
      hostedCT: 48,
      hostedPR: 40,
      recruitmentTraining: 35,
      status: "Active"
    }
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && typeof person[field] === 'number') {
      setEditingCell({ personId, field });
      setEditValue(person[field].toString());
    }
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newValue = parseInt(editValue);
      if (!isNaN(newValue) && newValue >= 0) {
        setPersonnelData(prev => prev.map(person => 
          person.id === editingCell.personId 
            ? { ...person, [editingCell.field]: newValue }
            : person
        ));
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

  return (
    <div className="officer-logging">
      <div className="officer-header">
        <div className="officer-header-wrapper">
          <div className="officer-header-brand">
            <div className="officer-logo-container">
              <div className="officer-logo-ring">
                <img src="/Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="officer-brand-logo" />
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
            {personnelData.map((person) => (
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
                <td className="status-cell">
                  {person.status}
                </td>
              </tr>
            ))}
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