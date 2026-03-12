// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Check if admin is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            window.location.href = 'login.html';
            return;
        }
        
        // Initialize admin panel
        initNavigation();
        initOverview();
        initUsers();
        initServers();
        initAnalytics();
        initSettings();
        initLogout();
    } catch (error) {
        console.error('Admin panel initialization error:', error);
    }
});

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
                'overview': 'Admin Dashboard',
                'users': 'User Management',
                'servers': 'Server Management',
                'analytics': 'Analytics',
                'settings': 'Settings'
            };
            if (pageTitle) pageTitle.textContent = titles[sectionId] || 'Admin Dashboard';
        });
    });
}

// Overview Stats
function initOverview() {
    updateStats();
    loadActivity();
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateStats();
            loadActivity();
            showNotification('Data Refreshed', 'Dashboard data has been updated.', 'success');
        });
    }
}

function updateStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const connections = JSON.parse(localStorage.getItem('activeConnections') || '[]');
    
    const totalUsersEl = document.getElementById('totalUsers');
    const activeConnectionsEl = document.getElementById('activeConnections');
    const revenueTodayEl = document.getElementById('revenueToday');
    
    if (totalUsersEl) totalUsersEl.textContent = users.length;
    if (activeConnectionsEl) activeConnectionsEl.textContent = connections.length;
    
    // Calculate revenue (simulated)
    const premiumUsers = users.filter(u => u.plan === 'Premium').length;
    const revenue = premiumUsers * 12.99;
    if (revenueTodayEl) revenueTodayEl.textContent = `$${revenue.toFixed(2)}`;
}

function loadActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = [
        { icon: 'user', title: 'New user registered', desc: 'john.doe@example.com', time: '2 minutes ago' },
        { icon: 'login', title: 'User login', desc: 'sarah.smith@example.com', time: '5 minutes ago' },
        { icon: 'upgrade', title: 'Plan upgraded', desc: 'mike.jones@example.com upgraded to Premium', time: '15 minutes ago' },
        { icon: 'server', title: 'Server maintenance', desc: 'Germany - Frankfurt server updated', time: '1 hour ago' },
        { icon: 'payment', title: 'Payment received', desc: '$12.99 from alex.wilson@example.com', time: '2 hours ago' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                ${getActivityIcon(activity.icon)}
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.desc}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>',
        upgrade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
        server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        payment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
    };
    return icons[type] || icons.user;
}

