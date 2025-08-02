import React, { useState } from 'react'
import './RankingInformation.css'
import { FaClipboardList, FaMouse, FaKeyboard, FaChartBar, FaDownload } from 'react-icons/fa'

function RankingInformation() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="ranking-logging">
      {/* Header */}
      <div className="ranking-header">
        <div className="ranking-header-wrapper">
          <div className="ranking-header-brand">
            <div className="ranking-logo-container">
              <div className="ranking-logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="ranking-brand-logo" />
              </div>
              <div className="ranking-brand-text">
                <span className="ranking-brand-title">Prussia Ranking Information</span>
                <span className="ranking-brand-subtitle">Military hierarchy and promotion requirements</span>
              </div>
            </div>
          </div>
          
          <button className="download-guide-btn" onClick={() => setShowModal(true)}>
            <i className="fas fa-download"></i>
            Download Guide
          </button>
        </div>
        
        {/* Header Background Effects */}
        <div className="ranking-header-bg-effects">
          <div className="ranking-header-particle"></div>
          <div className="ranking-header-particle"></div>
          <div className="ranking-header-particle"></div>
        </div>
      </div>

      {/* Staff Promotion Requirements */}
      <div className="personnel-table-section">
        <div className="table-title">Staff Promotion Requirements</div>

        <div className="personnel-table-container">
          <table className="personnel-table">
              <thead>
                <tr>
                  <th>Rank Progression</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="rank-cell">Oberstleutnant → Oberst</td>
                  <td>Appointed by Prussian High Council</td>
                </tr>
                <tr>
                  <td className="rank-cell">Major → Oberstleutnant</td>
                  <td>Appointed by Prussian High Council, Oberst suggestion required</td>
                </tr>
                <tr>
                  <td className="rank-cell">Hauptmann → Major</td>
                  <td>Appointed by Regimental High Command</td>
                </tr>
                <tr>
                  <td className="rank-cell">Premierleutnant → Hauptmann</td>
                  <td>Appointed by Regimental High Command</td>
                </tr>
                <tr>
                  <td className="rank-cell">Sekondeleutnant → Premierleutnant</td>
                  <td>Passing Officer Academy, Appointed by Brigadegeneral+</td>
                </tr>
                <tr>
                  <td className="rank-cell">Feldwebel → Sekondeleutnant</td>
                  <td>Recommendation from Regimental High Command, accepted by Brigadegeneral+</td>
                </tr>
                <tr>
                  <td className="rank-cell">Junker → Feldwebel</td>
                  <td>Promoted by Regimental High Command</td>
                </tr>
                <tr>
                  <td className="rank-cell">Sergeant → Junker</td>
                  <td>Promoted by Regimental High Command</td>
                </tr>
                <tr>
                  <td className="rank-cell">Korporal → Sergeant</td>
                  <td>Promoted by Regimental High Command</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      {/* Low Rank Progression */}
      <div className="personnel-table-section">
        <div className="table-title">Low Rank Progression</div>

        <div className="personnel-table-container">
          <table className="personnel-table">
              <thead>
                <tr>
                  <th>Rank Progression</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="rank-cell">Frei Korporal → Korporal</td>
                  <td>Pass NCOA</td>
                </tr>
                <tr>
                  <td className="rank-cell">Gefreiter → Frei Korporal</td>
                  <td>3 BTs & 3 CTs & 2 IPRs</td>
                </tr>
                <tr>
                  <td className="rank-cell">Musketry → Gefreiter</td>
                  <td>2 BTs & 3 CTs & 1 IPR</td>
                </tr>
                <tr>
                  <td className="rank-cell">Recruit → Musketry</td>
                  <td>1 BT & 2 CTs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      {/* Promotion Authority Levels */}
      <div className="personnel-table-section">
        <div className="table-title">Promotion Authority Levels</div>

        <div className="authority-cards">
            <div className="authority-card high-council">
              <div className="authority-header">
                <div className="authority-icon">
                  <i className="fas fa-crown"></i>
                </div>
                <h3>Prussian High Council</h3>
              </div>
              <div className="authority-content">
                <p>Supreme military authority for senior officer appointments</p>
                <div className="authority-scope">
                  <span className="scope-item">Oberst Appointments</span>
                  <span className="scope-item">Oberstleutnant Appointments</span>
                </div>
              </div>
            </div>

            <div className="authority-card regimental">
              <div className="authority-header">
                <div className="authority-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3>Regimental High Command</h3>
              </div>
              <div className="authority-content">
                <p>Officer and senior NCO promotions</p>
                <div className="authority-scope">
                  <span className="scope-item">Major Appointments</span>
                  <span className="scope-item">Hauptmann Appointments</span>
                  <span className="scope-item">NCO Promotions</span>
                </div>
              </div>
            </div>

            <div className="authority-card brigade">
              <div className="authority-header">
                <div className="authority-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Brigadegeneral+</h3>
              </div>
              <div className="authority-content">
                <p>Officer commissioning and academy graduates</p>
                <div className="authority-scope">
                  <span className="scope-item">Officer Academy Graduates</span>
                  <span className="scope-item">Commission Approvals</span>
                </div>
              </div>
            </div>
        </div>
      </div>

      <div className="ranking-instructions">
        <h3>
          <FaClipboardList className="instruction-header-icon" />
          Promotion Guidelines
        </h3>
        <ul>
          <li>
            <FaChartBar className="instruction-icon" />
            <span>All promotions follow strict military hierarchy and requirements</span>
          </li>
          <li>
            <FaKeyboard className="instruction-icon" />
            <span>BT = Basic Training, CT = Combat Training, IPR = Individual Performance Review</span>
          </li>
          <li>
            <FaMouse className="instruction-icon" />
            <span>NCOA = Non-Commissioned Officer Academy certification required</span>
          </li>
          <li>
            <FaDownload className="instruction-icon" />
            <span>Click "Download Guide" to get the complete promotion manual</span>
          </li>
        </ul>
      </div>

      {/* Download Guide Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ranking-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-brand">
                <div className="modal-logo-container">
                  <div className="modal-logo-ring">
                    <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="modal-brand-logo" />
                  </div>
                  <div className="modal-brand-text">
                    <span className="modal-brand-title">Prussia Promotion Guide</span>
                    <span className="modal-brand-subtitle">Ostpreußisches Landmilizbataillon</span>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="download-info">
                <div className="download-icon">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <h4>Complete Promotion Manual</h4>
                <p>Download the comprehensive guide containing detailed promotion requirements, training schedules, and military protocols for the Ostpreußisches Landmilizbataillon.</p>
                
                <div className="file-details">
                  <div className="file-detail">
                    <span className="detail-label">File Type:</span>
                    <span className="detail-value">PDF Document</span>
                  </div>
                  <div className="file-detail">
                    <span className="detail-label">File Size:</span>
                    <span className="detail-value">2.4 MB</span>
                  </div>
                  <div className="file-detail">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">December 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-download" onClick={() => {
                alert('Download started! The promotion guide will be saved to your downloads folder.');
                setShowModal(false);
              }}>
                <i className="fas fa-download"></i>
                Download Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RankingInformation