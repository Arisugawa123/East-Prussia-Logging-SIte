import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './Dashboard'
import { createClient } from '@supabase/supabase-js'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = '372631332637-9h00k2e1qf5rklkh298s5j6avf0itnhn.apps.googleusercontent.com'

// Supabase configuration
const supabaseUrl = 'https://duqpkttgmldgteeuuwbd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cXBrdHRnbWxkZ3RlZXV3dWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjkyODQsImV4cCI6MjA2OTcwNTI4NH0.KnJ88n8GDXdydNzzTqR-2RXqxBILfpdlea7JFdSqIbg'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem('prussianStaffSession')
        if (sessionData) {
          const session = JSON.parse(sessionData)
          const now = new Date().getTime()
          
          // Check if session is still valid (24 hours)
          if (session.expires && now < session.expires) {
            setShowDashboard(true)
          } else {
            // Session expired, remove it
            localStorage.removeItem('prussianStaffSession')
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        localStorage.removeItem('prussianStaffSession')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // Function to create session
  const createSession = (authMethod = 'access_code', userInfo = null) => {
    const sessionData = {
      loginTime: new Date().getTime(),
      expires: new Date().getTime() + (24 * 60 * 60 * 1000), // 24 hours
      accessLevel: 'staff',
      authMethod: authMethod,
      userInfo: userInfo
    }
    localStorage.setItem('prussianStaffSession', JSON.stringify(sessionData))
  }

  // Function to clear session
  const clearSession = () => {
    localStorage.removeItem('prussianStaffSession')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    const accessCode = e.target.accessCode.value
    
    if (!accessCode) {
      alert('Please enter your access code')
      return
    }
    
    // Simulate login process
    if (accessCode.toUpperCase() === 'KONIGSBERG') {
      createSession() // Create persistent session
      setIsLoginModalOpen(false)
      setShowDashboard(true)
      alert('Login successful! Welcome to the command center.')
    } else {
      alert('Invalid access code. Please try again.')
    }
    
    e.target.reset()
  }

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    
    try {
      // Check if Google Identity Services is loaded
      if (!window.google) {
        console.error('Google Identity Services not loaded')
        alert('Google services are loading. Please wait a moment and try again.')
        setIsGoogleLoading(false)
        return
      }

      console.log('Google services available, initializing...')

      // Try the popup flow directly (more reliable)
      if (window.google.accounts.oauth2) {
        console.log('Using OAuth2 popup flow')
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: handleGoogleTokenCallback,
          error_callback: (error) => {
            console.error('OAuth2 error:', error)
            setIsGoogleLoading(false)
            alert('Google Sign-In failed. Please check your internet connection and try again.')
          }
        })
        
        tokenClient.requestAccessToken({
          prompt: 'consent'
        })
      } else {
        // Fallback to ID token flow
        console.log('Using ID token flow')
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: false
        })

        // Try to render a button and click it programmatically
        const buttonDiv = document.createElement('div')
        buttonDiv.style.display = 'none'
        document.body.appendChild(buttonDiv)

        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          type: 'standard'
        })

        // Trigger the sign-in
        window.google.accounts.id.prompt((notification) => {
          console.log('Prompt notification:', notification)
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Clean up
            document.body.removeChild(buttonDiv)
            setIsGoogleLoading(false)
            alert('Google Sign-In popup was blocked or cancelled. Please allow popups and try again.')
          }
        })
      }

    } catch (error) {
      console.error('Google Sign-In error:', error)
      setIsGoogleLoading(false)
      alert('Google Sign-In failed. Please try the access code method or refresh the page.')
    }
  }

  // Handle Google OAuth callback
  const handleGoogleCallback = async (response) => {
    try {
      console.log('🔍 Processing Google authentication...');
      
      // Decode JWT token to get user info
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]))
      console.log('👤 User email:', userInfo.email);
      
      // Check if user is authorized using Supabase
      const userRank = await isAuthorizedUser(userInfo.email)
      
      if (userRank) {
        console.log('✅ User authorized with rank:', userRank);
        
        createSession('google_oauth', {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          rank: userRank,
          accessLevel: userRank
        })
        
        setIsLoginModalOpen(false)
        setShowDashboard(true)
        alert(`Welcome ${userInfo.name}! Authenticated as ${userRank}.`)
      } else {
        console.log('❌ User not authorized:', userInfo.email);
        alert('Access denied. Your Google account is not authorized for staff access.')
      }
    } catch (error) {
      console.error('❌ Google callback error:', error)
      alert('Authentication failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Handle Google token callback (fallback method)
  const handleGoogleTokenCallback = async (response) => {
    try {
      if (response.access_token) {
        // Fetch user info using the access token
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`
          }
        })
        
        const userInfo = await userResponse.json()
        
        const userRank = isAuthorizedUser(userInfo.email)
        if (userRank) {
          createSession('google_oauth', {
            ...userInfo,
            rank: userRank,
            accessLevel: userRank
          })
          setIsLoginModalOpen(false)
          setShowDashboard(true)
          alert(`Welcome ${userInfo.name}! Authenticated as ${userRank}.`)
        } else {
          alert('Access denied. Your Google account is not authorized for staff access.')
        }
      }
    } catch (error) {
      console.error('Token callback error:', error)
      alert('Authentication failed. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Check if user is authorized using Supabase
  const isAuthorizedUser = async (email) => {
    try {
      console.log('🔍 Checking authorization for:', email);
      
      const { data, error } = await supabase
        .from('authorized_users')
        .select('email, rank, status')
        .eq('email', email.toLowerCase())
        .eq('status', 'Active')
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        
        // Fallback for your email if database fails
        if (email.toLowerCase() === 'ironwolftrojanmotionscape@gmail.com') {
          console.log('✅ Using fallback authorization for owner');
          return 'HICOM';
        }
        return null;
      }

      if (data) {
        console.log('✅ User authorized:', data);
        
        // Update last login
        await supabase
          .from('authorized_users')
          .update({ last_login: new Date().toISOString() })
          .eq('email', email.toLowerCase());
          
        return data.rank;
      }

      return null;
    } catch (error) {
      console.error('❌ Authorization check failed:', error);
      
      // Fallback for your email
      if (email.toLowerCase() === 'ironwolftrojanmotionscape@gmail.com') {
        console.log('✅ Using emergency fallback for owner');
        return 'HICOM';
      }
      return null;
    }
  }

  // Load Google Identity Services script
  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if script is already loaded
      if (window.google) {
        console.log('Google Identity Services already loaded')
        return
      }

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="gsi/client"]')
      if (existingScript) {
        console.log('Google script tag already exists')
        return
      }

      console.log('Loading Google Identity Services...')
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log('Google Identity Services loaded successfully')
      }
      
      script.onerror = () => {
        console.error('Failed to load Google Identity Services')
      }
      
      document.head.appendChild(script)
    }

    loadGoogleScript()

    // Cleanup function
    return () => {
      // Don't remove the script as it might be needed elsewhere
      // Just log that component is unmounting
      console.log('Google OAuth component unmounting')
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    clearSession()
    setShowDashboard(false)
  }

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        color: '#ffd700',
        fontFamily: 'Cinzel, serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #ffd700',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading Prussian Command Center...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Show dashboard if logged in
  if (showDashboard) {
    return <Dashboard onClose={handleLogout} />
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="modern-navbar">
        <div className="nav-wrapper">
          {/* Logo Section */}
          <div className="nav-brand">
            <div className="logo-container">
              <div className="logo-ring">
                <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="brand-logo" />
              </div>
              <div className="brand-text">
                <span className="brand-title">East Prussian Regiment</span>
                <span className="brand-subtitle">Ostpreußisches Landmilizbataillon</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className={`nav-links ${isMenuOpen ? 'nav-active' : ''}`}>
            <div className="nav-items">
              <a href="#home" className="nav-link-modern" onClick={() => setIsMenuOpen(false)}>
                <span className="link-text">Home</span>
                <div className="link-underline"></div>
              </a>
              <a href="#ranks" className="nav-link-modern" onClick={() => setIsMenuOpen(false)}>
                <span className="link-text">Ranks</span>
                <div className="link-underline"></div>
              </a>
              <a href="#about" className="nav-link-modern" onClick={() => setIsMenuOpen(false)}>
                <span className="link-text">About</span>
                <div className="link-underline"></div>
              </a>
              <a href="#games" className="nav-link-modern" onClick={() => setIsMenuOpen(false)}>
                <span className="link-text">Enlist</span>
                <div className="link-underline"></div>
              </a>
              <a href="#contact" className="nav-link-modern" onClick={() => setIsMenuOpen(false)}>
                <span className="link-text">Contact</span>
                <div className="link-underline"></div>
              </a>
            </div>
            
            {/* Staff Login Button */}
            <button className="staff-access-btn" onClick={() => setIsLoginModalOpen(true)}>
              <span className="btn-text">Staff Portal</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className={`mobile-toggle ${isMenuOpen ? 'toggle-active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
          </div>
        </div>

        {/* Navigation Background Effects */}
        <div className="nav-bg-effects">
          <div className="nav-particle"></div>
          <div className="nav-particle"></div>
          <div className="nav-particle"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="hero-images">
            <div className="hero-image-item" style={{'--delay': '0s'}}>
              <img src="./hero-image-1.png" alt="East Prussian Heritage 1" />
            </div>
            <div className="hero-image-item" style={{'--delay': '0.5s'}}>
              <img src="./hero-image-2.png" alt="East Prussian Heritage 2" />
            </div>
            <div className="hero-image-item" style={{'--delay': '1s'}}>
              <img src="./hero-image-3.png" alt="East Prussian Heritage 3" />
            </div>
            <div className="hero-image-item" style={{'--delay': '1.5s'}}>
              <img src="./hero-image-4.png" alt="East Prussian Heritage 4" />
            </div>
          </div>
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-crown"></i>
            <span>Est. 2025</span>
          </div>
          <h1 className="hero-title">East Prussian Regiment</h1>
          <p className="hero-subtitle">Elite Military Excellence</p>
          <div className="hero-description">
            <p><strong>Ostpreußisches Landmilizbataillon</strong><br />
            <em>Defenders of East Prussia, 1757</em></p>
            <p>An elite provincial militia formed during the Seven Years' War to protect East Prussia. Composed of loyal townsmen and trained Jäger, the battalion stood ready to defend the homeland under the Black Eagle banner. Rooted in discipline, honor, and local pride.</p>
            <p><strong>Für König und Vaterland.</strong></p>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">16</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Months Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2025</span>
              <span className="stat-label">Established</span>
            </div>
          </div>
          <div className="hero-buttons">
            <a href="#games" className="btn btn-primary">
              <i className="fas fa-user-plus"></i>
              Enlist Now
            </a>
            <a href="#about" className="btn btn-secondary">
              <i className="fas fa-info-circle"></i>
              Learn More
            </a>
            <a href="#contact" className="btn btn-tertiary">
              <i className="fab fa-discord"></i>
              Join Discord Server
            </a>
          </div>
        </div>
        
        {/* Enhanced Decorative Elements */}
        <div className="hero-decoration">
          <div className="floating-elements">
            <div className="floating-element" style={{'--delay': '0s', '--duration': '6s'}}>⚔️</div>
            <div className="floating-element" style={{'--delay': '2s', '--duration': '8s'}}>🏰</div>
            <div className="floating-element" style={{'--delay': '4s', '--duration': '7s'}}>🦅</div>
            <div className="floating-element" style={{'--delay': '1s', '--duration': '9s'}}>👑</div>
            <div className="floating-element" style={{'--delay': '3s', '--duration': '10s'}}>🛡️</div>
            <div className="floating-element" style={{'--delay': '5s', '--duration': '7s'}}>⚡</div>
          </div>
        </div>
        
        {/* Animated Background Pattern */}
        <div className="hero-pattern">
          <div className="pattern-grid">
            <div className="pattern-dot" style={{'--delay': '0s'}}></div>
            <div className="pattern-dot" style={{'--delay': '0.2s'}}></div>
            <div className="pattern-dot" style={{'--delay': '0.4s'}}></div>
            <div className="pattern-dot" style={{'--delay': '0.6s'}}></div>
            <div className="pattern-dot" style={{'--delay': '0.8s'}}></div>
            <div className="pattern-dot" style={{'--delay': '1s'}}></div>
          </div>
        </div>
      </section>

      {/* East Prussian Military Command Section */}
      <section id="ranks" className="rank-structure">
        {/* Military Background */}
        <div className="military-background">
          <div className="military-pattern"></div>
          <div className="military-overlay"></div>
          <div className="floating-military-elements">
            <div className="military-element" style={{'--delay': '0s'}}>⚔️</div>
            <div className="military-element" style={{'--delay': '2s'}}>🛡️</div>
            <div className="military-element" style={{'--delay': '4s'}}>👑</div>
            <div className="military-element" style={{'--delay': '6s'}}>🦅</div>
            <div className="military-element" style={{'--delay': '8s'}}>🏰</div>
          </div>
        </div>

        <div className="container">
          {/* Enhanced Header */}
          <div className="ranks-header">
            <div className="header-decoration">
              <div className="prussian-eagle-large">
                <i className="fas fa-crown"></i>
              </div>
            </div>
            <h2 className="section-title enhanced">East Prussian Military Command</h2>
            <p className="section-subtitle enhanced">Ostpreußisches Landmilizbataillon - Command Structure</p>
            <div className="header-divider">
              <div className="divider-line"></div>
              <div className="divider-emblem">
                <i className="fas fa-star"></i>
              </div>
              <div className="divider-line"></div>
            </div>
          </div>
          
          <div className="rank-hierarchy enhanced">
            {/* HIGH COMMAND */}
            <div className="rank-group high-command enhanced">
              <div className="group-header enhanced">
                <div className="header-background"></div>
                <div className="group-content">
                  <div className="group-badge">
                    <i className="fas fa-crown"></i>
                  </div>
                  <h3 className="group-title">High Command</h3>
                  <p className="group-subtitle">Supreme Leadership of East Prussia</p>
                </div>
                <div className="header-ornaments">
                  <div className="ornament left"></div>
                  <div className="ornament right"></div>
                </div>
              </div>
              <div className="rank-grid enhanced">
                {/* Colonel */}
                <div className="rank-card colonel enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-crown"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Oberst</h3>
                    <p className="rank-subtitle">Colonel</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user-tie"></i>
                        <span>Max13Gamer1</span>
                      </div>
                    </div>
                    <div className="rank-description">Supreme Commander</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>

                {/* Lieutenant Colonel */}
                <div className="rank-card lieutenant-colonel enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Oberstleutnant</h3>
                    <p className="rank-subtitle">Lieutenant Colonel</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user-tie"></i>
                        <span>KarKarlinus</span>
                      </div>
                    </div>
                    <div className="rank-description">Deputy Commander</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>

                {/* Major */}
                <div className="rank-card major enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-stars">
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-chess-rook"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Major</h3>
                    <p className="rank-subtitle">Major</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user-tie"></i>
                        <span>Mechtech101</span>
                      </div>
                    </div>
                    <div className="rank-description">Operations Commander</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* OFFICER CORPS */}
            <div className="rank-group officer-corps enhanced">
              <div className="group-header enhanced">
                <div className="header-background"></div>
                <div className="group-content">
                  <div className="group-badge">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="group-title">Officer Corps</h3>
                  <p className="group-subtitle">Commissioned Officers</p>
                </div>
                <div className="header-ornaments">
                  <div className="ornament left"></div>
                  <div className="ornament right"></div>
                </div>
              </div>
              <div className="rank-grid enhanced">
                {/* Hauptmann */}
                <div className="rank-card hauptmann enhanced vacant-position">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-bars">
                      <div className="rank-bar"></div>
                      <div className="rank-bar"></div>
                      <div className="rank-bar"></div>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-chess-knight"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Hauptmann</h3>
                    <p className="rank-subtitle">Captain</p>
                    <div className="officer-name vacant">
                      <div className="name-badge vacant">
                        <i className="fas fa-user-plus"></i>
                        <span>Position Available</span>
                      </div>
                    </div>
                    <div className="rank-description">Company Commander</div>
                  </div>
                  <div className="card-effects">
                    <div className="vacant-pulse"></div>
                  </div>
                </div>

                {/* Premierleutnant */}
                <div className="rank-card premierleutnant enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-bars">
                      <div className="rank-bar"></div>
                      <div className="rank-bar"></div>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-chess-bishop"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Premierleutnant</h3>
                    <p className="rank-subtitle">First Lieutenant</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user-tie"></i>
                        <span>jvitolas_alt</span>
                      </div>
                    </div>
                    <div className="rank-description">Senior Lieutenant</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>

                {/* Sekondeleutnant */}
                <div className="rank-card sekondeleutnant enhanced vacant-position">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-bars">
                      <div className="rank-bar"></div>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-chess-pawn"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Sekondeleutnant</h3>
                    <p className="rank-subtitle">Second Lieutenant</p>
                    <div className="officer-name vacant">
                      <div className="name-badge vacant">
                        <i className="fas fa-user-plus"></i>
                        <span>Position Available</span>
                      </div>
                    </div>
                    <div className="rank-description">Junior Officer</div>
                  </div>
                  <div className="card-effects">
                    <div className="vacant-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SENIOR NCOs */}
            <div className="rank-group senior-ncos enhanced">
              <div className="group-header enhanced">
                <div className="header-background"></div>
                <div className="group-content">
                  <div className="group-badge">
                    <i className="fas fa-medal"></i>
                  </div>
                  <h3 className="group-title">Senior NCOs</h3>
                  <p className="group-subtitle">Non-Commissioned Officers</p>
                </div>
                <div className="header-ornaments">
                  <div className="ornament left"></div>
                  <div className="ornament right"></div>
                </div>
              </div>
              <div className="rank-grid enhanced">
                {/* Feldwebel */}
                <div className="rank-card feldwebel enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-chevrons">
                      <i className="fas fa-chevron-up"></i>
                      <i className="fas fa-chevron-up"></i>
                      <i className="fas fa-chevron-up"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-medal"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Feldwebel</h3>
                    <p className="rank-subtitle">Master Sergeant</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user-shield"></i>
                        <span>IRON_WOLF321567</span>
                      </div>
                    </div>
                    <div className="rank-description">Senior NCO</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>

                {/* Junker */}
                <div className="rank-card junker enhanced vacant-position">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-diamond">
                      <i className="fas fa-diamond"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Junker</h3>
                    <p className="rank-subtitle">Senior NCO</p>
                    <div className="officer-name vacant">
                      <div className="name-badge vacant">
                        <i className="fas fa-user-plus"></i>
                        <span>Position Available</span>
                      </div>
                    </div>
                    <div className="rank-description">Senior Non-Commissioned Officer</div>
                  </div>
                  <div className="card-effects">
                    <div className="vacant-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* JUNIOR NCOs */}
            <div className="rank-group junior-ncos enhanced">
              <div className="group-header enhanced">
                <div className="header-background"></div>
                <div className="group-content">
                  <div className="group-badge">
                    <i className="fas fa-award"></i>
                  </div>
                  <h3 className="group-title">Junior NCOs</h3>
                  <p className="group-subtitle">Squad Leaders</p>
                </div>
                <div className="header-ornaments">
                  <div className="ornament left"></div>
                  <div className="ornament right"></div>
                </div>
              </div>
              <div className="rank-grid enhanced">
                {/* Sergeant */}
                <div className="rank-card sergeant enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-chevrons">
                      <i className="fas fa-chevron-up"></i>
                      <i className="fas fa-chevron-up"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-award"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Sergeant</h3>
                    <p className="rank-subtitle">Sergeant</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user"></i>
                        <span>Ole618</span>
                      </div>
                    </div>
                    <div className="rank-description">Squad Leader</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>

                {/* Korporal */}
                <div className="rank-card korporal enhanced">
                  <div className="card-background"></div>
                  <div className="rank-insignia enhanced">
                    <div className="insignia-glow"></div>
                    <div className="rank-chevrons">
                      <i className="fas fa-chevron-up"></i>
                    </div>
                    <div className="rank-eagle">
                      <i className="fas fa-certificate"></i>
                    </div>
                  </div>
                  <div className="rank-info enhanced">
                    <h3 className="rank-title">Korporal</h3>
                    <p className="rank-subtitle">Corporal</p>
                    <div className="officer-name">
                      <div className="name-badge">
                        <i className="fas fa-user"></i>
                        <span>Sith_PlaysRon61</span>
                      </div>
                    </div>
                    <div className="rank-description">Team Leader</div>
                  </div>
                  <div className="card-effects">
                    <div className="shine-effect"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className="rank-legend enhanced">
            <div className="legend-background"></div>
            <div className="legend-content">
              <div className="legend-header">
                <div className="legend-emblem">
                  <i className="fas fa-crown"></i>
                </div>
                <h4>Prussian Military Hierarchy</h4>
                <div className="legend-divider"></div>
              </div>
              <p>The Prussian military system, perfected under Frederick the Great, emphasized strict hierarchy, discipline, and merit-based promotion. This structure became the foundation for modern military organization worldwide, influencing armies from Napoleon's Grande Armée to the German General Staff system.</p>
              
              <div className="military-principles">
                <h5>Core Military Principles:</h5>
                <div className="principles-grid">
                  <div className="principle-item">
                    <i className="fas fa-graduation-cap"></i>
                    <strong>Merit-Based Promotion:</strong> Advancement through competence and battlefield performance, not birth or wealth.
                  </div>
                  <div className="principle-item">
                    <i className="fas fa-fist-raised"></i>
                    <strong>Iron Discipline:</strong> Rigorous training and absolute obedience to orders, creating reliable military units.
                  </div>
                  <div className="principle-item">
                    <i className="fas fa-chess-knight"></i>
                    <strong>Strategic Innovation:</strong> Emphasis on tactical flexibility and battlefield adaptation.
                  </div>
                  <div className="principle-item">
                    <i className="fas fa-users"></i>
                    <strong>Professional Officer Corps:</strong> Dedicated military education and career development.
                  </div>
                  <div className="principle-item">
                    <i className="fas fa-clock"></i>
                    <strong>Rapid Mobilization:</strong> Quick assembly and deployment of forces through efficient organization and logistics.
                  </div>
                  <div className="principle-item">
                    <i className="fas fa-shield-alt"></i>
                    <strong>Combined Arms Tactics:</strong> Coordinated use of infantry, cavalry, and artillery for maximum battlefield effectiveness.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About Section - Ostpreußisches Landmilizbataillon */}
      <section id="about" className="about">
        {/* Historical Background */}
        <div className="historical-background">
          <div className="historical-images">
            <div className="historical-image-item" style={{'--delay': '0s'}}>
              <img src="./about-image-1.png" alt="East Prussian Military Heritage" />
              <div className="image-overlay"></div>
            </div>
            <div className="historical-image-item" style={{'--delay': '1s'}}>
              <img src="./about-image-2.png" alt="18th Century Regiment" />
              <div className="image-overlay"></div>
            </div>
            <div className="historical-image-item" style={{'--delay': '2s'}}>
              <img src="./about-image-3.png" alt="Prussian Military Tradition" />
              <div className="image-overlay"></div>
            </div>
            <div className="historical-image-item" style={{'--delay': '3s'}}>
              <img src="./about-image-4.png" alt="East Prussian Legacy" />
              <div className="image-overlay"></div>
            </div>
          </div>
          <div className="historical-overlay"></div>
          <div className="historical-pattern"></div>
        </div>

        <div className="container">
          {/* Enhanced Header */}
          <div className="about-header">
            <div className="regimental-emblem">
              <div className="emblem-circle">
                <i className="fas fa-crown"></i>
              </div>
              <div className="emblem-wings">
                <div className="wing left"></div>
                <div className="wing right"></div>
              </div>
            </div>
            <h2 className="section-title historical">Ostpreußisches Landmilizbataillon</h2>
            <p className="section-subtitle historical">1757-1758 - Historical East Prussian Militia Battalion</p>
            <div className="historical-divider">
              <div className="divider-ornament left"></div>
              <div className="divider-center">
                <i className="fas fa-star"></i>
                <span>ANNO DOMINI</span>
                <i className="fas fa-star"></i>
              </div>
              <div className="divider-ornament right"></div>
            </div>
          </div>

          {/* Historical Context */}
          <div className="historical-context">
            <div className="context-introduction">
              <div className="intro-content">
                <h3 className="intro-title">Legacy of Ostpreußisches Landmilizbataillon</h3>
                <p className="intro-text">
                  The <strong>Ostpreußisches Landmilizbataillon</strong> was a regional militia unit formed in <strong>1757</strong> during the <strong>Seven Years' War</strong> to protect East Prussia from foreign invasion, especially during the Russian advance. It was composed of local men—farmers, townsfolk, and veterans—trained to defend their homeland. Though it was disbanded in <strong>1758</strong> to avoid capture, its creation reflected <strong>Frederick the Great's</strong> strategic use of emergency militias.
                </p>
                <div className="intro-signature">
                  <div className="signature-line"></div>
                  <span><strong>Reference:</strong> <em>Liste der Frei-Truppen und Milizen der altpreußischen Armee</em> — <a href="https://de.wikipedia.org/wiki/Liste_der_Frei-Truppen_und_Milizen_der_altpreu%C3%9Fischen_Armee" target="_blank" style={{color: '#666', textDecoration: 'underline'}}>de.wikipedia.org</a><br />(Ostpreußisches Land-Miliz-Bataillon "Katrezinsky", formed 1757, disbanded 1758 to avoid Russian capture)</span>
                  <div className="signature-line"></div>
                </div>
              </div>
            </div>

            {/* Military Heritage Gallery */}
            <div className="heritage-gallery">
              <div className="gallery-header">
                <h3>Regimental Gallery</h3>
                <p>Visual chronicles of our distinguished military heritage</p>
              </div>
              
              <div className="heritage-showcase">
                <div className="heritage-image-card">
                  <div className="image-container">
                    <img src="./about-image-1.png" alt="East Prussian Military Heritage" />
                    <div className="image-frame"></div>
                    <div className="image-caption">
                      <h4>Regimental Tradition</h4>
                      <p>The proud legacy of the Ostpreußisches Landmilizbataillon</p>
                    </div>
                  </div>
                  <div className="heritage-description">
                    <div className="heritage-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className="heritage-text">
                      <h3>Military Excellence</h3>
                      <p>
                        The Ostpreußisches Landmilizbataillon was formed in 1757 during the Seven Years' War to defend East Prussia from Russian invasion. Made up of local townsmen and veterans, it served as a regional militia under Frederick the Great's emergency reforms. Though disbanded in 1758 to avoid capture, it stood as a symbol of local duty and early Prussian militia strength.
                      </p>
                      <div className="heritage-details">
                        <span className="detail-item">
                          <i className="fas fa-flag"></i>
                          <strong>Regimental Colors:</strong> White banner with the Black Prussian Eagle, representing loyalty and homeland defense.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="heritage-image-card reverse">
                  <div className="image-container">
                    <img src="./about-image-2.png" alt="East Prussian Territory" />
                    <div className="image-frame"></div>
                    <div className="image-caption">
                      <h4>East Prussian Territory</h4>
                      <p>The heartland of Prussian military culture</p>
                    </div>
                  </div>
                  <div className="heritage-description">
                    <div className="heritage-icon">
                      <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <div className="heritage-text">
                      <h3>Frontier Legacy</h3>
                      <p>
                        Rooted in the legacy of East Prussia, our regiment draws inspiration from a province once stretching from the Baltic Sea to the Masurian Lakes. This frontier region, with Königsberg (now Kaliningrad) at its heart, stood as a buffer between powerful rivals—Russia, Poland, and Sweden. Its location made it both a defensive stronghold and a vulnerable gateway, shaping military doctrine throughout the 18th century.
                      </p>
                      <div className="heritage-details">
                        <span className="detail-item">
                          <i className="fas fa-book"></i>
                          <strong>References:</strong>
                        </span>
                        <span className="detail-item">
                          <i className="fas fa-external-link-alt"></i>
                          "East Prussia." <em>Encyclopædia Britannica</em>. <a href="https://www.britannica.com/place/East-Prussia" target="_blank" style={{color: '#666', textDecoration: 'underline'}}>britannica.com</a>
                        </span>
                        <span className="detail-item">
                          <i className="fas fa-external-link-alt"></i>
                          "Königsberg." <em>Wikipedia</em>. <a href="https://en.wikipedia.org/wiki/Königsberg" target="_blank" style={{color: '#666', textDecoration: 'underline'}}>wikipedia.org</a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="heritage-image-card">
                  <div className="image-container">
                    <img src="./about-image-3.png" alt="Cultural Heritage" />
                    <div className="image-frame"></div>
                    <div className="image-caption">
                      <h4>Cultural Heritage</h4>
                      <p>Center of learning and enlightenment</p>
                    </div>
                  </div>
                  <div className="heritage-description">
                    <div className="heritage-icon">
                      <i className="fas fa-university"></i>
                    </div>
                    <div className="heritage-text">
                      <h3>Intellectual Tradition</h3>
                      <p>
                        Our regiment honors the dual legacy of East Prussia—a region celebrated not only for its military heritage, but also for its remarkable culture of scholarship and philosophy centered in Königsberg. It was here that luminaries such as Immanuel Kant, the philosopher who shaped modern moral and epistemological thought, and E. T. A. Hoffmann, the visionary author and composer, lived and worked.
                      </p>
                      <p>
                        The University of Königsberg (Albertina), founded in 1544 as the second Protestant university in Europe, served as a hub for theological, philosophical, and scientific ideas—firmly rooted in the Protestant Reformation and Enlightenment ethos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="heritage-image-card reverse">
                  <div className="image-container">
                    <img src="./about-image-4.png" alt="Military Innovation" />
                    <div className="image-frame"></div>
                    <div className="image-caption">
                      <h4>Military Innovation</h4>
                      <p>Pioneering tactics and training methods</p>
                    </div>
                  </div>
                  <div className="heritage-description">
                    <div className="heritage-icon">
                      <i className="fas fa-sword"></i>
                    </div>
                    <div className="heritage-text">
                      <h3>Tactical Excellence</h3>
                      <p>
                        Drawing on the tactical innovations of Frederick the Great, our regiment serves as a modern laboratory for battlefield doctrine. We study and adapt Prussian drill formations, officer training methods, and battlefield tactics—especially the famed Oblique Order—applying these time-tested principles to modern military operations.
                      </p>
                      <p>
                        The Oblique Order, perfected by Frederick, involves striking the enemy's flank with overwhelming force while holding the opposing wing at bay, enabling a smaller Prussian force to defeat a larger opponent by surprise and concentration of power. Its successful use at battles like Leuthen (1757) exemplified Prussian mastery of maneuver warfare.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Timeline */}
            <div className="historical-timeline">
              <div className="timeline-header">
                <h3>Regimental Chronicle</h3>
                <p>Key moments in the history of the Ostpreußisches Landmilizbataillon</p>
              </div>
              <div className="timeline-container">
                <div className="timeline-item">
                  <div className="timeline-date">1757</div>
                  <div className="timeline-content">
                    <h4>Battalion Raised</h4>
                    <p>In response to the Russian invasion of East Prussia during the Seven Years' War, King Frederick II of Prussia ordered the formation of regional militia units. Among them was the Ostpreußisches Landmilizbataillon "Katrezinsky", composed of local men—townsfolk, farmers, and veterans—tasked with defending the province.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">1757</div>
                  <div className="timeline-content">
                    <h4>Mobilization in East Prussia</h4>
                    <p>The battalion was organized to provide internal security, protect supply lines, and support fortifications around Königsberg and other strategic locations threatened by Russian advances.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">1758</div>
                  <div className="timeline-content">
                    <h4>Battalion Disbanded</h4>
                    <p>Due to the rapid Russian occupation of much of East Prussia, the unit was officially disbanded to prevent its capture. Despite its short existence, it marked a key step in Frederick the Great's use of emergency militias to defend Prussian territory during crisis.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">Legacy</div>
                  <div className="timeline-content">
                    <h4>Influence on Later Reforms</h4>
                    <p>Though the battalion itself did not fight in major battles, it helped establish the concept of local defense forces, which later evolved into the Prussian Landwehr system during the Napoleonic Wars.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regimental Values */}
            <div className="regimental-values">
              <div className="values-header">
                <h3>Our Eternal Values</h3>
                <p>Principles rooted in the legacy of East Prussian militia and Frederick the Great's martial reforms</p>
              </div>
              <div className="values-grid">
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h4>Treue zur Heimat (Loyalty to the Homeland)</h4>
                  <p>Deep allegiance to East Prussia and the defense of its people and territory during times of war and foreign threat.</p>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-fist-raised"></i>
                  </div>
                  <h4>Gehorsam und Pflicht (Obedience and Duty)</h4>
                  <p>Strict adherence to orders and unwavering commitment to one's role in the regiment—hallmarks of Prussian discipline.</p>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h4>Tapferkeit im Kampf (Courage in Battle)</h4>
                  <p>Moral and physical bravery shown not only on the battlefield, but in enduring hardship and protecting the weak.</p>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h4>Wehrhafte Bürgerschaft (Citizen-Soldier Ethos)</h4>
                  <p>A proud tradition of local farmers, craftsmen, and townsfolk taking up arms to defend their homeland—unity of civilian and soldier.</p>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-chess-knight"></i>
                  </div>
                  <h4>Taktische Strenge (Tactical Precision)</h4>
                  <p>Embracing Frederick the Great's reforms emphasizing strategic innovation, drill mastery, and battlefield control.</p>
                </div>
                <div className="value-item">
                  <div className="value-icon">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <h4>Ehre und Kameradschaft (Honor and Comradeship)</h4>
                  <p>Upholding integrity, shared responsibility, and strong bonds among fellow soldiers in service and sacrifice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment Section */}
      <section id="games" className="recruitment">
        <div className="recruitment-background">
          <div className="recruitment-pattern"></div>
          <div className="recruitment-overlay"></div>
        </div>

        <div className="container">
          {/* Enhanced Header */}
          <div className="recruitment-header">
            <div className="recruitment-emblem">
              <i className="fas fa-user-plus"></i>
            </div>
            <h2 className="section-title recruitment-title">Join Our Ranks</h2>
            <p className="section-subtitle recruitment-subtitle">Enlist in the Ostpreußisches Landmilizbataillon</p>
            <div className="recruitment-divider">
              <div className="divider-line"></div>
              <div className="divider-emblem">
                <i className="fas fa-star"></i>
                <span>RECRUITMENT OPEN</span>
                <i className="fas fa-star"></i>
              </div>
              <div className="divider-line"></div>
            </div>
          </div>

          {/* Recruitment Process */}
          <div className="recruitment-content">
            {/* Contact Information */}
            <div className="recruitment-contact">
              <div className="contact-header">
                <h3>How to Enlist</h3>
                <p>Contact any available NCO or Officer to begin your military service</p>
              </div>
              <div className="contact-grid">
                <div className="contact-card nco">
                  <div className="contact-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <h4>Contact NCOs</h4>
                  <p>Non-Commissioned Officers available for recruitment</p>
                  <div className="contact-ranks">
                    <span className="rank-badge">Feldwebel</span>
                    <span className="rank-badge">Sergeant</span>
                    <span className="rank-badge">Korporal</span>
                  </div>
                </div>
                <div className="contact-card officer">
                  <div className="contact-icon">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <h4>Contact Officers</h4>
                  <p>Commissioned Officers ready to process your enlistment</p>
                  <div className="contact-ranks">
                    <span className="rank-badge">Major</span>
                    <span className="rank-badge">Oberstleutnant</span>
                    <span className="rank-badge">Oberst</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enlistment Process */}
            <div className="enlistment-process">
              <div className="process-header">
                <h3>Enlistment Process</h3>
                <p>Follow these steps to join the regiment</p>
              </div>
              
              <div className="process-steps">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Join Continental Army Roblox Group</h4>
                    <p><strong>New to CA?</strong> First join the Continental Army Roblox group to access the team</p>
                    <a href="https://www.roblox.com/communities/3014544/The-Continental-Army#!/about" className="group-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-roblox"></i>
                      Join Continental Army
                    </a>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Join Continental Army Discord</h4>
                    <p>Connect to the Continental Army Discord server</p>
                    <a href="https://discord.gg/xdqy3k9ceE" className="discord-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-discord"></i>
                      Continental Army Server
                    </a>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Verify with Bloxlink (CA Server)</h4>
                    <p>Complete verification process in the Continental Army Discord server</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Join Prussia Discord Server</h4>
                    <p>After CA verification, join the Kingdom of Prussia Discord</p>
                    <a href="https://discord.gg/XcDhPvgSgC" className="discord-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-discord"></i>
                      Kingdom of Prussia Server
                    </a>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Navigate to Enlistment</h4>
                    <p>In Prussia Discord, go to <strong>EP Enlistment Channel</strong> in the <strong>Ostpreußisches Landmilizbataillon Category</strong></p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">6</div>
                  <div className="step-content">
                    <h4>Complete Enlistment Form</h4>
                    <div className="enlistment-form">
                      <div className="form-preview">
                        <h5>Required Information:</h5>
                        <div className="form-fields">
                          <div className="form-field">
                            <span className="field-label">Roblox Username:</span>
                            <span className="field-example">[Your Username]</span>
                          </div>
                          <div className="form-field">
                            <span className="field-label">Timezone:</span>
                            <span className="field-example">[Your Timezone]</span>
                          </div>
                          <div className="form-field">
                            <span className="field-label">Who Recruited You:</span>
                            <span className="field-example">[NCO/Officer Name]</span>
                          </div>
                          <div className="form-field">
                            <span className="field-label">Requesting for Groups?</span>
                            <span className="field-example">Y/N</span>
                          </div>
                          <div className="form-field">
                            <span className="field-label">Are you in any CA regiments?</span>
                            <span className="field-example">Y/N</span>
                          </div>
                          <div className="form-field">
                            <span className="field-label">Activity (1-10):</span>
                            <span className="field-example">[Your Activity Level]</span>
                          </div>
                          <div className="form-field">
                            <span className="field-label">Ping Staff:</span>
                            <span className="field-example">Any Officer Online</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">7</div>
                  <div className="step-content">
                    <h4>Join Required Groups</h4>
                    <p>Join all the required Roblox groups for the regiment</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number">8</div>
                  <div className="step-content">
                    <h4>Verify with Bloxlink (Prussia Server)</h4>
                    <p>Complete final verification process in the Kingdom of Prussia Discord</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Group Links */}
            <div className="group-links">
              <div className="links-header">
                <h3>Required Groups</h3>
                <p>Join these Roblox groups to complete your enlistment</p>
              </div>
              
              <div className="links-grid">
                <div className="link-card primary">
                  <div className="link-icon">
                    <i className="fas fa-flag"></i>
                  </div>
                  <div className="link-content">
                    <h4>Continental Army</h4>
                    <p>Primary military organization - <strong>Join First</strong></p>
                    <a href="https://www.roblox.com/communities/3014544/The-Continental-Army#!/about" className="group-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-roblox"></i>
                      Join Continental Army
                    </a>
                  </div>
                </div>

                <div className="link-card">
                  <div className="link-icon">
                    <i className="fas fa-crown"></i>
                  </div>
                  <div className="link-content">
                    <h4>Kingdom of Prussia</h4>
                    <p>Main Army - Royal Prussian Forces</p>
                    <a href="https://www.roblox.com/communities/35793391/Kingdom-of-Prussi" className="group-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-roblox"></i>
                      Join Main Army
                    </a>
                  </div>
                </div>

                <div className="link-card">
                  <div className="link-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="link-content">
                    <h4>Infanteri Regiment</h4>
                    <p>Gross und Erbprinz Regiment</p>
                    <a href="https://www.roblox.com/communities/35795664/Infanteri-Regiment-Gross-und-Erbprinz#!/about" className="group-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-roblox"></i>
                      Join Regiment
                    </a>
                  </div>
                </div>

                <div className="link-card">
                  <div className="link-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="link-content">
                    <h4>Community Group</h4>
                    <p>Continental Army Community</p>
                    <a href="https://www.roblox.com/communities/5031513/ontinental-Army#!/about" className="group-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-roblox"></i>
                      Join Community
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Discord Servers */}
            <div className="discord-servers">
              <div className="discord-header">
                <h3>Discord Servers</h3>
                <p>Connect with our military community</p>
              </div>
              
              <div className="discord-grid">
                <div className="discord-card main">
                  <div className="discord-icon">
                    <i className="fab fa-discord"></i>
                  </div>
                  <div className="discord-content">
                    <h4>Continental Army</h4>
                    <p>Main recruitment and community server</p>
                    <a href="https://discord.gg/xdqy3k9ceE" className="discord-join" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-discord"></i>
                      Join Server
                    </a>
                  </div>
                </div>

                <div className="discord-card">
                  <div className="discord-icon">
                    <i className="fab fa-discord"></i>
                  </div>
                  <div className="discord-content">
                    <h4>Kingdom of Prussia</h4>
                    <p>Official Prussian military Discord</p>
                    <a href="https://discord.gg/XcDhPvgSgC" className="discord-join" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-discord"></i>
                      Join Server
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="recruitment-cta">
              <div className="cta-content">
                <h3>Ready to Serve?</h3>
                <p>Join the proud tradition of the Ostpreußisches Landmilizbataillon</p>
                <div className="cta-buttons">
                  <a href="https://discord.gg/XcDhPvgSgC" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-discord"></i>
                    Start Enlistment
                  </a>
                  <a href="https://www.roblox.com/communities/3014544/The-Continental-Army#!/about" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-roblox"></i>
                    Join Continental Army
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Military Communications Section */}
      <section id="contact" className="contact">
        <div className="contact-background">
          <div className="contact-pattern"></div>
          <div className="contact-overlay"></div>
        </div>

        <div className="container">
          {/* Enhanced Header */}
          <div className="contact-header">
            <div className="contact-emblem">
              <i className="fab fa-discord"></i>
            </div>
            <h2 className="section-title contact-title">Military Communications</h2>
            <p className="section-subtitle contact-subtitle">Connect with the Ostpreußisches Landmilizbataillon Command</p>
            <div className="contact-divider">
              <div className="divider-line"></div>
              <div className="divider-emblem">
                <i className="fas fa-radio"></i>
                <span>DISCORD ONLY</span>
                <i className="fas fa-radio"></i>
              </div>
              <div className="divider-line"></div>
            </div>
          </div>

          {/* Discord Communication */}
          <div className="discord-communication">
            <div className="communication-header">
              <h3>Official Communication Channels</h3>
              <p>All military correspondence conducted through secure Discord channels</p>
            </div>

            <div className="discord-channels">
              {/* Primary Discord Server */}
              <div className="discord-server-card primary">
                <div className="server-background"></div>
                <div className="server-header">
                  <div className="server-icon">
                    <i className="fab fa-discord"></i>
                  </div>
                  <div className="server-status">
                    <span className="status-badge active">Primary Server</span>
                    <span className="member-count">Active Community</span>
                  </div>
                </div>
                
                <div className="server-content">
                  <h3>Kingdom of Prussia</h3>
                  <p className="server-description">Official military headquarters for all East Prussian operations and communications</p>
                  
                  <div className="server-features">
                    <div className="feature-item">
                      <i className="fas fa-user-tie"></i>
                      <span>Officer Communications</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-bullhorn"></i>
                      <span>Official Announcements</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-calendar"></i>
                      <span>Event Coordination</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-question-circle"></i>
                      <span>General Inquiries</span>
                    </div>
                  </div>

                  <a href="https://discord.gg/XcDhPvgSgC" className="discord-join-btn primary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-discord"></i>
                    Join Prussia Discord
                  </a>
                </div>
              </div>

              {/* Secondary Discord Server */}
              <div className="discord-server-card secondary">
                <div className="server-background"></div>
                <div className="server-header">
                  <div className="server-icon">
                    <i className="fab fa-discord"></i>
                  </div>
                  <div className="server-status">
                    <span className="status-badge secondary">Continental Army</span>
                    <span className="member-count">Recruitment Hub</span>
                  </div>
                </div>
                
                <div className="server-content">
                  <h3>Continental Army</h3>
                  <p className="server-description">Primary recruitment and initial contact point for new members</p>
                  
                  <div className="server-features">
                    <div className="feature-item">
                      <i className="fas fa-user-plus"></i>
                      <span>Recruitment Support</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-info-circle"></i>
                      <span>Initial Information</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-handshake"></i>
                      <span>Community Welcome</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-arrow-right"></i>
                      <span>Prussia Referrals</span>
                    </div>
                  </div>

                  <a href="https://discord.gg/xdqy3k9ceE" className="discord-join-btn secondary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-discord"></i>
                    Join Continental Army
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Guidelines */}
            <div className="contact-guidelines">
              <div className="guidelines-header">
                <h3>Communication Protocol</h3>
                <p>Follow proper military etiquette when contacting command staff</p>
              </div>
              
              <div className="guidelines-grid">
                <div className="guideline-card">
                  <div className="guideline-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <h4>Contact NCOs</h4>
                  <p>For general questions, training inquiries, and day-to-day operations</p>
                  <div className="contact-ranks">
                    <span className="rank-tag">Feldwebel</span>
                    <span className="rank-tag">Sergeant</span>
                    <span className="rank-tag">Korporal</span>
                  </div>
                </div>

                <div className="guideline-card">
                  <div className="guideline-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <h4>Contact Officers</h4>
                  <p>For official matters, recruitment approval, and administrative issues</p>
                  <div className="contact-ranks">
                    <span className="rank-tag">Major</span>
                    <span className="rank-tag">Oberstleutnant</span>
                    <span className="rank-tag">Oberst</span>
                  </div>
                </div>

                <div className="guideline-card">
                  <div className="guideline-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <h4>Important Notice</h4>
                  <p>All communications must be conducted through Discord. No other contact methods are monitored.</p>
                  <div className="notice-badge">
                    <i className="fab fa-discord"></i>
                    Discord Only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-background">
          <div className="footer-pattern"></div>
          <div className="footer-overlay"></div>
        </div>
        
        <div className="container">
          <div className="footer-content">
            {/* Main Footer Content */}
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-logo">
                  <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="footer-logo-img" />
                  <div className="footer-brand-text">
                    <h3>East Prussian Regiment</h3>
                    <p>Ostpreußisches Landmilizbataillon</p>
                  </div>
                </div>
                <p className="footer-description">
                  Honoring the legacy of the East Prussian militia formed in 1757 during the Seven Years' War. 
                  Defenders of the homeland under the Black Eagle banner.
                </p>
                <div className="footer-motto">
                  <i className="fas fa-quote-left"></i>
                  <span>Für König und Vaterland</span>
                  <i className="fas fa-quote-right"></i>
                </div>
              </div>

              <div className="footer-links">
                <div className="footer-section">
                  <h4>Regiment</h4>
                  <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#ranks">Command Structure</a></li>
                    <li><a href="#about">History</a></li>
                    <li><a href="#games">Enlistment</a></li>
                  </ul>
                </div>

                <div className="footer-section">
                  <h4>Operations</h4>
                  <ul>
                    <li><a href="#contact">Communications</a></li>
                    <li><a href="https://discord.gg/XcDhPvgSgC" target="_blank" rel="noopener noreferrer">Discord Server</a></li>
                    <li><a href="https://www.roblox.com/communities/35793391/Kingdom-of-Prussi" target="_blank" rel="noopener noreferrer">Roblox Group</a></li>
                  </ul>
                </div>

                <div className="footer-section">
                  <h4>Resources</h4>
                  <ul>
                    <li><a href="https://en.wikipedia.org/wiki/East_Prussia" target="_blank" rel="noopener noreferrer">East Prussia History</a></li>
                    <li><a href="https://de.wikipedia.org/wiki/Liste_der_Frei-Truppen_und_Milizen_der_altpreu%C3%9Fischen_Armee" target="_blank" rel="noopener noreferrer">Prussian Militias</a></li>
                    <li><a href="https://www.britannica.com/place/East-Prussia" target="_blank" rel="noopener noreferrer">Britannica</a></li>
                    <li><a href="https://en.wikipedia.org/wiki/Königsberg" target="_blank" rel="noopener noreferrer">Königsberg</a></li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
              <div className="footer-divider"></div>
              <div className="footer-bottom-content">
                <div className="footer-copyright">
                  <p>&copy; 2025 East Prussian Regiment. All rights reserved.</p>
                  <p>Ostpreußisches Landmilizbataillon - Est. 1757</p>
                </div>
                <div className="footer-badges">
                  <div className="badge-item">
                    <i className="fas fa-crown"></i>
                    <span>Royal Prussian Forces</span>
                  </div>
                  <div className="badge-item">
                    <i className="fas fa-star"></i>
                    <span>Continental Army</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Staff Login Modal */}
      {isLoginModalOpen && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setIsLoginModalOpen(false)}>
          <div className="modal-content staff-login-modal">
            <div className="modal-header">
              <div className="modal-header-brand">
                <div className="modal-logo-container">
                  <div className="modal-logo-ring">
                    <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Regiment" className="modal-brand-logo" />
                  </div>
                  <div className="modal-brand-text">
                    <span className="modal-brand-title">Staff Access Portal</span>
                    <span className="modal-brand-subtitle">Ostpreußisches Landmilizbataillon Command</span>
                  </div>
                </div>
              </div>
              <span className="close" onClick={() => setIsLoginModalOpen(false)}>&times;</span>
            </div>
            
            <div className="modal-body">
              <div className="access-warning">
                <div className="warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <p><strong>Restricted Access</strong><br />
                This portal is reserved for authorized military personnel only.</p>
              </div>
              
              <div className="auth-container">
                {/* High Rank Authentication - Google Only */}
                <div className="auth-section high-rank-auth">
                  <div className="auth-header">
                    <div className="rank-badge high-rank">
                      <i className="fas fa-star"></i>
                      <span>HICOM / OFFICER / NCO</span>
                    </div>
                    <p>High Command and Officers must authenticate via Google</p>
                  </div>
                  
                  <button 
                    type="button" 
                    className="google-signin-btn primary"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="fab fa-google"></i>
                        {window.google ? 'Google Authentication' : 'Loading Google...'}
                      </>
                    )}
                  </button>
                </div>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                {/* Low Rank Authentication - Access Code */}
                <div className="auth-section low-rank-auth">
                  <div className="auth-header">
                    <div className="rank-badge low-rank">
                      <i className="fas fa-user"></i>
                      <span>LOW RANK PERSONNEL</span>
                    </div>
                    <p>Enlisted personnel access via code</p>
                  </div>
                  
                  <form className="compact-form" onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                      <input 
                        type="password" 
                        id="accessCode" 
                        name="accessCode" 
                        placeholder="Low Rank Access Code" 
                        required 
                      />
                      <i className="fas fa-key input-icon"></i>
                    </div>
                    
                    <button type="submit" className="btn access-code-btn">
                      <i className="fas fa-sign-in-alt"></i>
                      Access Dashboard
                    </button>
                  </form>
                </div>

                <div className="security-footer">
                  <i className="fas fa-shield-alt"></i>
                  <span>All access attempts are monitored</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
