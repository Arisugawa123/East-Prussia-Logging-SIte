import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', rank: 'OFFICER', status: 'Active' });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load users from backend and localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Try to fetch from backend first
      const response = await fetch('http://localhost:3001/api/auth/users');
      if (response.ok) {
        const backendUsers = await response.json();
        setUsers(backendUsers.users);
      } else {
        // Fallback to hardcoded users if backend is not available
        loadFallbackUsers();
      }
    } catch (error) {
      console.error('Failed to load users from backend:', error);
      // Load from localStorage or fallback
      const savedUsers = localStorage.getItem('prussianStaffUsers');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        loadFallbackUsers();
      }
    }
  };

  const loadFallbackUsers = () => {
    const fallbackUsers = [
      // Your actual email
      { id: 1, email: 'ironwolftrojanmotionscape@gmail.com', rank: 'HICOM', status: 'Active', dateAdded: '2024-01-15', lastLogin: 'Never', isOwner: true },
      
      // High Command
      { id: 2, email: 'general@prussianregiment.com', rank: 'HICOM', status: 'Active', dateAdded: '2024-01-15', lastLogin: 'Never' },
      { id: 3, email: 'colonel@prussianregiment.com', rank: 'HICOM', status: 'Active', dateAdded: '2024-01-15', lastLogin: 'Never' },
      { id: 4, email: 'commander@prussianregiment.com', rank: 'HICOM', status: 'Active', dateAdded: '2024-01-15', lastLogin: 'Never' },
      
      // Officers
      { id: 5, email: 'major@prussianregiment.com', rank: 'OFFICER', status: 'Active', dateAdded: '2024-01-16', lastLogin: 'Never' },
      { id: 6, email: 'captain@prussianregiment.com', rank: 'OFFICER', status: 'Active', dateAdded: '2024-01-16', lastLogin: 'Never' },
      { id: 7, email: 'lieutenant@prussianregiment.com', rank: 'OFFICER', status: 'Active', dateAdded: '2024-01-16', lastLogin: 'Never' },
      { id: 8, email: 'officer@prussianregiment.com', rank: 'OFFICER', status: 'Active', dateAdded: '2024-01-16', lastLogin: 'Never' },
      
      // NCOs
      { id: 9, email: 'sergeant@prussianregiment.com', rank: 'NCO', status: 'Active', dateAdded: '2024-01-17', lastLogin: 'Never' },
      { id: 10, email: 'corporal@prussianregiment.com', rank: 'NCO', status: 'Active', dateAdded: '2024-01-17', lastLogin: 'Never' },
      { id: 11, email: 'nco@prussianregiment.com', rank: 'NCO', status: 'Active', dateAdded: '2024-01-17', lastLogin: 'Never' },
      
      // Test accounts
      { id: 12, email: 'test@gmail.com', rank: 'HICOM', status: 'Active', dateAdded: '2024-01-18', lastLogin: 'Never' },
      { id: 13, email: 'admin@gmail.com', rank: 'HICOM', status: 'Active', dateAdded: '2024-01-18', lastLogin: 'Never' },
    ];
    setUsers(fallbackUsers);
    // Save to localStorage
    localStorage.setItem('prussianStaffUsers', JSON.stringify(fallbackUsers));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.email && newUser.rank) {
      const user = {
        id: Date.now(),
        ...newUser,
        dateAdded: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      
      try {
        // Try to add to backend
        const response = await fetch('http://localhost:3001/api/auth/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('User added to backend:', result);
        }
      } catch (error) {
        console.error('Failed to add user to backend:', error);
      }
      
      // Update local state and localStorage
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      localStorage.setItem('prussianStaffUsers', JSON.stringify(updatedUsers));
      
      setNewUser({ email: '', rank: 'OFFICER', status: 'Active' });
      setShowAddForm(false);
      
      alert(`User ${user.email} added successfully!`);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = async () => {
    try {
      // Try to update in backend
      const response = await fetch(`http://localhost:3001/api/auth/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('User updated in backend:', result);
      }
    } catch (error) {
      console.error('Failed to update user in backend:', error);
    }
    
    // Update local state and localStorage
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('prussianStaffUsers', JSON.stringify(updatedUsers));
    
    setEditingUser(null);
    alert(`User ${editingUser.email} updated successfully!`);
  };

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find(user => user.id === userId);
    
    // Prevent deleting the owner account
    if (userToDelete?.isOwner) {
      alert('Cannot delete the owner account!');
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove ${userToDelete?.email} from the whitelist?`)) {
      try {
        // Try to delete from backend
        const response = await fetch(`http://localhost:3001/api/auth/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('User deleted from backend:', result);
        }
      } catch (error) {
        console.error('Failed to delete user from backend:', error);
      }
      
      // Update local state and localStorage
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('prussianStaffUsers', JSON.stringify(updatedUsers));
      
      alert(`User ${userToDelete?.email} removed successfully!`);
    }
  };

  const handleStatusToggle = async (userId) => {
    const userToToggle = users.find(user => user.id === userId);
    
    // Prevent deactivating the owner account
    if (userToToggle?.isOwner && userToToggle.status === 'Active') {
      alert('Cannot deactivate the owner account!');
      return;
    }
    
    const newStatus = userToToggle.status === 'Active' ? 'Inactive' : 'Active';
    
    try {
      // Try to update in backend
      const response = await fetch(`http://localhost:3001/api/auth/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('User status updated in backend:', result);
      }
    } catch (error) {
      console.error('Failed to update user status in backend:', error);
    }
    
    // Update local state and localStorage
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('prussianStaffUsers', JSON.stringify(updatedUsers));
    
    alert(`User ${userToToggle?.email} ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = filterRank === 'All' || user.rank === filterRank;
    return matchesSearch && matchesRank;
  });

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 'HICOM': return 'rank-badge hicom';
      case 'OFFICER': return 'rank-badge officer';
      case 'NCO': return 'rank-badge nco';
      default: return 'rank-badge';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Active' ? 'status-badge active' : 'status-badge inactive';
  };

  return (
    <div className="user-management-page">
      <div className="user-management-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-icon">
              <i className="fas fa-users-cog"></i>
            </div>
            <div className="header-text">
              <h1>User Management</h1>
              <p>Manage whitelisted users and their access permissions</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.status === 'Active').length}</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.rank === 'HICOM').length}</div>
              <div className="stat-label">High Command</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.rank === 'OFFICER').length}</div>
              <div className="stat-label">Officers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="user-management-content">
        <div className="controls-section">
          <div className="search-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <select value={filterRank} onChange={(e) => setFilterRank(e.target.value)}>
                <option value="All">All Ranks</option>
                <option value="HICOM">High Command</option>
                <option value="OFFICER">Officers</option>
                <option value="NCO">NCOs</option>
              </select>
            </div>
          </div>
          <button 
            className="add-user-btn"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i>
            Add User
          </button>
        </div>

        {showAddForm && (
          <div className="add-user-form">
            <div className="form-header">
              <h3>Add New User</h3>
              <button onClick={() => setShowAddForm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="user@domain.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rank</label>
                  <select
                    value={newUser.rank}
                    onChange={(e) => setNewUser({...newUser, rank: e.target.value})}
                  >
                    <option value="HICOM">High Command</option>
                    <option value="OFFICER">Officer</option>
                    <option value="NCO">NCO</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit">Add User</button>
              </div>
            </form>
          </div>
        )}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Rank</th>
                <th>Status</th>
                <th>Date Added</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="email-cell">
                    <div className="email-info">
                      <i className={user.isOwner ? "fas fa-crown" : "fas fa-envelope"}></i>
                      <span>{user.email}</span>
                      {user.isOwner && <span className="owner-badge">OWNER</span>}
                    </div>
                  </td>
                  <td>
                    <span className={getRankBadgeClass(user.rank)}>
                      {user.rank}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.dateAdded}</td>
                  <td>{user.lastLogin}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn toggle"
                      onClick={() => handleStatusToggle(user.id)}
                      title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      <i className={user.status === 'Active' ? 'fas fa-pause' : 'fas fa-play'}></i>
                    </button>
                    <button 
                      className={`action-btn delete ${user.isOwner ? 'disabled' : ''}`}
                      onClick={() => handleDeleteUser(user.id)}
                      title={user.isOwner ? "Cannot delete owner" : "Delete User"}
                      disabled={user.isOwner}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <div className="modal-header">
                <h3>Edit User</h3>
                <button onClick={() => setEditingUser(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Rank</label>
                  <select
                    value={editingUser.rank}
                    onChange={(e) => setEditingUser({...editingUser, rank: e.target.value})}
                  >
                    <option value="HICOM">High Command</option>
                    <option value="OFFICER">Officer</option>
                    <option value="NCO">NCO</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={() => setEditingUser(null)}>Cancel</button>
                <button onClick={handleUpdateUser}>Update User</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;