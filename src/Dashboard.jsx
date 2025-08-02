import React, { useState } from 'react';
import './Dashboard.css';
import LowRankLoggingNew from './LowRankLoggingNew';
import NCOLogging from './NCOLogging';
import InactivityNotice from './InactivityNotice';
import OfficerLogging from './OfficerLogging';
import RetiredPersonnel from './RetiredPersonnel';
import HallOfHiCom from './HallOfHiCom';
import Personnels from './Personnels';
import RankingInformation from './RankingInformation'
import UserManagement from './UserManagement';
import RegimentOverview from './RegimentOverview';

const Dashboard = ({ onClose }) => {
  const [activeMenu, setActiveMenu] = useState('overview');
  
  // Get user session to check permissions
  const getUserSession = () => {
    try {
      const sessionData = localStorage.getItem('prussianStaffSession')
      if (sessionData) {
        return JSON.parse(sessionData)
      }
    } catch (error) {
      console.error('Error reading session:', error)
    }
    return null
  }
  
  const userSession = getUserSession()
  const userInfo = userSession?.userInfo || {}
  const userRank = userInfo.rank || userInfo.accessLevel || 'LOW_RANK'
  const isReadOnly = userRank === 'LOW_RANK' || userInfo.accessLevel === 'READ_ONLY'
  const isHighRank = ['HICOM', 'OFFICER', 'NCO'].includes(userRank)
  
  console.log('Dashboard session:', { userSession, userInfo, userRank, isReadOnly, isHighRank })
  const [expandedCategory, setExpandedCategory] = useState('regiment');
  const [promotionLogs, setPromotionLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? '' : category);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  // Load logs from localStorage
  const loadPromotionLogs = () => {
    const logs = JSON.parse(localStorage.getItem('promotionLogs') || '[]');
    setPromotionLogs(logs);
  };

  const loadActivityLogs = () => {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    setActivityLogs(logs);
  };

  // Load logs on component mount and set up event listeners
  React.useEffect(() => {
    loadPromotionLogs();
    loadActivityLogs();

    // Listen for log updates
    const handlePromotionUpdate = () => loadPromotionLogs();
    const handleActivityUpdate = () => loadActivityLogs();

    window.addEventListener('promotionLogsUpdated', handlePromotionUpdate);
    window.addEventListener('activityLogsUpdated', handleActivityUpdate);

    return () => {
      window.removeEventListener('promotionLogsUpdated', handlePromotionUpdate);
      window.removeEventListener('activityLogsUpdated', handleActivityUpdate);
    };
  }, []);

  return (
    <div id="staffDashboard" className="staff-dashboard">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <header className="dashboard-modern-navbar">
          <div className="dashboard-nav-wrapper">
            {/* Dashboard Logo Section */}
            <div className="dashboard-nav-brand">
              <div className="dashboard-logo-container">
                <div className="dashboard-logo-ring">
                  <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="dashboard-brand-logo" />
                </div>
                <div className="dashboard-brand-text">
                  <span className="dashboard-brand-title">Staff Command Center</span>
                  <span className="dashboard-brand-subtitle">Ostpreußisches Landmilizbataillon</span>
                </div>
              </div>
            </div>

            {/* Dashboard Navigation Links */}
            <div className="dashboard-nav-links">
              <div className="dashboard-nav-items">
                <button 
                  className={`dashboard-nav-link-modern ${activeMenu === 'overview' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('overview')}
                >
                  <span className="dashboard-link-text">Overview</span>
                  <div className="dashboard-link-underline"></div>
                </button>
                <button 
                  className={`dashboard-nav-link-modern ${activeMenu === 'activity-logs' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('activity-logs')}
                >
                  <span className="dashboard-link-text">Activity Logs</span>
                  <div className="dashboard-link-underline"></div>
                </button>
                <button 
                  className={`dashboard-nav-link-modern ${activeMenu === 'promotion-logs' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('promotion-logs')}
                >
                  <span className="dashboard-link-text">Promotion Logs</span>
                  <div className="dashboard-link-underline"></div>
                </button>
              </div>
              
              {/* User Info and Logout */}
              <div className="dashboard-user-section">
                <div className="dashboard-user-info">
                  <div className="dashboard-user-avatar">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <span className="dashboard-user-name">Staff Member</span>
                </div>
                <button className="dashboard-logout-btn" onClick={onClose}>
                  <span className="dashboard-logout-text">Logout</span>
                  <div className="dashboard-btn-glow"></div>
                </button>
              </div>
            </div>

            {/* Dashboard Background Effects */}
            <div className="dashboard-nav-bg-effects">
              <div className="dashboard-nav-particle"></div>
              <div className="dashboard-nav-particle"></div>
              <div className="dashboard-nav-particle"></div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="dashboard-body">
          {/* Dashboard Sidebar */}
          <aside className="modern-dashboard-sidebar">
            <nav className="modern-sidebar-nav">
              <div className="modern-nav-section">
                <div className="modern-section-header">
                  <i className="fas fa-flag"></i>
                  <h3>East Prussian Regiment</h3>
                </div>
                <ul className="modern-nav-list">
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'overview' ? 'active' : ''}`} onClick={() => handleMenuClick('overview')}>
                      <i className="fas fa-chart-line"></i>
                      <span>Overview</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'personnels' ? 'active' : ''}`} onClick={() => handleMenuClick('personnels')}>
                      <i className="fas fa-users"></i>
                      <span>Personnels</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'hall-of-hicom' ? 'active' : ''}`} onClick={() => handleMenuClick('hall-of-hicom')}>
                      <i className="fas fa-medal"></i>
                      <span>Hall of HiCom</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'ranking-information' ? 'active' : ''}`} onClick={() => handleMenuClick('ranking-information')}>
                      <i className="fas fa-star"></i>
                      <span>Ranking Information</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="modern-nav-section">
                <div className="modern-section-header">
                  <i className="fas fa-clipboard-list"></i>
                  <h3>Logging Hall</h3>
                </div>
                <ul className="modern-nav-list">
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'low-rank-logging' ? 'active' : ''}`} onClick={() => handleMenuClick('low-rank-logging')}>
                      <i className="fas fa-user"></i>
                      <span>Low Rank Logging</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'nco-logging' ? 'active' : ''}`} onClick={() => handleMenuClick('nco-logging')}>
                      <i className="fas fa-user-tie"></i>
                      <span>NCO Logging</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'officer-logging' ? 'active' : ''}`} onClick={() => handleMenuClick('officer-logging')}>
                      <i className="fas fa-user-shield"></i>
                      <span>Officer Logging</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'inactivity-notice' ? 'active' : ''}`} onClick={() => handleMenuClick('inactivity-notice')}>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Inactivity Notice</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'retired-personnel' ? 'active' : ''}`} onClick={() => handleMenuClick('retired-personnel')}>
                      <i className="fas fa-user-clock"></i>
                      <span>Retired Personnel</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="modern-nav-section">
                <div className="modern-section-header">
                  <i className="fas fa-graduation-cap"></i>
                  <h3>NCO and OA Academy</h3>
                </div>
                <ul className="modern-nav-list">
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'nco-academy' ? 'active' : ''}`} onClick={() => handleMenuClick('nco-academy')}>
                      <i className="fas fa-chalkboard-teacher"></i>
                      <span>NCO Academy</span>
                    </button>
                  </li>
                  <li>
                    <button className={`modern-nav-item ${activeMenu === 'officer-academy' ? 'active' : ''}`} onClick={() => handleMenuClick('officer-academy')}>
                      <i className="fas fa-university"></i>
                      <span>Officer Academy</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Website Admin - Only for High Rank Users */}
              {isHighRank && (
                <div className="modern-nav-section">
                  <div className="modern-section-header">
                    <i className="fas fa-cogs"></i>
                    <h3>Website Admin</h3>
                  </div>
                  <ul className="modern-nav-list">
                    <li>
                      <button className={`modern-nav-item ${activeMenu === 'permissions' ? 'active' : ''}`} onClick={() => handleMenuClick('permissions')}>
                        <i className="fas fa-user-shield"></i>
                        <span>Permissions</span>
                      </button>
                    </li>
                    <li>
                      <button className={`modern-nav-item ${activeMenu === 'user-management' ? 'active' : ''}`} onClick={() => handleMenuClick('user-management')}>
                        <i className="fas fa-users-cog"></i>
                        <span>User Management</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              
              {/* Access Level Indicator */}
              <div className="access-level-indicator">
                <div className={`access-badge ${isReadOnly ? 'read-only' : 'full-access'}`}>
                  <i className={`fas ${isReadOnly ? 'fa-eye' : 'fa-edit'}`}></i>
                  <span>{isReadOnly ? 'Read Only' : 'Full Access'}</span>
                  <div className="rank-display">{String(userRank)}</div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content">
          {activeMenu === 'overview' && (
            <RegimentOverview />
          )}
          
          {activeMenu === 'personnels' && (
            <Personnels readOnly={isReadOnly} userRank={userRank} />
          )}
          
          {activeMenu === 'hall-of-hicom' && (
            <HallOfHiCom readOnly={isReadOnly} userRank={userRank} />
          )}
          
          {activeMenu === 'low-rank-logging' && (
            <LowRankLoggingNew />
          )}
          
          {activeMenu === 'nco-logging' && (
            <NCOLogging />
          )}
          
          {activeMenu === 'officer-logging' && (
            <OfficerLogging />
          )}
          
          {activeMenu === 'inactivity-notice' && (
            <InactivityNotice />
          )}
          
          {activeMenu === 'retired-personnel' && (
            <RetiredPersonnel />
          )}
          
          {activeMenu === 'nco-academy' && (
            <div className="content-section">
              <h2>NCO Academy</h2>
              <p>Non-Commissioned Officer training and development.</p>
            </div>
          )}
          
          {activeMenu === 'officer-academy' && (
            <div className="content-section">
              <h2>Officer Academy</h2>
              <p>Officer training and leadership development.</p>
            </div>
          )}
          
          {activeMenu === 'ranking-information' && (
            <RankingInformation />
          )}
          
          {activeMenu === 'user-management' && isHighRank && (
            <UserManagement />
          )}
          
          {activeMenu === 'permissions' && (
            <div className="permissions-page">
              <div className="permissions-header">
                <div className="permissions-header-wrapper">
                  <div className="permissions-header-brand">
                    <div className="permissions-logo-container">
                      <div className="permissions-logo-ring">
                        <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="permissions-brand-logo" />
                      </div>
                      <div className="permissions-brand-text">
                        <span className="permissions-brand-title">Website Permissions</span>
                        <span className="permissions-brand-subtitle">Access Control & User Management</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Header Background Effects */}
                <div className="permissions-header-bg-effects">
                  <div className="permissions-header-particle"></div>
                  <div className="permissions-header-particle"></div>
                  <div className="permissions-header-particle"></div>
                </div>
              </div>

              <div className="permissions-content">
                <div className="permissions-grid">
                  <div className="permission-card">
                    <div className="permission-icon">
                      <i className="fas fa-users-cog"></i>
                    </div>
                    <h3>User Management</h3>
                    <p>Manage user accounts, roles, and access levels for the website and dashboard.</p>
                    <div className="permission-actions">
                      <button className="btn-permission" onClick={() => handleMenuClick('user-management')}>
                        <i className="fas fa-edit"></i>
                        Manage Users
                      </button>
                    </div>
                  </div>

                  <div className="permission-card">
                    <div className="permission-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Role Permissions</h3>
                    <p>Configure permissions for different roles: Officers, NCOs, and Staff members.</p>
                    <div className="permission-actions">
                      <button className="btn-permission">
                        <i className="fas fa-cog"></i>
                        Configure Roles
                      </button>
                    </div>
                  </div>

                  <div className="permission-card">
                    <div className="permission-icon">
                      <i className="fas fa-key"></i>
                    </div>
                    <h3>Access Codes</h3>
                    <p>Manage access codes for staff portal and different security levels.</p>
                    <div className="permission-actions">
                      <button className="btn-permission">
                        <i className="fas fa-key"></i>
                        Manage Codes
                      </button>
                    </div>
                  </div>

                  <div className="permission-card">
                    <div className="permission-icon">
                      <i className="fas fa-history"></i>
                    </div>
                    <h3>Access Logs</h3>
                    <p>View login attempts, access history, and security audit trails.</p>
                    <div className="permission-actions">
                      <button className="btn-permission">
                        <i className="fas fa-eye"></i>
                        View Logs
                      </button>
                    </div>
                  </div>

                  <div className="permission-card">
                    <div className="permission-icon">
                      <i className="fas fa-database"></i>
                    </div>
                    <h3>Database Access</h3>
                    <p>Configure database permissions and backup settings for personnel data.</p>
                    <div className="permission-actions">
                      <button className="btn-permission">
                        <i className="fas fa-database"></i>
                        Database Settings
                      </button>
                    </div>
                  </div>

                  <div className="permission-card">
                    <div className="permission-icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <h3>Website Settings</h3>
                    <p>Manage website configuration, maintenance mode, and public access settings.</p>
                    <div className="permission-actions">
                      <button className="btn-permission">
                        <i className="fas fa-cogs"></i>
                        Website Config
                      </button>
                    </div>
                  </div>
                </div>

                <div className="permissions-instructions">
                  <h3>
                    <i className="fas fa-info-circle"></i>
                    Permission Management Guidelines
                  </h3>
                  <ul>
                    <li>
                      <i className="fas fa-shield-alt"></i>
                      <span>Only High Command officers have access to permission management</span>
                    </li>
                    <li>
                      <i className="fas fa-users"></i>
                      <span>Role changes require approval from multiple officers for security</span>
                    </li>
                    <li>
                      <i className="fas fa-history"></i>
                      <span>All permission changes are logged and auditable</span>
                    </li>
                    <li>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Access code changes require immediate notification to all staff</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeMenu === 'promotion-logs' && (
            <div className="promotion-logs-logging">
              <div className="promotion-logs-header">
                <div className="promotion-logs-header-wrapper">
                  <div className="promotion-logs-header-brand">
                    <div className="promotion-logs-logo-container">
                      <div className="promotion-logs-logo-ring">
                        <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="promotion-logs-brand-logo" />
                      </div>
                      <div className="promotion-logs-brand-text">
                        <span className="promotion-logs-brand-title">Promotion Logs</span>
                        <span className="promotion-logs-brand-subtitle">Comprehensive tracking and monitoring of all personnel promotions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="promotion-stats-container">
                    <div className="promotion-stat-card">
                      <h3>Total Promotions</h3>
                      <div className="stat-number">{promotionLogs.length}</div>
                    </div>
                    <div className="promotion-stat-card">
                      <h3>Recent Promotions</h3>
                      <div className="stat-number">{promotionLogs.filter(log => {
                        const logDate = new Date(log.date);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return logDate >= thirtyDaysAgo;
                      }).length}</div>
                    </div>
                    <div className="promotion-stat-card">
                      <h3>This Month</h3>
                      <div className="stat-number">{promotionLogs.filter(log => {
                        const logDate = new Date(log.date);
                        const now = new Date();
                        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                      }).length}</div>
                    </div>
                  </div>
                </div>
                
                {/* Header Background Effects */}
                <div className="promotion-logs-header-bg-effects">
                  <div className="promotion-logs-header-particle"></div>
                  <div className="promotion-logs-header-particle"></div>
                  <div className="promotion-logs-header-particle"></div>
                </div>
              </div>


              <div className="promotion-table-section">
                <h3 className="table-title">Promotion Records of Ostpreußisches Landmilizbataillon</h3>
                <div className="promotion-logs-table-container">
                  {/* Table with 6 columns - Status column completely removed */}
                  <table className="promotion-logs-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Personnel</th>
                        <th>Previous Rank</th>
                        <th>New Rank</th>
                        <th>Category Change</th>
                        <th>Processed By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promotionLogs.length > 0 ? promotionLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.date}</td>
                          <td className="personnel-cell">{log.personnel}</td>
                          <td className="rank-cell">{log.previousRank}</td>
                          <td className="rank-cell promoted">{log.newRank}</td>
                          <td className="category-cell">{log.categoryChange}</td>
                          <td className="processed-cell">{log.processedBy}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" style={{textAlign: 'center', fontStyle: 'italic', color: '#6c757d'}}>
                            No promotion records found. Promote personnel to see entries here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="promotion-logs-instructions">
                <h3>
                  <i className="fas fa-chart-line"></i>
                  Promotion Analytics
                </h3>
                <ul>
                  <li>
                    <i className="fas fa-arrow-up"></i>
                    <span>Most Active Category: Low Ranks → NCOs (34% of promotions)</span>
                  </li>
                  <li>
                    <i className="fas fa-calendar-alt"></i>
                    <span>Average Promotions per Month: 12.3 personnel</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Success Rate: 94.7% of promotions completed successfully</span>
                  </li>
                  <li>
                    <i className="fas fa-clock"></i>
                    <span>Last Promotion: 2 days ago (Weber_J to Musketier)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {activeMenu === 'activity-logs' && (
            <div className="activity-logs-logging">
              <div className="activity-logs-header">
                <div className="activity-logs-header-wrapper">
                  <div className="activity-logs-header-brand">
                    <div className="activity-logs-logo-container">
                      <div className="activity-logs-logo-ring">
                        <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="activity-logs-brand-logo" />
                      </div>
                      <div className="activity-logs-brand-text">
                        <span className="activity-logs-brand-title">Activity Logs</span>
                        <span className="activity-logs-brand-subtitle">Complete monitoring of all personnel activities and operations</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="activity-stats-container">
                    <div className="activity-stat-card">
                      <h3>Total Activities</h3>
                      <div className="stat-number">{activityLogs.length}</div>
                    </div>
                    <div className="activity-stat-card">
                      <h3>Recent Changes</h3>
                      <div className="stat-number">{activityLogs.filter(log => {
                        const logDate = new Date(log.date);
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        return logDate >= sevenDaysAgo;
                      }).length}</div>
                    </div>
                    <div className="activity-stat-card">
                      <h3>New Recruits</h3>
                      <div className="stat-number">{activityLogs.filter(log => log.activityType === 'Recruitment').length}</div>
                    </div>
                  </div>
                </div>
                
                {/* Header Background Effects */}
                <div className="activity-logs-header-bg-effects">
                  <div className="activity-logs-header-particle"></div>
                  <div className="activity-logs-header-particle"></div>
                  <div className="activity-logs-header-particle"></div>
                </div>
              </div>

              <div className="activity-table-section">
                <h3 className="table-title">Activity Records of Ostpreußisches Landmilizbataillon</h3>
                <div className="activity-logs-table-container">
                  {/* Table with 6 columns - Complete activity tracking */}
                  <table className="activity-logs-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Activity Type</th>
                        <th>Personnel</th>
                        <th>Details</th>
                        <th>Category</th>
                        <th>Processed By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.length > 0 ? activityLogs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.date}</td>
                          <td className="activity-type-cell">{log.activityType}</td>
                          <td className="personnel-cell">{log.personnel}</td>
                          <td className="details-cell">{log.details}</td>
                          <td className="category-cell">{log.category}</td>
                          <td className="processed-cell">{log.processedBy}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" style={{textAlign: 'center', fontStyle: 'italic', color: '#6c757d'}}>
                            No activity records found. Add recruits or promote personnel to see entries here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="activity-logs-instructions">
                <h3>
                  <i className="fas fa-clipboard-list"></i>
                  Activity Analytics
                </h3>
                <ul>
                  <li>
                    <i className="fas fa-user-plus"></i>
                    <span>Most Common Activity: Training Logs (42% of all activities)</span>
                  </li>
                  <li>
                    <i className="fas fa-calendar-day"></i>
                    <span>Daily Average Activities: 8.7 operations per day</span>
                  </li>
                  <li>
                    <i className="fas fa-users"></i>
                    <span>Active Personnel: 247 soldiers currently in system</span>
                  </li>
                  <li>
                    <i className="fas fa-history"></i>
                    <span>Last Activity: 1 hour ago (Weber_J recruitment)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;