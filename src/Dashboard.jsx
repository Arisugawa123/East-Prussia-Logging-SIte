import React, { useState } from 'react';
import './Dashboard.css';
import LowRankLoggingNew from './LowRankLoggingNew';
import NCOLogging from './NCOLogging';
import InactivityNotice from './InactivityNotice';
import OfficerLogging from './OfficerLogging';
import RetiredPersonnel from './RetiredPersonnel';
import HallOfHiCom from './HallOfHiCom';
import Personnels from './Personnels';

const Dashboard = ({ onClose }) => {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [expandedCategory, setExpandedCategory] = useState('regiment');

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? '' : category);
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

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
                  className={`dashboard-nav-link-modern ${activeMenu === 'members' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('members')}
                >
                  <span className="dashboard-link-text">Members</span>
                  <div className="dashboard-link-underline"></div>
                </button>
                <button 
                  className={`dashboard-nav-link-modern ${activeMenu === 'reports' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('reports')}
                >
                  <span className="dashboard-link-text">Reports</span>
                  <div className="dashboard-link-underline"></div>
                </button>
                <button 
                  className={`dashboard-nav-link-modern ${activeMenu === 'settings' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('settings')}
                >
                  <span className="dashboard-link-text">Settings</span>
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
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content">
          {activeMenu === 'overview' && (
            <div className="content-section">
              <h2>Regiment Overview</h2>
              <div className="overview-cards">
                <div className="stat-card">
                  <h3>Total Personnel</h3>
                  <div className="stat-number">247</div>
                </div>
                <div className="stat-card">
                  <h3>Active Officers</h3>
                  <div className="stat-number">23</div>
                </div>
                <div className="stat-card">
                  <h3>NCOs</h3>
                  <div className="stat-number">45</div>
                </div>
                <div className="stat-card">
                  <h3>Enlisted</h3>
                  <div className="stat-number">179</div>
                </div>
              </div>
            </div>
          )}
          
          {activeMenu === 'personnels' && (
            <Personnels />
          )}
          
          {activeMenu === 'hall-of-hicom' && (
            <HallOfHiCom />
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;