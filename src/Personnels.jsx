import React, { useState } from 'react';
import './Personnels.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const Personnels = () => {
  const [showModal, setShowModal] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    rank: 'Recruit',
    username: '',
    enlistedBy: '',
    joinIn: ''
  });
  const [lowRankData, setLowRankData] = useState([
    {
      id: 1,
      rank: "Recruit",
      username: "Weber_J",
      enlistedBy: "Recruiting Office Berlin",
      joinIn: "2023-01-15"
    },
    {
      id: 2,
      rank: "Musketry",
      username: "Klein_M",
      enlistedBy: "Recruiting Office Hamburg",
      joinIn: "2023-02-20"
    },
    {
      id: 3,
      rank: "Gefreiter",
      username: "Richter_S",
      enlistedBy: "Recruiting Office Munich",
      joinIn: "2023-03-10"
    },
    {
      id: 4,
      rank: "Frei Korporal",
      username: "Neumann_T",
      enlistedBy: "Recruiting Office Dresden",
      joinIn: "2023-04-05"
    }
  ]);

  const [ncoData, setNcoData] = useState([
    {
      id: 1,
      rank: "Korporal",
      username: "Schmidt_K",
      enlistedBy: "NCO Academy Berlin",
      joinIn: "2022-06-15"
    },
    {
      id: 2,
      rank: "Sergeant",
      username: "Mueller_H",
      enlistedBy: "NCO Academy Hamburg",
      joinIn: "2022-07-20"
    },
    {
      id: 3,
      rank: "Junker",
      username: "Weber_F",
      enlistedBy: "NCO Academy Munich",
      joinIn: "2022-08-10"
    },
    {
      id: 4,
      rank: "Feldwebel",
      username: "Fischer_M",
      enlistedBy: "NCO Academy Dresden",
      joinIn: "2022-09-05"
    }
  ]);

  const [officerData, setOfficerData] = useState([
    {
      id: 1,
      rank: "Sekondeleutnant",
      username: "von_Weber_K",
      enlistedBy: "Officer Academy Berlin",
      joinIn: "2021-01-15"
    },
    {
      id: 2,
      rank: "Premierleutnant",
      username: "von_Mueller_H",
      enlistedBy: "Officer Academy Hamburg",
      joinIn: "2021-02-20"
    },
    {
      id: 3,
      rank: "Hauptmann",
      username: "von_Schmidt_F",
      enlistedBy: "Officer Academy Munich",
      joinIn: "2021-03-10"
    }
  ]);

  const [highCommandData, setHighCommandData] = useState([
    {
      id: 1,
      rank: "Major",
      username: "von_Hindenburg_P",
      enlistedBy: "General Staff Command",
      joinIn: "2020-03-15"
    },
    {
      id: 2,
      rank: "Obersleutnant",
      username: "von_Moltke_H",
      enlistedBy: "Field Marshal Command",
      joinIn: "2020-07-22"
    },
    {
      id: 3,
      rank: "Obert",
      username: "von_Bismarck_O",
      enlistedBy: "High Command Appointment",
      joinIn: "2020-01-10"
    }
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (personId, field, tableType) => {
    let person;
    switch(tableType) {
      case 'lowRank':
        person = lowRankData.find(p => p.id === personId);
        break;
      case 'nco':
        person = ncoData.find(p => p.id === personId);
        break;
      case 'officer':
        person = officerData.find(p => p.id === personId);
        break;
      case 'highCommand':
        person = highCommandData.find(p => p.id === personId);
        break;
    }
    
    if (person && (field === 'username' || field === 'enlistedBy' || field === 'joinIn')) {
      setEditingCell({ personId, field, tableType });
      setEditValue(person[field]);
    }
  };

  const handleCellSave = () => {
    if (editingCell) {
      const { personId, field, tableType } = editingCell;
      
      switch(tableType) {
        case 'lowRank':
          setLowRankData(prev => prev.map(person => 
            person.id === personId ? { ...person, [field]: editValue } : person
          ));
          break;
        case 'nco':
          setNcoData(prev => prev.map(person => 
            person.id === personId ? { ...person, [field]: editValue } : person
          ));
          break;
        case 'officer':
          setOfficerData(prev => prev.map(person => 
            person.id === personId ? { ...person, [field]: editValue } : person
          ));
          break;
        case 'highCommand':
          setHighCommandData(prev => prev.map(person => 
            person.id === personId ? { ...person, [field]: editValue } : person
          ));
          break;
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

  const handleAddPersonnel = () => {
    if (!newPersonnel.username || !newPersonnel.enlistedBy || !newPersonnel.joinIn) {
      alert('Please fill in all fields');
      return;
    }

    const newId = Date.now(); // Simple ID generation
    const personnelToAdd = {
      id: newId,
      rank: 'Recruit',
      username: newPersonnel.username,
      enlistedBy: newPersonnel.enlistedBy,
      joinIn: newPersonnel.joinIn
    };

    // Always add to low rank data as recruit
    setLowRankData(prev => [...prev, personnelToAdd]);

    // Reset form and close modal
    setNewPersonnel({
      rank: 'Recruit',
      username: '',
      enlistedBy: '',
      joinIn: ''
    });
    setShowModal(false);
  };

  const getRankOptions = (category) => {
    switch(category) {
      case 'lowRank':
        return ['Recruit', 'Musketry', 'Gefreiter', 'Frei Korporal'];
      case 'nco':
        return ['Korporal', 'Sergeant', 'Junker', 'Feldwebel'];
      case 'officer':
        return ['Sekondeleutnant', 'Premierleutnant', 'Hauptmann'];
      case 'highCommand':
        return ['Major', 'Obersleutnant', 'Obert'];
      default:
        return [];
    }
  };

  const renderTable = (data, tableType, title) => (
    <div className="personnel-table-section">
      <h3 className="table-title">{title}</h3>
      <div className="personnel-table-container">
        <table className="personnel-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Enlisted By</th>
              <th>Join In</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person) => (
              <tr key={person.id}>
                <td className="rank-cell">{person.rank}</td>
                <td 
                  className={`username-cell ${editingCell?.personId === person.id && editingCell?.field === 'username' && editingCell?.tableType === tableType ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'username', tableType)}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'username' && editingCell?.tableType === tableType ? (
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
                  className={`enlisted-by-cell ${editingCell?.personId === person.id && editingCell?.field === 'enlistedBy' && editingCell?.tableType === tableType ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'enlistedBy', tableType)}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'enlistedBy' && editingCell?.tableType === tableType ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      autoFocus
                      className="enlisted-by-input"
                    />
                  ) : (
                    person.enlistedBy
                  )}
                </td>
                <td 
                  className={`date-cell ${editingCell?.personId === person.id && editingCell?.field === 'joinIn' && editingCell?.tableType === tableType ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'joinIn', tableType)}
                >
                  {editingCell?.personId === person.id && editingCell?.field === 'joinIn' && editingCell?.tableType === tableType ? (
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
                    person.joinIn
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="personnels-logging">
      <div className="personnels-header">
        <div className="personnels-header-wrapper">
          <div className="personnels-header-brand">
            <div className="personnels-logo-container">
              <div className="personnels-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="personnels-brand-logo" />
              </div>
              <div className="personnels-brand-text">
                <span className="personnels-brand-title">Prussia Personnel Management</span>
                <span className="personnels-brand-subtitle">Complete roster of Ostpreußisches Landmilizbataillon</span>
              </div>
            </div>
          </div>
          
          <button className="add-personnel-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i>
            Add Recruit
          </button>
        </div>
        
        {/* Header Background Effects */}
        <div className="personnels-header-bg-effects">
          <div className="personnels-header-particle"></div>
          <div className="personnels-header-particle"></div>
          <div className="personnels-header-particle"></div>
        </div>
      </div>

      {renderTable(highCommandData, 'highCommand', 'High Command of Ostpreußisches Landmilizbataillon')}
      {renderTable(officerData, 'officer', 'Officers of Ostpreußisches Landmilizbataillon')}
      {renderTable(ncoData, 'nco', 'Non-Commission Officers of Ostpreußisches Landmilizbataillon')}
      {renderTable(lowRankData, 'lowRank', 'Low Ranks of Ostpreußisches Landmilizbataillon')}

      <div className="personnels-instructions">
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
            <span>Personnel are organized by rank hierarchy within the regiment</span>
          </li>
          <li>
            <FaClipboardList className="instruction-icon" />
            <span>Click "Add Recruit" button to add new personnel - all new members start as Recruits</span>
          </li>
        </ul>
      </div>

      {/* Add Personnel Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="personnel-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-brand">
                <div className="modal-logo-container">
                  <div className="modal-logo-ring">
                    <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="modal-brand-logo" />
                  </div>
                  <div className="modal-brand-text">
                    <span className="modal-brand-title">Prussia Recruitment Portal</span>
                    <span className="modal-brand-subtitle">Ostpreußisches Landmilizbataillon</span>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Username:</label>
                <input 
                  type="text" 
                  value={newPersonnel.username}
                  onChange={(e) => setNewPersonnel({...newPersonnel, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>Recruited By:</label>
                <input 
                  type="text" 
                  value={newPersonnel.enlistedBy}
                  onChange={(e) => setNewPersonnel({...newPersonnel, enlistedBy: e.target.value})}
                  placeholder="Enter recruiting office"
                />
              </div>

              <div className="form-group">
                <label>Recruited Date:</label>
                <input 
                  type="date" 
                  value={newPersonnel.joinIn}
                  onChange={(e) => setNewPersonnel({...newPersonnel, joinIn: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-add" onClick={handleAddPersonnel}>
                Add Recruit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personnels;