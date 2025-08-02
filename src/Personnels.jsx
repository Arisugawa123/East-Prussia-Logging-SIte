import React, { useState } from 'react';
import './Personnels.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar } from 'react-icons/fa';

const Personnels = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [retireForm, setRetireForm] = useState({
    soldierToRetire: '',
    reason: '',
    processedBy: '',
    retireDate: new Date().toISOString().split('T')[0]
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
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

  const handleRetireSoldier = () => {
    if (!retireForm.soldierToRetire || !retireForm.reason || !retireForm.processedBy || !retireForm.retireDate) {
      alert('Please fill in all fields');
      return;
    }

    // Find and remove the soldier from appropriate data array
    const soldierInfo = findSoldierByUsername(retireForm.soldierToRetire);
    if (!soldierInfo) {
      alert('Soldier not found');
      return;
    }

    // Create retired personnel record
    const retiredRecord = {
      id: Date.now(), // Generate new ID for retired record
      username: soldierInfo.username,
      rank: soldierInfo.rank,
      date: retireForm.retireDate,
      reason: retireForm.reason,
      processedBy: retireForm.processedBy,
      originalCategory: getOriginalCategory(soldierInfo.category),
      enlistedBy: soldierInfo.enlistedBy,
      joinIn: soldierInfo.joinIn
    };

    // Store in localStorage for persistence across components
    const existingRetired = JSON.parse(localStorage.getItem('retiredPersonnel') || '[]');
    existingRetired.push(retiredRecord);
    localStorage.setItem('retiredPersonnel', JSON.stringify(existingRetired));

    // Trigger event to update RetiredPersonnel component in real-time
    window.dispatchEvent(new Event('retiredPersonnelUpdated'));

    // Remove soldier from the appropriate data array
    switch(soldierInfo.category) {
      case 'highCommand':
        setHighCommandData(prev => prev.filter(person => person.id !== soldierInfo.id));
        break;
      case 'officer':
        setOfficerData(prev => prev.filter(person => person.id !== soldierInfo.id));
        break;
      case 'nco':
        setNcoData(prev => prev.filter(person => person.id !== soldierInfo.id));
        break;
      case 'lowRank':
        setLowRankData(prev => prev.filter(person => person.id !== soldierInfo.id));
        break;
    }

    // Reset form and close modal
    setRetireForm({
      soldierToRetire: '',
      reason: '',
      processedBy: '',
      retireDate: new Date().toISOString().split('T')[0]
    });
    setShowRetireModal(false);
    setSearchResults([]);
    setShowSearchResults(false);
    alert(`${soldierInfo.rank} ${soldierInfo.username} has been retired successfully and moved to Retired Personnel!`);
  };

  const getOriginalCategory = (category) => {
    switch(category) {
      case 'highCommand': return 'High Command';
      case 'officer': return 'Officers';
      case 'nco': return 'NCOs';
      case 'lowRank': return 'Low Ranks';
      default: return 'Unknown';
    }
  };

  const findSoldierByUsername = (username) => {
    // Search in all data arrays
    let soldier = highCommandData.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (soldier) return { ...soldier, category: 'highCommand' };

    soldier = officerData.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (soldier) return { ...soldier, category: 'officer' };

    soldier = ncoData.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (soldier) return { ...soldier, category: 'nco' };

    soldier = lowRankData.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (soldier) return { ...soldier, category: 'lowRank' };

    return null;
  };

  const searchSoldiers = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const allSoldiers = [];
    
    // Collect all soldiers from all categories
    [...highCommandData, ...officerData, ...ncoData, ...lowRankData].forEach(person => {
      if (person.username.toLowerCase().includes(searchTerm.toLowerCase())) {
        allSoldiers.push({
          id: person.id,
          rank: person.rank,
          username: person.username,
          category: getPersonCategory(person)
        });
      }
    });

    setSearchResults(allSoldiers);
    setShowSearchResults(allSoldiers.length > 0);
  };

  const getPersonCategory = (person) => {
    if (highCommandData.find(p => p.id === person.id)) return 'High Command';
    if (officerData.find(p => p.id === person.id)) return 'Officers';
    if (ncoData.find(p => p.id === person.id)) return 'NCOs';
    if (lowRankData.find(p => p.id === person.id)) return 'Low Ranks';
    return 'Unknown';
  };

  const handleSoldierSearch = (value) => {
    setRetireForm(prev => ({ ...prev, soldierToRetire: value }));
    searchSoldiers(value);
  };

  const selectSoldier = (soldier) => {
    setRetireForm(prev => ({ ...prev, soldierToRetire: soldier.username }));
    setSearchResults([]);
    setShowSearchResults(false);
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
          
          <div className="header-buttons">
            <button className="add-personnel-btn" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus"></i>
              Add Recruit
            </button>
            <button className="retire-personnel-btn" onClick={() => setShowRetireModal(true)}>
              <i className="fas fa-user-minus"></i>
              Retire Soldier
            </button>
          </div>
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

      {/* Retire Soldier Modal */}
      {showRetireModal && (
        <div className="modal-overlay" onClick={() => setShowRetireModal(false)}>
          <div className="retire-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-brand">
                <div className="modal-logo-container">
                  <div className="modal-logo-ring">
                    <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="modal-brand-logo" />
                  </div>
                  <div className="modal-brand-text">
                    <span className="modal-brand-title">Retire Soldier</span>
                    <span className="modal-brand-subtitle">Ostpreußisches Landmilizbataillon</span>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowRetireModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="retire-form">
                <div className="form-group search-group">
                  <label>Soldier to Retire:</label>
                  <div className="search-container">
                    <input 
                      type="text" 
                      value={retireForm.soldierToRetire}
                      onChange={(e) => handleSoldierSearch(e.target.value)}
                      placeholder="Search soldier by username..."
                      className="search-input"
                    />
                    <i className="fas fa-search search-icon"></i>
                    
                    {showSearchResults && (
                      <div className="search-results">
                        {searchResults.map(soldier => (
                          <div 
                            key={soldier.id} 
                            className="search-result-item"
                            onClick={() => selectSoldier(soldier)}
                          >
                            <div className="result-rank">{soldier.rank}</div>
                            <div className="result-name">{soldier.username}</div>
                            <div className="result-category">{soldier.category}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Retirement Reason:</label>
                  <textarea 
                    value={retireForm.reason}
                    onChange={(e) => setRetireForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter reason for retirement (e.g., End of service, Medical discharge, etc.)"
                    rows="3"
                    className="retire-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Processed By:</label>
                  <input 
                    type="text" 
                    value={retireForm.processedBy}
                    onChange={(e) => setRetireForm(prev => ({ ...prev, processedBy: e.target.value }))}
                    placeholder="Enter name of processing officer"
                    className="retire-input"
                  />
                </div>

                <div className="form-group">
                  <label>Retirement Date:</label>
                  <input 
                    type="date" 
                    value={retireForm.retireDate}
                    onChange={(e) => setRetireForm(prev => ({ ...prev, retireDate: e.target.value }))}
                    className="retire-input"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => {
                setShowRetireModal(false);
                setRetireForm({
                  soldierToRetire: '',
                  reason: '',
                  processedBy: '',
                  retireDate: new Date().toISOString().split('T')[0]
                });
                setSearchResults([]);
                setShowSearchResults(false);
              }}>
                Cancel
              </button>
              <button 
                className="btn-retire" 
                onClick={handleRetireSoldier}
                disabled={!retireForm.soldierToRetire || !retireForm.reason || !retireForm.processedBy || !retireForm.retireDate}
              >
                <i className="fas fa-user-minus"></i>
                Process Retirement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personnels;