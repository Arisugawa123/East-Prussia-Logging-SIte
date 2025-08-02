import React, { useState, useEffect } from 'react';
import './Personnels.css';
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaSpinner, FaSync, FaEdit, FaTrash, FaPlus, FaUser, FaUsers, FaCrown, FaShieldAlt, FaMedal, FaAward, FaTimes, FaCheck, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { personnelService, promotionService, activityService, loggingService, subscriptions, utils } from './lib/supabase';

const Personnels = ({ readOnly = false, userRank = 'LOW_RANK' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [retireForm, setRetireForm] = useState({
    soldierToRetire: '',
    reason: '',
    processedBy: '',
    retireDate: new Date().toISOString().split('T')[0]
  });
  const [promoteForm, setPromoteForm] = useState({
    soldierToPromote: '',
    newRank: '',
    promoteDate: new Date().toISOString().split('T')[0]
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    rank: 'Rekrut',
    username: '',
    enlistedBy: '',
    joinIn: ''
  });
  // Personnel data from Supabase
  const [lowRankData, setLowRankData] = useState([]);
  const [ncoData, setNcoData] = useState([]);
  const [officerData, setOfficerData] = useState([]);
  const [highCommandData, setHighCommandData] = useState([]);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Custom popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({
    type: '', // 'promotion' or 'demotion'
    username: '',
    oldRank: '',
    newRank: '',
    action: ''
  });

  // Load personnel data from Supabase
  useEffect(() => {
    loadPersonnelData();
    
    // Set up real-time subscriptions
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      loadPersonnelData();
    });

    return () => {
      personnelSubscription.unsubscribe();
    };
  }, []);

  const loadPersonnelData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all personnel from database
      const allPersonnel = await personnelService.getAllPersonnel();
      
      // Sort personnel by category and rank
      const categorizedPersonnel = {
        enlisted: [],
        juniorNCOs: [],
        seniorNCOs: [],
        officers: [],
        highCommand: []
      };

      allPersonnel.forEach(person => {
        const category = utils.getCategoryForRank(person.rank);
        switch(category) {
          case 'Enlisted':
            categorizedPersonnel.enlisted.push({
              id: person.id,
              rank: person.rank,
              username: person.username,
              enlistedBy: person.promoted_by || 'System',
              joinIn: utils.formatDate(person.date_joined)
            });
            break;
          case 'Junior NCOs':
            categorizedPersonnel.juniorNCOs.push({
              id: person.id,
              rank: person.rank,
              username: person.username,
              enlistedBy: person.promoted_by || 'System',
              joinIn: utils.formatDate(person.date_joined)
            });
            break;
          case 'Senior NCOs':
            categorizedPersonnel.seniorNCOs.push({
              id: person.id,
              rank: person.rank,
              username: person.username,
              enlistedBy: person.promoted_by || 'System',
              joinIn: utils.formatDate(person.date_joined)
            });
            break;
          case 'Officer Corps':
            categorizedPersonnel.officers.push({
              id: person.id,
              rank: person.rank,
              username: person.username,
              enlistedBy: person.promoted_by || 'System',
              joinIn: utils.formatDate(person.date_joined)
            });
            break;
          case 'High Command':
            categorizedPersonnel.highCommand.push({
              id: person.id,
              rank: person.rank,
              username: person.username,
              enlistedBy: person.promoted_by || 'System',
              joinIn: utils.formatDate(person.date_joined)
            });
            break;
        }
      });

      // Sort by rank within each category
      const sortByRank = (a, b) => utils.getRankOrder(a.rank) - utils.getRankOrder(b.rank);
      
      setLowRankData(categorizedPersonnel.enlisted.sort(sortByRank));
      setNcoData([...categorizedPersonnel.juniorNCOs, ...categorizedPersonnel.seniorNCOs].sort(sortByRank));
      setOfficerData(categorizedPersonnel.officers.sort(sortByRank));
      setHighCommandData(categorizedPersonnel.highCommand.sort(sortByRank));

    } catch (err) {
      console.error('Error loading personnel data:', err);
      setError('Failed to load personnel data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (personId, field, tableType) => {
    // Prevent editing if user has read-only access
    if (readOnly) {
      alert('You have read-only access. Only officers and above can edit personnel data.');
      return;
    }
    
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
    
    // Only allow editing of username, enlistedBy, and joinIn (NOT rank)
    if (person && (field === 'username' || field === 'enlistedBy' || field === 'joinIn')) {
      setEditingCell({ personId, field, tableType });
      setEditValue(person[field]);
    }
  };

  const handleCellSave = async () => {
    if (editingCell) {
      const { personId, field, tableType } = editingCell;
      
      // Find the person being edited to get their info for logging
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

      // Only proceed if the value actually changed
      if (person && person[field] !== editValue) {
        try {
          // Prepare database update based on field
          let dbUpdate = {};
          
          switch(field) {
            case 'username':
              dbUpdate.username = editValue;
              break;
            case 'enlistedBy':
              dbUpdate.promoted_by = editValue;
              break;
            case 'joinIn':
              // Convert date format for database
              dbUpdate.date_joined = new Date(editValue).toISOString();
              break;
          }

          // Update in database
          await personnelService.updatePersonnel(personId, dbUpdate);

          // Create activity log in database
          const activityData = {
            personnel_id: personId,
            activity_type: 'Data Update',
            details: `Updated ${field === 'enlistedBy' ? 'enlisted by' : field === 'joinIn' ? 'join date' : field} information`,
            category: utils.getCategoryForRank(person.rank),
            processed_by: 'Admin Staff'
          };

          await activityService.addActivity(activityData);

          // Update local state to reflect changes
          switch(tableType) {
            case 'lowRank':
              setLowRankData(prev => prev.map(p => 
                p.id === personId ? { ...p, [field]: editValue } : p
              ));
              break;
            case 'nco':
              setNcoData(prev => prev.map(p => 
                p.id === personId ? { ...p, [field]: editValue } : p
              ));
              break;
            case 'officer':
              setOfficerData(prev => prev.map(p => 
                p.id === personId ? { ...p, [field]: editValue } : p
              ));
              break;
            case 'highCommand':
              setHighCommandData(prev => prev.map(p => 
                p.id === personId ? { ...p, [field]: editValue } : p
              ));
              break;
          }

          // Show success feedback
          console.log(`Successfully updated ${field} for ${person.username}`);
          
        } catch (error) {
          console.error('Error updating personnel data:', error);
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

  const handleAddPersonnel = async () => {
    // Prevent adding personnel if user has read-only access
    if (readOnly) {
      alert('You have read-only access. Only officers and above can add personnel.');
      return;
    }
    
    if (!newPersonnel.username || !newPersonnel.enlistedBy || !newPersonnel.joinIn) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Add personnel to Supabase
      const personnelData = {
        username: newPersonnel.username,
        rank: newPersonnel.rank,
        category: utils.getCategoryForRank(newPersonnel.rank),
        position: `${newPersonnel.rank}`,
        promoted_by: newPersonnel.enlistedBy
      };

      const addedPersonnel = await personnelService.addPersonnel(personnelData);

      // Create activity log
      const activityData = {
        personnel_id: addedPersonnel.id,
        activity_type: 'Recruitment',
        details: `New recruit enlisted as ${newPersonnel.rank}`,
        category: utils.getCategoryForRank(newPersonnel.rank),
        processed_by: newPersonnel.enlistedBy
      };

      await activityService.addActivity(activityData);

      // Reset form and close modal
      setNewPersonnel({
        rank: 'Rekrut',
        username: '',
        enlistedBy: '',
        joinIn: ''
      });
      setShowModal(false);
      
      // Reload data to reflect changes
      loadPersonnelData();
      
      alert(`${newPersonnel.username} has been successfully enlisted as ${newPersonnel.rank}!`);

    } catch (err) {
      console.error('Error adding personnel:', err);
      alert('Failed to add personnel. Please try again.');
    }
  };

  const handleRetireSoldier = async () => {
    // Prevent retiring personnel if user has read-only access
    if (readOnly) {
      alert('You have read-only access. Only officers and above can retire personnel.');
      return;
    }
    
    if (!retireForm.soldierToRetire || !retireForm.reason || !retireForm.processedBy || !retireForm.retireDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Find the soldier to retire
      const soldierInfo = findSoldierByUsername(retireForm.soldierToRetire);
      if (!soldierInfo) {
        alert('Soldier not found');
        return;
      }

      // Helper function to calculate years of service
      const calculateYearsOfService = (joinDate) => {
        if (!joinDate) return 0;
        const join = new Date(joinDate);
        const now = new Date();
        return Math.floor((now - join) / (1000 * 60 * 60 * 24 * 365));
      };

      // Update personnel status to retired
      await personnelService.updatePersonnel(soldierInfo.id, {
        status: 'retired',
        retired_date: new Date().toISOString(),
        retired_by: retireForm.processedBy
      });

      // Create retired personnel record (remove status field if it doesn't exist)
      const retiredData = {
        personnel_id: soldierInfo.id,
        rank_at_retirement: soldierInfo.rank,
        username: soldierInfo.username,
        retirement_date: retireForm.retireDate,
        retirement_reason: retireForm.reason,
        years_of_service: calculateYearsOfService(soldierInfo.joinIn),
        final_position: soldierInfo.rank,
        commendations: 'Service record under review',
        pension_status: 'Processing',
        contact_info: 'To be updated',
        processed_by: retireForm.processedBy
      };

      console.log('Creating retired personnel record with data:', retiredData);
      
      try {
        await loggingService.addRetiredPersonnel(retiredData);
        console.log('Retired personnel record created successfully');
      } catch (retiredError) {
        console.error('Error creating retired personnel record:', retiredError);
        // Continue with the process even if retired record creation fails
        alert('Personnel retired successfully, but there was an issue creating the retirement record. Please check the Retired Personnel page.');
      }

      // Create activity log
      const activityData = {
        personnel_id: soldierInfo.id,
        activity_type: 'Retirement',
        details: `Retired: ${retireForm.reason}`,
        category: utils.getCategoryForRank(soldierInfo.rank),
        processed_by: retireForm.processedBy
      };

      await activityService.addActivity(activityData);

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
      
      // Trigger retirement event for other components
      console.log('Dispatching retirement event...');
      window.dispatchEvent(new CustomEvent('personnelRetired', { 
        detail: { 
          personnelId: soldierInfo.id, 
          username: soldierInfo.username,
          rank: soldierInfo.rank 
        } 
      }));
      
      // Reload data to reflect changes
      await loadPersonnelData();
      
      alert(`${soldierInfo.username} has been retired successfully!`);

    } catch (err) {
      console.error('Error retiring personnel:', err);
      alert('Failed to retire personnel. Please try again.');
    }
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

  const handlePromoteSoldierSearch = (value) => {
    setPromoteForm(prev => ({ ...prev, soldierToPromote: value }));
    searchSoldiers(value);
  };

  const selectSoldier = (soldier) => {
    setRetireForm(prev => ({ ...prev, soldierToRetire: soldier.username }));
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const selectSoldierForPromotion = (soldier) => {
    setPromoteForm(prev => ({ ...prev, soldierToPromote: soldier.username }));
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const getRankOptions = (category) => {
    switch(category) {
      case 'lowRank':
        return ['Rekrut', 'Musketier', 'Gefreiter', 'Frei Korporal'];
      case 'nco':
        return ['Korporal', 'Sergeant', 'Junker', 'Feldwebel'];
      case 'officer':
        return ['Sekondeleutnant', 'Premierleutnant', 'Hauptmann'];
      case 'highCommand':
        return ['Major', 'Oberstleutnant', 'Oberst'];
      default:
        return [];
    }
  };

  const getAllRankOptions = () => {
    return [
      'Rekrut', 'Musketier', 'Gefreiter', 'Frei Korporal',
      'Korporal', 'Sergeant', 'Junker', 'Feldwebel',
      'Sekondeleutnant', 'Premierleutnant', 'Hauptmann',
      'Major', 'Oberstleutnant', 'Oberst'
    ];
  };

  const handlePromoteSoldier = async () => {
    // Prevent promotions if user has read-only access
    if (readOnly) {
      alert('You have read-only access. Only officers and above can promote personnel.');
      return;
    }
    
    if (!promoteForm.soldierToPromote || !promoteForm.newRank || !promoteForm.promoteDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Find the soldier to promote
      const soldierInfo = findSoldierByUsername(promoteForm.soldierToPromote);
      if (!soldierInfo) {
        alert('Soldier not found');
        return;
      }

      const newCategory = utils.getCategoryForRank(promoteForm.newRank);
      const oldCategory = utils.getCategoryForRank(soldierInfo.rank);
      
      // Determine if it's a promotion or demotion
      const oldRankOrder = utils.getRankOrder(soldierInfo.rank);
      const newRankOrder = utils.getRankOrder(promoteForm.newRank);
      const isPromotion = newRankOrder < oldRankOrder; // Lower number = higher rank

      // Update personnel in Supabase
      const updates = {
        rank: promoteForm.newRank,
        category: newCategory,
        position: `${promoteForm.newRank}`,
        promoted_by: 'System'
      };

      console.log('Updating personnel with:', updates);
      console.log('Personnel ID:', soldierInfo.id);
      
      const updatedPersonnel = await personnelService.updatePersonnel(soldierInfo.id, updates);
      console.log('Personnel updated successfully:', updatedPersonnel);

      // Create promotion log
      const promotionData = {
        personnel_id: soldierInfo.id,
        previous_rank: soldierInfo.rank,
        new_rank: promoteForm.newRank,
        category_change: `${oldCategory} → ${newCategory}`,
        processed_by: 'System'
      };

      await promotionService.addPromotion(promotionData);
      console.log('Promotion log created');

      // Create activity log
      const activityType = isPromotion ? 'Promotion' : 'Demotion';
      const activityDetails = isPromotion 
        ? `Promoted from ${soldierInfo.rank} to ${promoteForm.newRank}`
        : `Demoted from ${soldierInfo.rank} to ${promoteForm.newRank}`;
        
      const activityData = {
        personnel_id: soldierInfo.id,
        activity_type: activityType,
        details: activityDetails,
        category: `${oldCategory} → ${newCategory}`,
        processed_by: 'System'
      };

      await activityService.addActivity(activityData);

      // Reset form and close modal
      setPromoteForm({
        soldierToPromote: '',
        newRank: '',
        promoteDate: new Date().toISOString().split('T')[0]
      });
      setShowPromoteModal(false);
      setSearchResults([]);
      setShowSearchResults(false);
      
      // Trigger promotion event for other components
      console.log('Dispatching promotion event...');
      window.dispatchEvent(new CustomEvent('promotionLogsUpdated'));
      window.dispatchEvent(new CustomEvent('personnelUpdated', { 
        detail: { 
          personnelId: soldierInfo.id, 
          oldRank: soldierInfo.rank, 
          newRank: promoteForm.newRank 
        } 
      }));
      
      // Force reload data to reflect changes
      console.log('Reloading personnel data...');
      await loadPersonnelData();
      
      // Show custom success popup
      setPopupMessage({
        type: isPromotion ? 'promotion' : 'demotion',
        username: soldierInfo.username,
        oldRank: soldierInfo.rank,
        newRank: promoteForm.newRank,
        action: isPromotion ? 'promoted' : 'demoted'
      });
      setShowSuccessPopup(true);
      
      // Auto-hide popup after 4 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 4000);

    } catch (err) {
      console.error('Error promoting personnel:', err);
      alert('Failed to promote personnel. Please try again.');
    }
  };

  const getNewRankCategory = (rank) => {
    if (getRankOptions('lowRank').includes(rank)) return 'lowRank';
    if (getRankOptions('nco').includes(rank)) return 'nco';
    if (getRankOptions('officer').includes(rank)) return 'officer';
    if (getRankOptions('highCommand').includes(rank)) return 'highCommand';
    return null;
  };

  const getPersonCategoryByTableType = (tableType) => {
    switch(tableType) {
      case 'lowRank': return 'lowRank';
      case 'nco': return 'nco';
      case 'officer': return 'officer';
      case 'highCommand': return 'highCommand';
      default: return 'lowRank';
    }
  };

  const renderTable = (data, tableType, title) => (
    <div className={`personnel-table-section ${readOnly ? 'read-only' : ''}`}>
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
                <td className="rank-cell non-editable" title="Rank cannot be edited directly. Use promotion system.">{person.rank}</td>
                <td 
                  className={`username-cell ${editingCell?.personId === person.id && editingCell?.field === 'username' && editingCell?.tableType === tableType ? 'editing' : ''}`}
                  onClick={() => handleCellClick(person.id, 'username', tableType)}
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit username'}
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
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit enlisted by'}
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
                  title={readOnly ? 'Read-only access - Contact an officer to edit' : 'Click to edit join date'}
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

  if (loading) {
    return (
      <div className="personnels-logging">
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading Prussia Personnel data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="personnels-logging">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadPersonnelData} className="retry-button">
            <FaSync />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

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
            {!readOnly ? (
              <>
                <button className="add-personnel-btn" onClick={() => setShowModal(true)}>
                  <i className="fas fa-plus"></i>
                  Add Recruit
                </button>
                <button className="retire-personnel-btn" onClick={() => setShowRetireModal(true)}>
                  <i className="fas fa-user-minus"></i>
                  Retire Soldier
                </button>
                <button className="promote-personnel-btn" onClick={() => setShowPromoteModal(true)}>
                  <i className="fas fa-arrow-up"></i>
                  Promote Personnel
                </button>
              </>
            ) : (
              <div className="read-only-notice">
                <i className="fas fa-eye"></i>
                <span>Read-Only Access - Contact an officer to make changes</span>
              </div>
            )}
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
          <li>
            <FaEdit className="instruction-icon" />
            <span>All edits are automatically saved to the database - Rank changes must use the promotion system</span>
          </li>
          {readOnly && (
            <li style={{ color: '#dc3545', fontWeight: 'bold' }}>
              <FaShieldAlt className="instruction-icon" />
              <span>READ-ONLY ACCESS: You can view data but cannot make changes. Contact an officer for modifications.</span>
            </li>
          )}
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

      {/* Promote Personnel Modal */}
      {showPromoteModal && (
        <div className="modal-overlay" onClick={() => setShowPromoteModal(false)}>
          <div className="promote-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-brand">
                <div className="modal-logo-container">
                  <div className="modal-logo-ring">
                    <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="modal-brand-logo" />
                  </div>
                  <div className="modal-brand-text">
                    <span className="modal-brand-title">Promote Personnel</span>
                    <span className="modal-brand-subtitle">Ostpreußisches Landmilizbataillon</span>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowPromoteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="promote-form">
                <div className="form-group search-group">
                  <label>Soldier to Promote:</label>
                  <div className="search-container">
                    <input 
                      type="text" 
                      value={promoteForm.soldierToPromote}
                      onChange={(e) => handlePromoteSoldierSearch(e.target.value)}
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
                            onClick={() => selectSoldierForPromotion(soldier)}
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
                  <label>New Rank:</label>
                  <select 
                    value={promoteForm.newRank}
                    onChange={(e) => setPromoteForm(prev => ({ ...prev, newRank: e.target.value }))}
                    className="promote-select"
                  >
                    <option value="">Select new rank...</option>
                    {getAllRankOptions().map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Promotion Date:</label>
                  <input 
                    type="date" 
                    value={promoteForm.promoteDate}
                    onChange={(e) => setPromoteForm(prev => ({ ...prev, promoteDate: e.target.value }))}
                    className="promote-input"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => {
                setShowPromoteModal(false);
                setPromoteForm({
                  soldierToPromote: '',
                  newRank: '',
                  promoteDate: new Date().toISOString().split('T')[0]
                });
                setSearchResults([]);
                setShowSearchResults(false);
              }}>
                Cancel
              </button>
              <button 
                className="btn-promote" 
                onClick={handlePromoteSoldier}
                disabled={!promoteForm.soldierToPromote || !promoteForm.newRank || !promoteForm.promoteDate}
              >
                <i className="fas fa-arrow-up"></i>
                Process Promotion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Success Popup */}
      {showSuccessPopup && (
        <div className="modern-popup-overlay">
          <div className={`modern-popup-card ${popupMessage.type}`}>
            <button 
              className="modern-popup-close" 
              onClick={() => setShowSuccessPopup(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modern-popup-content">
              <div className="popup-status-icon">
                {popupMessage.type === 'promotion' ? (
                  <i className="fas fa-arrow-up"></i>
                ) : (
                  <i className="fas fa-arrow-down"></i>
                )}
              </div>
              
              <h2 className="popup-main-title">
                {popupMessage.type === 'promotion' ? 'Promoted!' : 'Demoted'}
              </h2>
              
              <div className="soldier-card">
                <div className="soldier-initial">
                  {popupMessage.username.charAt(0).toUpperCase()}
                </div>
                <div className="soldier-details">
                  <h3>{popupMessage.username}</h3>
                  <p>Personnel ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
              
              <div className="rank-progression">
                <div className="rank-item old">
                  <div className="rank-badge">{popupMessage.oldRank}</div>
                  <span>Previous</span>
                </div>
                <div className="progression-line">
                  <div className="progress-dot"></div>
                  <div className="progress-bar"></div>
                  <div className="progress-dot active"></div>
                </div>
                <div className="rank-item new">
                  <div className="rank-badge active">{popupMessage.newRank}</div>
                  <span>Current</span>
                </div>
              </div>
              
              <div className="success-summary">
                <i className="fas fa-check-circle"></i>
                <span>Rank change processed successfully</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personnels;