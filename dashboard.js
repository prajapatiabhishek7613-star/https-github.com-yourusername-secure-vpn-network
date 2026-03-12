// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        // Initialize dashboard
        initUserInfo(currentUser);
        initNavigation();
        initConnection();
        initServers();
        initSettings();
        initLogout();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
    }
});

// User Info
function initUserInfo(user) {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userPlan = document.getElementById('userPlan');
    
    if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
    if (userName) userName.textContent = user.name;
    if (userPlan) userPlan.textContent = user.plan || 'Free Plan';
}

// Navigation
function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
    const sections = document.querySelectorAll('.dashboard-section');
    const pageTitle = document.getElementById('pageTitle');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // Update page title
            const titles = {
                'overview': 'Dashboard',
                'connection': 'Connection',
                'servers': 'Servers',
                'settings': 'Settings',
                'billing': 'Billing'
            };
            if (pageTitle) pageTitle.textContent = titles[sectionId] || 'Dashboard';
        });
    });
}

// Connection Management
let isConnected = false;
let connectionTimer = null;
let connectionSeconds = 0;

function initConnection() {
    const connectionCircle = document.getElementById('connectionCircle');
    const connectionText = document.getElementById('connectionText');
    const connectionStatus = document.getElementById('connectionStatus');
    const quickConnectBtn = document.getElementById('quickConnectBtn');
    const ipAddress = document.getElementById('ipAddress');
    
    // Load saved connection state
    const savedState = localStorage.getItem('vpnConnection');
    if (savedState) {
        const state = JSON.parse(savedState);
        isConnected = state.isConnected;
        connectionSeconds = state.connectionSeconds || 0;
        
        if (isConnected) {
            updateConnectionUI(true);
            startTimer();
        }
    }
    
    // Toggle connection
    function toggleConnection() {
        isConnected = !isConnected;
        
        if (isConnected) {
            // Connect
            connectionText.textContent = 'Connecting...';
            
            setTimeout(() => {
                updateConnectionUI(true);
                startTimer();
                saveConnectionState();
                
                // Update IP address (simulated)
                const randomIP = generateRandomIP();
                if (ipAddress) ipAddress.textContent = randomIP;
                
                // Add to history
                addConnectionHistory('United States - New York');
            }, 1500);
        } else {
            // Disconnect
            updateConnectionUI(false);
            stopTimer();
            saveConnectionState();
            
            if (ipAddress) ipAddress.textContent = '--.--.--.--';
        }
    }
    
    if (connectionCircle) {
        connectionCircle.addEventListener('click', toggleConnection);
    }
    
    if (quickConnectBtn) {
        quickConnectBtn.addEventListener('click', toggleConnection);
    }
}

function updateConnectionUI(connected) {
    const connectionCircle = document.getElementById('connectionCircle');
    const connectionText = document.getElementById('connectionText');
    const connectionStatus = document.getElementById('connectionStatus');
    
    if (connected) {
        connectionCircle.classList.add('connected');
        connectionText.textContent = 'Connected';
        if (connectionStatus) connectionStatus.textContent = 'Connected';
    } else {
        connectionCircle.classList.remove('connected');
        connectionText.textContent = 'Tap to Connect';
        if (connectionStatus) connectionStatus.textContent = 'Disconnected';
    }
}

function startTimer() {
    connectionTimer = setInterval(() => {
        connectionSeconds++;
        updateTimeDisplay();
        saveConnectionState();
    }, 1000);
}

function stopTimer() {
    if (connectionTimer) {
        clearInterval(connectionTimer);
        connectionTimer = null;
    }
}

