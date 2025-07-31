import React, { useState } from 'react';
import './HallOfHiCom.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const HallOfHiCom = () => {
  const [personnelData, setPersonnelData] = useState([
    {
      id: 1,
      highCommandRank: "Oberst",
      username: "von_Hindenburg_P",
      promotedBy: "General Staff Command",
      promotedIn: "2023-03-15",
      retiredOn: "Still on Duty"
    },
    {
      id: 2,
      highCommandRank: "Oberstleutnant",
      username: "von_Moltke_H",
      promotedBy: "Field Marshal von_Bismarck",
      promotedIn: "2023-07-22",
      retiredOn: "Still on Duty"
    }
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (personId, field) => {
    const person = personnelData.find(p => p.id === personId);
    if (person && (field === 'username' || field === 'promotedBy' || field === 'promotedIn' || field === 'retiredOn')) {
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

  return (
    <div className="hicom-logging">
      <div className="hicom-header">
        <div className="hicom-header-wrapper">
          <div className="hicom-header-brand">
            <div className="hicom-logo-container">
              <div className="hicom-logo-ring">
                <img src="/Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="hicom-brand-logo" />
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
        <table className="hicom-table">
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
            {personnelData.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.highCommandRank}</td>
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
                  className={`promoted-by-cell ${editingCell?.personId === person.id && editingCell?.field === 'promotedBy' ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'promotedBy')}
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
            ))}
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
            <span>High Command consists only of Oberst and Oberstleutnant ranks</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HallOfHiCom;