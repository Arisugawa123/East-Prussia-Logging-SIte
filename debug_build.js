// Simple test to see if React is loading
console.log('DEBUG: Script is loading...');

// Check if React elements exist
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEBUG: DOM loaded');
    console.log('DEBUG: Root element exists:', !!document.getElementById('root'));
    
    // Add visible content to test
    const root = document.getElementById('root');
    if (root && !root.innerHTML.trim()) {
        root.innerHTML = `
            <div style="padding: 20px; background: #f0f0f0; color: #333; font-family: Arial;">
                <h1>🎖️ East Prussia Regiment - Loading Test</h1>
                <p>If you see this, the basic HTML is working!</p>
                <p>React should load below this message...</p>
                <div id="react-status" style="margin-top: 20px; padding: 10px; background: #fff; border: 1px solid #ccc;">
                    Waiting for React to load...
                </div>
            </div>
        `;
        
        // Check if React loads after 3 seconds
        setTimeout(() => {
            const status = document.getElementById('react-status');
            if (status && status.textContent.includes('Waiting')) {
                status.innerHTML = '<strong style="color: red;">❌ React failed to load - checking console for errors</strong>';
            }
        }, 3000);
    }
});