function updateTimeDisplay() {
    const timeConnected = document.getElementById('timeConnected');
    if (timeConnected) {
        const hours = Math.floor(connectionSeconds / 3600);
        const minutes = Math.floor((connectionSeconds % 3600) / 60);
        const seconds = connectionSeconds % 60;
        timeConnected.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function saveConnectionState() {
    localStorage.setItem('vpnConnection', JSON.stringify({
        isConnected,
        connectionSeconds
    }));
}

function generateRandomIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function addConnectionHistory(serverName) {
    const history = JSON.parse(localStorage.getItem('connectionHistory') || '[]');
    history.unshift({
        server: serverName,
        time: new Date().toISOString(),
        duration: 'Just now'
    });
    
    // Keep only last 10
    if (history.length > 10) history.pop();
    
    localStorage.setItem('connectionHistory', JSON.stringify(history));
}

// Servers
const servers = [
    { id: 1, name: 'United States - New York', flag: '🇺🇸', region: 'americas', load: 45, ping: 25 },
    { id: 2, name: 'United States - Los Angeles', flag: '🇺🇸', region: 'americas', load: 62, ping: 35 },
    { id: 3, name: 'United Kingdom - London', flag: '🇬🇧', region: 'europe', load: 38, ping: 45 },
    { id: 4, name: 'Germany - Frankfurt', flag: '🇩🇪', region: 'europe', load: 52, ping: 40 },
    { id: 5, name: 'France - Paris', flag: '🇫🇷', region: 'europe', load: 41, ping: 42 },
    { id: 6, name: 'Japan - Tokyo', flag: '🇯🇵', region: 'asia', load: 28, ping: 120 },
    { id: 7, name: 'Singapore', flag: '🇸🇬', region: 'asia', load: 35, ping: 95 },
    { id: 8, name: 'Australia - Sydney', flag: '🇦🇺', region: 'asia', load: 48, ping: 150 },
    { id: 9, name: 'Canada - Toronto', flag: '🇨🇦', region: 'americas', load: 33, ping: 30 },
    { id: 10, name: 'Netherlands - Amsterdam', flag: '🇳🇱', region: 'europe', load: 55, ping: 38 },
    { id: 11, name: 'Brazil - Sao Paulo', flag: '🇧🇷', region: 'americas', load: 42, ping: 80 },
    { id: 12, name: 'India - Mumbai', flag: '🇮🇳', region: 'asia', load: 58, ping: 110 }
];

function initServers() {
    const serversGrid = document.getElementById('serversGrid');
    const serverSearch = document.getElementById('serverSearch');
    const serverFilter = document.getElementById('serverFilter');
    
    if (!serversGrid) return;
    
    function renderServers(filteredServers) {
        serversGrid.innerHTML = filteredServers.map(server => `
            <div class="server-card" data-server-id="${server.id}">
                <div class="server-header">
                    <span class="server-flag">${server.flag}</span>
                    <span class="server-name">${server.name}</span>
                </div>
                <div class="server-info">
                    <span class="server-load">Load: ${server.load}%</span>
                    <span class="server-ping">${server.ping}ms</span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.server-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.server-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                const serverId = card.dataset.serverId;
                const server = servers.find(s => s.id == serverId);
                
                // Update current server display
                const currentServer = document.getElementById('currentServer');
                if (currentServer && server) {
                    currentServer.innerHTML = `
                        <span class="server-flag">${server.flag}</span>
                        <span class="server-name">${server.name}</span>
                    `;
                }
                
                showNotification('Server Selected', `Connected to ${server.name}`, 'success');
            });
        });
    }
    
    function filterServers() {
        const searchTerm = serverSearch ? serverSearch.value.toLowerCase() : '';
        const regionFilter = serverFilter ? serverFilter.value : 'all';
        
        let filtered = servers;
        
        if (searchTerm) {
            filtered = filtered.filter(s => s.name.toLowerCase().includes(searchTerm));
        }
        
        if (regionFilter !== 'all') {
            filtered = filtered.filter(s => s.region === regionFilter);
        }
        
        renderServers(filtered);
    }
    
    if (serverSearch) {
        serverSearch.addEventListener('input', filterServers);
    }
    
    if (serverFilter) {
        serverFilter.addEventListener('change', filterServers);
    }
    
    // Initial render
    renderServers(servers);
}

// Settings
function initSettings() {
    const settings = {
        autoConnect: document.getElementById('autoConnect'),
        killSwitch: document.getElementById('killSwitch'),
        splitTunneling: document.getElementById('splitTunneling'),
        protocol: document.querySelectorAll('input[name="protocol"]')
    };
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('vpnSettings') || '{}');
    
    if (settings.autoConnect) settings.autoConnect.checked = savedSettings.autoConnect || false;
    if (settings.killSwitch) settings.killSwitch.checked = savedSettings.killSwitch !== false;
    if (settings.splitTunneling) settings.splitTunneling.checked = savedSettings.splitTunneling || false;
    
    if (savedSettings.protocol) {
        const protocolInput = document.querySelector(`input[name="protocol"][value="${savedSettings.protocol}"]`);
        if (protocolInput) protocolInput.checked = true;
    }
    
    // Save settings on change
    function saveSettings() {
        const protocolInput = document.querySelector('input[name="protocol"]:checked');
        
        const newSettings = {
            autoConnect: settings.autoConnect ? settings.autoConnect.checked : false,
            killSwitch: settings.killSwitch ? settings.killSwitch.checked : true,
            splitTunneling: settings.splitTunneling ? settings.splitTunneling.checked : false,
            protocol: protocolInput ? protocolInput.value : 'wireguard'
        };
        
        localStorage.setItem('vpnSettings', JSON.stringify(newSettings));
    }
    
    Object.values(settings).forEach(element => {
        if (element instanceof NodeList) {
            element.forEach(el => el.addEventListener('change', saveSettings));
        } else if (element) {
            element.addEventListener('change', saveSettings);
        }
    });
}

// Logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('vpnConnection');
            
            showNotification('Logged Out', 'You have been successfully logged out.', 'info');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

// Notification function (if not already defined)
if (typeof showNotification !== 'function') {
    function showNotification(title, message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 24px;
                background: var(--bg-card);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-left: 4px solid var(--primary);
                border-radius: 12px;
                padding: 20px 24px;
                display: flex;
                align-items: flex-start;
                gap: 16px;
                max-width: 400px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-content h4 {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 4px;
            }
            
            .notification-content p {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Simulate data usage update
setInterval(() => {
    if (isConnected) {
        const dataUsed = document.getElementById('dataUsed');
        if (dataUsed) {
            const currentData = parseFloat(dataUsed.textContent) || 0;
            const newData = currentData + 0.001;
            dataUsed.textContent = newData.toFixed(3) + ' GB';
        }
        
        // Update download speed randomly
        const downloadSpeed = document.getElementById('downloadSpeed');
        if (downloadSpeed) {
            const speed = Math.floor(Math.random() * 50) + 20;
            downloadSpeed.textContent = speed + ' Mbps';
        }
    }
}, 5000);

console.log('Dashboard loaded successfully!');
