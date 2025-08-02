import React, { useState, useEffect } from 'react';
import './RegimentOverview.css';
import { 
  FaCrown, 
  FaShieldAlt, 
  FaUsers, 
  FaMedal,
  FaFlag,
  FaMapMarkedAlt,
  FaHistory,
  FaChartBar,
  FaCalendarAlt,
  FaUserTie,
  FaUserShield,
  FaAward,
  FaStar,
  FaGlobe,
  FaBook,
  FaClipboardList,
  FaInfoCircle,
  FaSpinner
} from 'react-icons/fa';
import { personnelService, promotionService, activityService, subscriptions } from './lib/supabase';

const RegimentOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [regimentStats, setRegimentStats] = useState({
    totalPersonnel: 0,
    activeOfficers: 0,
    activeNCOs: 0,
    enlisted: 0,
    monthsActive: 4,
    established: 2025,
    battles: 0,
    victories: 0
  });
  const [commandStructure, setCommandStructure] = useState([]);
  const [regimentHistory, setRegimentHistory] = useState([]);
  const [error, setError] = useState(null);

  // Load data from Supabase
  useEffect(() => {
    loadRegimentData();
    
    // Set up real-time subscriptions
    const personnelSubscription = subscriptions.subscribeToPersonnel(() => {
      loadRegimentData();
    });

    return () => {
      personnelSubscription.unsubscribe();
    };
  }, []);

  const loadRegimentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load regiment statistics
      const stats = await personnelService.getRegimentStats();
      setRegimentStats(prev => ({
        ...prev,
        ...stats
      }));

      // Load command structure
      const personnel = await personnelService.getAllPersonnel();
      const structuredPersonnel = personnel.map(person => ({
        rank: person.rank,
        name: person.username,
        position: person.position,
        category: person.category,
        icon: getRankIcon(person.rank)
      }));
      setCommandStructure(structuredPersonnel);

      // Load recent activities for history
      const activities = await activityService.getAllActivities();
      const historyEvents = activities.slice(0, 10).map(activity => ({
        date: new Date(activity.activity_date).toISOString().split('T')[0],
        event: activity.activity_type,
        description: activity.details,
        type: activity.activity_type.toLowerCase()
      }));
      
      // Add static founding events if no activities
      if (historyEvents.length === 0) {
        setRegimentHistory([
          {
            date: '2025-01-01',
            event: 'Regiment Established',
            description: 'Ostpreußisches Landmilizbataillon officially formed',
            type: 'founding'
          },
          {
            date: '2025-01-15',
            event: 'First Recruitment Drive',
            description: 'Initial recruitment campaign launched',
            type: 'recruitment'
          }
        ]);
      } else {
        setRegimentHistory(historyEvents);
      }

    } catch (err) {
      console.error('Error loading regiment data:', err);
      setError('Failed to load regiment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    const iconMap = {
      'Oberst': <FaCrown />,
      'Oberstleutnant': <FaShieldAlt />,
      'Major': <FaStar />,
      'Hauptmann': <FaUserTie />,
      'Premierleutnant': <FaUserTie />,
      'Sekondeleutnant': <FaUserTie />,
      'Feldwebel': <FaMedal />,
      'Junker': <FaMedal />,
      'Sergeant': <FaUserShield />,
      'Korporal': <FaAward />,
      'Gefreiter': <FaUsers />,
      'Musketier': <FaUsers />,
      'Rekrut': <FaUsers />
    };
    return iconMap[rank] || <FaUsers />;
  };

  return (
    <div className="regiment-overview">
      {/* Header Section */}
      <div className="regiment-header">
        <div className="regiment-header-wrapper">
          <div className="regiment-header-brand">
            <div className="regiment-logo-container">
              <div className="regiment-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="regiment-brand-logo" />
              </div>
              <div className="regiment-brand-text">
                <span className="regiment-brand-title">Prussia Regiment Overview</span>
                <span className="regiment-brand-subtitle">Ostpreußisches Landmilizbataillon</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="regiment-header-bg-effects">
          <div className="regiment-header-particle"></div>
          <div className="regiment-header-particle"></div>
          <div className="regiment-header-particle"></div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="regiment-nav-tabs">
        <button 
          className={`regiment-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartBar />
          Prussia Overview
        </button>
        <button 
          className={`regiment-tab ${activeTab === 'command' ? 'active' : ''}`}
          onClick={() => setActiveTab('command')}
        >
          <FaCrown />
          Prussia Command Structure
        </button>
        <button 
          className={`regiment-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory />
          Prussia Regiment History
        </button>
        <button 
          className={`regiment-tab ${activeTab === 'information' ? 'active' : ''}`}
          onClick={() => setActiveTab('information')}
        >
          <FaInfoCircle />
          Prussia Information
        </button>
      </div>

      {/* Content Area */}
      <div className="regiment-content">
        {loading && (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
            <p>Loading Prussia Regiment data...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={loadRegimentData} className="retry-button">
              Retry Loading
            </button>
          </div>
        )}
        
        {!loading && !error && activeTab === 'overview' && (
          <div className="overview-section">
            {/* Regiment Statistics */}
            <div className="regiment-stats-grid">
              <div className="regiment-stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h3>Total Personnel</h3>
                  <span className="stat-number">{regimentStats.totalPersonnel}</span>
                  <p>Active Members</p>
                </div>
              </div>

              <div className="regiment-stat-card">
                <div className="stat-icon">
                  <FaUserTie />
                </div>
                <div className="stat-content">
                  <h3>Officers</h3>
                  <span className="stat-number">{regimentStats.activeOfficers}</span>
                  <p>Commissioned</p>
                </div>
              </div>

              <div className="regiment-stat-card">
                <div className="stat-icon">
                  <FaUserShield />
                </div>
                <div className="stat-content">
                  <h3>NCOs</h3>
                  <span className="stat-number">{regimentStats.activeNCOs}</span>
                  <p>Non-Commissioned</p>
                </div>
              </div>

              <div className="regiment-stat-card">
                <div className="stat-icon">
                  <FaCalendarAlt />
                </div>
                <div className="stat-content">
                  <h3>Months Active</h3>
                  <span className="stat-number">{regimentStats.monthsActive}</span>
                  <p>Since Formation</p>
                </div>
              </div>
            </div>

            {/* Regiment Information Cards */}
            <div className="regiment-info-grid">
              <div className="regiment-info-card">
                <div className="info-header">
                  <FaFlag className="info-icon" />
                  <h3>Regiment Identity</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <strong>Full Name:</strong> Ostpreußisches Landmilizbataillon
                  </div>
                  <div className="info-item">
                    <strong>Designation:</strong> East Prussian Militia Battalion
                  </div>
                  <div className="info-item">
                    <strong>Established:</strong> {regimentStats.established}
                  </div>
                  <div className="info-item">
                    <strong>Motto:</strong> "Für König und Vaterland"
                  </div>
                </div>
              </div>

              <div className="regiment-info-card">
                <div className="info-header">
                  <FaMapMarkedAlt className="info-icon" />
                  <h3>Operational Area</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <strong>Primary Theater:</strong> Continental Army Operations
                  </div>
                  <div className="info-item">
                    <strong>Jurisdiction:</strong> Kingdom of Prussia
                  </div>
                  <div className="info-item">
                    <strong>Headquarters:</strong> Discord Server
                  </div>
                  <div className="info-item">
                    <strong>Training Grounds:</strong> Roblox Platform
                  </div>
                </div>
              </div>

              <div className="regiment-info-card">
                <div className="info-header">
                  <FaGlobe className="info-icon" />
                  <h3>External Links</h3>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <strong>Discord Server:</strong> 
                    <a href="https://discord.gg/XcDhPvgSgC" target="_blank" rel="noopener noreferrer">
                      Kingdom of Prussia
                    </a>
                  </div>
                  <div className="info-item">
                    <strong>Roblox Group:</strong> 
                    <a href="https://www.roblox.com/communities/35793391/Kingdom-of-Prussi" target="_blank" rel="noopener noreferrer">
                      Kingdom of Prussia
                    </a>
                  </div>
                  <div className="info-item">
                    <strong>Continental Army:</strong> 
                    <a href="https://www.roblox.com/communities/3014544/The-Continental-Army#!/about" target="_blank" rel="noopener noreferrer">
                      Main Organization
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && activeTab === 'command' && (
          <div className="command-section">
            <div className="command-structure-grid">
              {['High Command', 'Officer Corps', 'Senior NCOs', 'Junior NCOs'].map(category => (
                <div key={category} className="command-category">
                  <div className="category-header">
                    <h3>{category}</h3>
                  </div>
                  <div className="category-members">
                    {commandStructure
                      .filter(member => member.category === category)
                      .map((member, index) => (
                        <div key={index} className="command-member-card">
                          <div className="member-icon">
                            {member.icon}
                          </div>
                          <div className="member-info">
                            <h4>{member.rank}</h4>
                            <p className="member-name">{member.name}</p>
                            <span className="member-position">{member.position}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && activeTab === 'history' && (
          <div className="history-section">
            <div className="history-timeline">
              <h3>Regiment Timeline</h3>
              <div className="timeline-container">
                {regimentHistory.map((event, index) => (
                  <div key={index} className={`timeline-item ${event.type}`}>
                    <div className="timeline-date">{event.date}</div>
                    <div className="timeline-content">
                      <h4>{event.event}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && activeTab === 'information' && (
          <div className="information-section">
            <div className="information-grid">
              <div className="info-card">
                <div className="info-card-header">
                  <FaBook className="info-card-icon" />
                  <h3>Historical Context</h3>
                </div>
                <div className="info-card-content">
                  <p>
                    The Ostpreußisches Landmilizbataillon was originally formed in 1757 during the Seven Years' War 
                    to defend East Prussia from Russian invasion. Our modern regiment honors this legacy while 
                    serving in the Continental Army framework.
                  </p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <FaClipboardList className="info-card-icon" />
                  <h3>Organization Structure</h3>
                </div>
                <div className="info-card-content">
                  <p>
                    The regiment follows traditional Prussian military hierarchy with High Command, Officer Corps, 
                    and Non-Commissioned Officers. Each rank has specific responsibilities and advancement paths 
                    based on merit and service.
                  </p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <FaUsers className="info-card-icon" />
                  <h3>Recruitment</h3>
                </div>
                <div className="info-card-content">
                  <p>
                    New members can join through the Continental Army Discord server and complete the enlistment 
                    process. All recruits undergo training and are assigned to appropriate positions based on 
                    experience and aptitude.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegimentOverview;