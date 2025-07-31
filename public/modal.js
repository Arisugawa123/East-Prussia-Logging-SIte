// Staff Login Modal Functions
let isLoginModalOpen = false;

function openLoginModal() {
    isLoginModalOpen = true;
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal" onclick="closeModalOnBackdrop(event)">
            <div class="modal-content staff-login-modal">
                <div class="modal-header">
                    <div class="modal-emblem">
                        <img src="./Civil_flag_of_Prussia_1701-1935.svg" alt="East Prussian Flag" class="modal-logo" />
                    </div>
                    <h2>Staff Access Portal</h2>
                    <p class="modal-subtitle">Ostpreußisches Landmilizbataillon Command</p>
                    <span class="close" onclick="closeLoginModal()">&times;</span>
                </div>
                
                <div class="modal-body">
                    <div class="access-warning">
                        <div class="warning-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p><strong>Restricted Access</strong><br />
                        This portal is reserved for authorized military personnel only.</p>
                    </div>
                    
                    <form class="staff-login-form" onsubmit="handleLoginSubmit(event)">
                        <div class="form-group">
                            <label for="accessCode">
                                <i class="fas fa-key"></i>
                                Military Access Code:
                            </label>
                            <div class="input-container">
                                <input type="password" id="accessCode" name="accessCode" placeholder="Enter your access code" required />
                            </div>
                        </div>
                        
                        <div class="security-notice">
                            <i class="fas fa-shield-alt"></i>
                            <span>All access attempts are logged and monitored</span>
                        </div>
                        
                        <button type="submit" class="btn staff-login-btn">
                            <i class="fas fa-sign-in-alt"></i>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `);
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
    isLoginModalOpen = false;
    document.body.style.overflow = 'auto';
}

function closeModalOnBackdrop(event) {
    if (event.target.className === 'modal') {
        closeLoginModal();
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const accessCode = event.target.accessCode.value;
    
    if (!accessCode) {
        alert('Please enter your access code');
        return;
    }
    
    // Valid access codes
    const validCodes = ['PRUSSIA2024', 'EASTPRUSSIA', 'FREDERICK', 'KONIGSBERG'];
    
    if (validCodes.includes(accessCode.toUpperCase())) {
        closeLoginModal();
        alert('Login successful! Welcome to the command center.');
    } else {
        alert('Invalid access code. Please try again.');
    }
    
    event.target.reset();
}

// Initialize modal functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }
});