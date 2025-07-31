import React, { useState } from 'react';
import './NCOLogging.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const NCOLogging = () => {
  const [personnelData, setPersonnelData] = useState([
    {
      id: 1,
      rank: "Unteroffizier",
      username: "Schmidt_K",
      hostedBT: 15,
      hostedCT: 12,
      hostedPR: 8,
      recruitmentTraining: 5,
      status: "Active"
    },
    {
      id: 2,
      rank: "Feldwebel",
      username: "Mueller_H",
      hostedBT: 20,
      hostedCT: 18,
      hostedPR: 12,
      recruitmentTraining: 9,
      status: "Ready for OA"
    },
    {
      id: 3,
      rank: "Oberfeldwebel",
      username: "Weber_F",
      hostedBT: 14,
      hostedCT: 10,
      hostedPR: 6,
      recruitmentTraining: 3,
      status: "In Training"
    },
    {
      id: 4,
      rank: "Stabsfeldwebel",
      username: "Fischer_M",
      hostedBT: 25,
      hostedCT: 22,
      hostedPR: 15,
      recruitmentTraining: 12,
      status: "Ready for OA"
    },
    {
      id: 5,
      rank: "Hauptfeldwebel",
      username: "Wagner_A",
      hostedBT: 18,
      hostedCT: 16,
      hostedPR: 10,
      recruitmentTraining: 7,
      status: "Active"
    },
    {
      id: 6,
      rank: "Unteroffizier",
      username: "Becker_L",
      hostedBT: 8,
      hostedCT: 5,
      hostedPR: 2,
      recruitmentTraining: 1,
      status: "Needs Improvement"
    },
    {
      id: 7,
      rank: "Feldwebel",
      username: "Schulz_R",
      hostedBT: 16,
      hostedCT: 13,
      hostedPR: 9,
      recruitmentTraining: 6,
      status: "Active"
    },
    {
      id: 8,
      rank: "Oberfeldwebel",
      username: "Hoffmann_T",
      hostedBT: 17,
      hostedCT: 14,
      hostedPR: 11,
      recruitmentTraining: 8,
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
    <div className="nco-logging">
      <div className="nco-header">
        <div className="nco-header-wrapper">
          <div className="nco-header-brand">
            <div className="nco-logo-container">
              <div className="nco-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="nco-brand-logo" />
              </div>
              <div className="nco-brand-text">
                <span className="nco-brand-title">Prussia Non-Commission Officer Management</span>
                <span className="nco-brand-subtitle">Training progress tracking for NCO personnel</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Header Background Effects */}
        <div className="nco-header-bg-effects">
          <div className="nco-header-particle"></div>
          <div className="nco-header-particle"></div>
          <div className="nco-header-particle"></div>
        </div>
      </div>


      <div className="nco-table-container">
        <table className="nco-table">
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

      <div className="nco-instructions">
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
            <span>Values represent number of training sessions hosted by each NCO</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NCOLogging;