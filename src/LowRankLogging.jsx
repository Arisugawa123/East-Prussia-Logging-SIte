import React from 'react';
import './LowRankLogging.css';

const LowRankLogging = () => {
  const personnelData = [
    {
      rank: "Frei-Korporal",
      username: "FreiKorpUser1",
      basicTraining: 5,
      combatTraining: 4,
      internalRaid: 3,
      practiceRaid: 1,
      status: "Ready for NCOA"
    },
    {
      rank: "Frei-Korporal",
      username: "FreiKorpUser2",
      basicTraining: 3,
      combatTraining: 5,
      internalRaid: 2,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Frei-Korporal",
      username: "FreiKorpUser3",
      basicTraining: 4,
      combatTraining: 3,
      internalRaid: 4,
      practiceRaid: 2,
      status: "Ready for Promotion"
    },
    {
      rank: "Frei-Korporal",
      username: "FreiKorpUser4",
      basicTraining: 6,
      combatTraining: 6,
      internalRaid: 3,
      practiceRaid: 1,
      status: "Ready for NCOA"
    },
    {
      rank: "Frei-Korporal",
      username: "FreiKorpUser5",
      basicTraining: 2,
      combatTraining: 3,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Gefreiter",
      username: "GefreiterUser1",
      basicTraining: 3,
      combatTraining: 4,
      internalRaid: 2,
      practiceRaid: 1,
      status: "Ready for Promotion"
    },
    {
      rank: "Gefreiter",
      username: "GefreiterUser2",
      basicTraining: 2,
      combatTraining: 3,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Gefreiter",
      username: "GefreiterUser3",
      basicTraining: 4,
      combatTraining: 5,
      internalRaid: 3,
      practiceRaid: 1,
      status: "Ready for NCOA"
    },
    {
      rank: "Gefreiter",
      username: "GefreiterUser4",
      basicTraining: 3,
      combatTraining: 3,
      internalRaid: 2,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Gefreiter",
      username: "GefreiterUser5",
      basicTraining: 5,
      combatTraining: 4,
      internalRaid: 2,
      practiceRaid: 1,
      status: "Ready for Promotion"
    },
    {
      rank: "Musketier",
      username: "MusketierUser1",
      basicTraining: 2,
      combatTraining: 3,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Ready for Promotion"
    },
    {
      rank: "Musketier",
      username: "MusketierUser2",
      basicTraining: 3,
      combatTraining: 2,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Musketier",
      username: "MusketierUser3",
      basicTraining: 1,
      combatTraining: 4,
      internalRaid: 2,
      practiceRaid: 1,
      status: "Ready for NCOA"
    },
    {
      rank: "Musketier",
      username: "MusketierUser4",
      basicTraining: 2,
      combatTraining: 3,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Ready for Promotion"
    },
    {
      rank: "Musketier",
      username: "MusketierUser5",
      basicTraining: 4,
      combatTraining: 3,
      internalRaid: 2,
      practiceRaid: 0,
      status: "Ready for Promotion"
    },
    {
      rank: "Rekrut",
      username: "RecruitUser1",
      basicTraining: 1,
      combatTraining: 2,
      internalRaid: 0,
      practiceRaid: 0,
      status: "Ready for Promotion"
    },
    {
      rank: "Rekrut",
      username: "RecruitUser2",
      basicTraining: 0,
      combatTraining: 1,
      internalRaid: 0,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Rekrut",
      username: "RecruitUser3",
      basicTraining: 2,
      combatTraining: 2,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Ready for Promotion"
    },
    {
      rank: "Rekrut",
      username: "RecruitUser4",
      basicTraining: 1,
      combatTraining: 1,
      internalRaid: 0,
      practiceRaid: 0,
      status: "Inactivity Notice"
    },
    {
      rank: "Rekrut",
      username: "RecruitUser5",
      basicTraining: 0,
      combatTraining: 3,
      internalRaid: 1,
      practiceRaid: 0,
      status: "Ready for Promotion"
    }
  ];

  const getScoreClass = (score) => {
    if (score === 0) return 'score-none';
    if (score <= 2) return 'score-poor';
    if (score <= 3) return 'score-average';
    if (score <= 4) return 'score-good';
    return 'score-excellent';
  };

  const getStatusClass = (status) => {
    if (status === 'Ready for NCOA') return 'status-ncoa';
    if (status === 'Ready for Promotion') return 'status-promotion';
    if (status === 'Inactivity Notice') return 'status-inactive';
    return 'status-default';
  };

  return (
    <div className="low-rank-logging">
      <div className="low-rank-header">
        <h2>Low Rank Management</h2>
        <p>Training progress tracking for enlisted personnel</p>
      </div>
      
      <div className="training-table-container">
        <div className="table-wrapper">
          <table className="training-progress-table">
            <thead>
              <tr>
                <th className="rank-header">Rank</th>
                <th className="username-header">Username</th>
                <th className="training-header">Basic Training</th>
                <th className="training-header">Combat Training</th>
                <th className="training-header">Internal Practical Raid</th>
                <th className="training-header">Practice Raid</th>
                <th className="status-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {personnelData.map((person, index) => (
                <tr key={index} className="personnel-row">
                  <td className="rank-cell">{person.rank}</td>
                  <td className="username-cell">{person.username}</td>
                  <td className={`training-score ${getScoreClass(person.basicTraining)}`}>
                    {person.basicTraining}
                  </td>
                  <td className={`training-score ${getScoreClass(person.combatTraining)}`}>
                    {person.combatTraining}
                  </td>
                  <td className={`training-score ${getScoreClass(person.internalRaid)}`}>
                    {person.internalRaid}
                  </td>
                  <td className={`training-score ${getScoreClass(person.practiceRaid)}`}>
                    {person.practiceRaid}
                  </td>
                  <td className={`status-cell ${getStatusClass(person.status)}`}>
                    {person.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="table-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Personnel:</span>
            <span className="stat-value">{personnelData.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ready for NCOA:</span>
            <span className="stat-value">
              {personnelData.filter(p => p.status === 'Ready for NCOA').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ready for Promotion:</span>
            <span className="stat-value">
              {personnelData.filter(p => p.status === 'Ready for Promotion').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Inactivity Notices:</span>
            <span className="stat-value">
              {personnelData.filter(p => p.status === 'Inactivity Notice').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowRankLogging;