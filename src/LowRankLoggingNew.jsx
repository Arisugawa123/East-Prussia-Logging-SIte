import React, { useState } from 'react';
import './LowRankLoggingNew.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const LowRankLoggingNew = () => {
  const [personnelData, setPersonnelData] = useState([
    {
      id: 1,
      rank: "Schütze",
      username: "Weber_J",
      basicTraining: 15,
      combatTraining: 12,
      internalPracticalRaid: 8,
      practiceRaid: 5,
      status: "Active"
    },
    {
      id: 2,
      rank: "Gefreiter",
      username: "Klein_M",
      basicTraining: 20,
      combatTraining: 18,
      internalPracticalRaid: 12,
      practiceRaid: 9,
      status: "Ready for NCO"
    },
    {
      id: 3,
      rank: "Obergefreiter",
      username: "Richter_S",
      basicTraining: 14,
      combatTraining: 10,
      internalPracticalRaid: 6,
      practiceRaid: 3,
      status: "In Training"
    },
    {
      id: 4,
      rank: "Hauptgefreiter",
      username: "Neumann_T",
      basicTraining: 25,
      combatTraining: 22,
      internalPracticalRaid: 15,
      practiceRaid: 12,
      status: "Ready for NCO"
    },
    {
      id: 5,
      rank: "Stabsgefreiter",
      username: "Braun_L",
      basicTraining: 18,
      combatTraining: 16,
      internalPracticalRaid: 10,
      practiceRaid: 7,
      status: "Active"
    },
    {
      id: 6,
      rank: "Schütze",
      username: "Zimmermann_K",
      basicTraining: 8,
      combatTraining: 5,
      internalPracticalRaid: 2,
      practiceRaid: 1,
      status: "Needs Improvement"
    },
    {
      id: 7,
      rank: "Gefreiter",
      username: "Krüger_R",
      basicTraining: 16,
      combatTraining: 13,
      internalPracticalRaid: 9,
      practiceRaid: 6,
      status: "Active"
    },
    {
      id: 8,
      rank: "Obergefreiter",
      username: "Lehmann_A",
      basicTraining: 17,
      combatTraining: 14,
      internalPracticalRaid: 11,
      practiceRaid: 8,
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
            {personnelData.map((person) => (
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
                <td className="status-cell">
                  {person.status}
                </td>
              </tr>
            ))}
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