// User Management
function initUsers() {
    loadUsers();
    
    // Search and filter
    const userSearch = document.getElementById('userSearch');
    const userFilter = document.getElementById('userFilter');
    
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    
    if (userFilter) {
        userFilter.addEventListener('change', filterUsers);
    }
    
    // Add user button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showModal('Add User', `
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="newUserName" placeholder="Enter name">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="newUserEmail" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label>Plan</label>
                    <select id="newUserPlan">
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div>
            `, () => {
                const name = document.getElementById('newUserName').value;
                const email = document.getElementById('newUserEmail').value;
                const plan = document.getElementById('newUserPlan').value;
                
                if (name && email) {
                    addUser({ name, email, plan, status: 'active', joined: new Date().toISOString() });
                    closeModal();
                    loadUsers();
                    showNotification('Success', 'User added successfully!', 'success');
                }
            });
        });
    }
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.getElementById('usersTableBody');
    
    if (!tbody) return;
    
    if (users.length === 0) {
        // Add sample users
        const sampleUsers = [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com', plan: 'Premium', status: 'active', joined: '2024-01-15' },
            { id: 2, name: 'Sarah Smith', email: 'sarah.smith@example.com', plan: 'Free', status: 'active', joined: '2024-01-20' },
            { id: 3, name: 'Mike Jones', email: 'mike.jones@example.com', plan: 'Premium', status: 'inactive', joined: '2024-02-01' },
            { id: 4, name: 'Emily Wilson', email: 'emily.wilson@example.com', plan: 'Free', status: 'active', joined: '2024-02-10' }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
        loadUsers();
        return;
    }
    
    renderUsers(users);
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-cell">
                    <div class="user-avatar-small">${user.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="user-name-cell">${user.name}</div>
                    </div>
                </div>
            </td>
            <td class="user-email-cell">${user.email}</td>
            <td><span class="plan-badge ${user.plan.toLowerCase()}">${user.plan}</span></td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>${new Date(user.joined).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editUser(${user.id})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteUser(${user.id})" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const filterValue = document.getElementById('userFilter').value;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (searchTerm) {
        users = users.filter(u => 
            u.name.toLowerCase().includes(searchTerm) || 
            u.email.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterValue !== 'all') {
        if (filterValue === 'active' || filterValue === 'inactive') {
            users = users.filter(u => u.status === filterValue);
        } else {
            users = users.filter(u => u.plan.toLowerCase() === filterValue);
        }
    }
    
    renderUsers(users);
}

function addUser(user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    user.id = Date.now();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

function editUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (!user) return;
    
    showModal('Edit User', `
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="editUserName" value="${user.name}">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" id="editUserEmail" value="${user.email}">
        </div>
        <div class="form-group">
            <label>Plan</label>
            <select id="editUserPlan">
                <option value="Free" ${user.plan === 'Free' ? 'selected' : ''}>Free</option>
                <option value="Premium" ${user.plan === 'Premium' ? 'selected' : ''}>Premium</option>
            </select>
        </div>
        <div class="form-group">
            <label>Status</label>
            <select id="editUserStatus">
                <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
            </select>
        </div>
    `, () => {
        user.name = document.getElementById('editUserName').value;
        user.email = document.getElementById('editUserEmail').value;
        user.plan = document.getElementById('editUserPlan').value;
        user.status = document.getElementById('editUserStatus').value;
        
        localStorage.setItem('users', JSON.stringify(users));
        closeModal();
        loadUsers();
        showNotification('Success', 'User updated successfully!', 'success');
    });
}

function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    
    loadUsers();
    showNotification('Success', 'User deleted successfully!', 'success');
}

// Server Management
function initServers() {
    loadServers();
    
    const addServerBtn = document.getElementById('addServerBtn');
    if (addServerBtn) {
        addServerBtn.addEventListener('click', () => {
            showNotification('Coming Soon', 'Server management features will be available soon.', 'info');
        });
    }
}

function loadServers() {
    const grid = document.getElementById('serversAdminGrid');
    if (!grid) return;
    
    const servers = [
        { name: 'US-East-1', location: 'New York, USA', status: 'online', load: 45, users: 1234, bandwidth: '1.2 Gbps' },
        { name: 'US-West-1', location: 'Los Angeles, USA', status: 'online', load: 62, users: 987, bandwidth: '980 Mbps' },
        { name: 'EU-West-1', location: 'London, UK', status: 'online', load: 38, users: 2156, bandwidth: '2.1 Gbps' },
        { name: 'EU-Central-1', location: 'Frankfurt, DE', status: 'maintenance', load: 0, users: 0, bandwidth: '0 Mbps' },
        { name: 'AP-South-1', location: 'Singapore', status: 'online', load: 55, users: 1876, bandwidth: '1.8 Gbps' },
        { name: 'AP-Northeast-1', location: 'Tokyo, JP', status: 'online', load: 42, users: 1543, bandwidth: '1.5 Gbps' }
    ];
    
    grid.innerHTML = servers.map(server => `
        <div class="server-admin-card">
            <div class="server-admin-header">
                <div class="server-admin-info">
                    <h4>${server.name}</h4>
                    <div class="server-admin-location">${server.location}</div>
                </div>
                <div class="server-status ${server.status}"></div>
            </div>
            <div class="server-metrics">
                <div class="server-metric">
                    <span class="metric-label">Load</span>
                    <span class="metric-value">${server.load}%</span>
                </div>
                <div class="server-metric">
                    <span class="metric-label">Users</span>
                    <span class="metric-value">${server.users.toLocaleString()}</span>
                </div>
                <div class="server-metric">
                    <span class="metric-label">Bandwidth</span>
                    <span class="metric-value">${server.bandwidth}</span>
                </div>
                <div class="server-metric">
                    <span class="metric-label">Status</span>
                    <span class="metric-value">${server.status}</span>
                </div>
            </div>
            <div class="server-actions">
                <button class="btn btn-secondary">Restart</button>
                <button class="btn btn-primary">Configure</button>
            </div>
        </div>
    `).join('');
}

// Analytics
function initAnalytics() {
    loadRegionStats();
    loadPlanDistribution();
}

function loadRegionStats() {
    const container = document.getElementById('regionStats');
    if (!container) return;
    
    const regions = [
        { name: 'North America', flag: '🌎', users: 5420, percentage: 40 },
        { name: 'Europe', flag: '🌍', users: 3890, percentage: 30 },
        { name: 'Asia Pacific', flag: '🌏', users: 2710, percentage: 20 },
        { name: 'Others', flag: '🌐', users: 1350, percentage: 10 }
    ];
    
    container.innerHTML = regions.map(region => `
        <div class="region-stat">
            <span class="region-flag">${region.flag}</span>
            <div class="region-info">
                <div class="region-name">${region.name}</div>
                <div class="region-users">${region.users.toLocaleString()} users</div>
                <div class="region-bar">
                    <div class="region-bar-fill" style="width: ${region.percentage}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadPlanDistribution() {
    const container = document.getElementById('planDistribution');
    if (!container) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const premium = users.filter(u => u.plan === 'Premium').length;
    const free = users.filter(u => u.plan === 'Free').length;
    
    container.innerHTML = `
        <div class="plan-stat">
            <div class="plan-stat-info">
                <div class="plan-stat-dot premium"></div>
                <span>Premium</span>
            </div>
            <span class="plan-stat-count">${premium}</span>
        </div>
        <div class="plan-stat">
            <div class="plan-stat-info">
                <div class="plan-stat-dot free"></div>
                <span>Free</span>
            </div>
            <span class="plan-stat-count">${free}</span>
        </div>
    `;
}

// Settings
function initSettings() {
    const saveEmailBtn = document.getElementById('saveEmailSettings');
    if (saveEmailBtn) {
        saveEmailBtn.addEventListener('click', () => {
            showNotification('Success', 'Email settings saved!', 'success');
        });
    }
}

// Modal Functions
function showModal(title, content, onConfirm) {
    // Remove existing modal
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" id="modalConfirm">Save</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Confirm button
    const confirmBtn = document.getElementById('modalConfirm');
    if (confirmBtn && onConfirm) {
        confirmBtn.addEventListener('click', onConfirm);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            showNotification('Logged Out', 'You have been successfully logged out.', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

// Notification fallback
if (typeof showNotification !== 'function') {
    function showNotification(title, message, type = 'info') {
        alert(title + ': ' + message);
    }
}

console.log('Admin panel loaded successfully!');
