import "./style.css";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = configuredApiBaseUrl
  ? /^https?:\/\//i.test(configuredApiBaseUrl)
    ? configuredApiBaseUrl
    : `https://${configuredApiBaseUrl}`
  : "http://127.0.0.1:8000";

const icon = (name, size = 20) => {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75"/>',
    settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    down: '<path d="m7 10 5 5 5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrowUp: '<path d="m7 14 5-5 5 5"/>',
    arrowRight: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    arrowDownRight: '<path d="m7 7 10 10M17 7v10H7"/>',
    arrowUpRight: '<path d="M7 17 17 7M7 7h10v10"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/>',
    laptop: '<rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    filter: '<path d="M4 7h16M7 12h10m-7 5h4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    pulse: '<path d="M2 12h4l3-9 6 18 3-9h4"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    sparkles: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14Z"/>',
    moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ""}</svg>`;
};

const sessions = [
  { initials: "AK", name: "Alex Kim", email: "alex.kim@northstar.io", device: "MacBook Pro · Chrome", location: "San Francisco, US", ip: "192.168.1.42", score: 12, status: "Allowed", time: "2 min ago", color: "lavender" },
  { initials: "JM", name: "Jordan Miller", email: "j.miller@northstar.io", device: "iPhone 15 · Safari", location: "London, UK", ip: "81.2.69.142", score: 28, status: "Allowed", time: "8 min ago", color: "peach" },
  { initials: "SP", name: "Sam Patel", email: "sam.patel@northstar.io", device: "Windows 11 · Edge", location: "Singapore, SG", ip: "103.28.54.12", score: 76, status: "Step-up auth", time: "14 min ago", color: "mint" },
  { initials: "RC", name: "Riley Chen", email: "riley.chen@northstar.io", device: "MacBook Air · Chrome", location: "Toronto, CA", ip: "142.112.24.8", score: 91, status: "Blocked", time: "21 min ago", color: "blue" },
  { initials: "DW", name: "Devon Wright", email: "devon.w@northstar.io", device: "Pixel 9 · Chrome", location: "Austin, US", ip: "172.16.0.8", score: 34, status: "Monitoring", time: "36 min ago", color: "yellow" },
];

const threats = [
  { type: "Impossible travel", detail: "London → Singapore in 18 min", time: "14 min ago", level: "Critical", initials: "SP", color: "peach" },
  { type: "Unrecognized device", detail: "First seen · Windows 11 / Edge", time: "21 min ago", level: "High", initials: "RC", color: "blue" },
  { type: "Suspicious login pattern", detail: "7 failed attempts · New York, US", time: "48 min ago", level: "Medium", initials: "MT", color: "lavender" },
];

const navigation = [
  { label: "Overview", icon: "grid" },
  { label: "Live sessions", icon: "activity", count: "24" },
  { label: "Threat intelligence", icon: "shield", count: "8", section: true },
  { label: "Identities", icon: "users" },
  { label: "Settings", icon: "settings", section: true },
];

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="auth-screen" id="auth-screen">
    <section class="auth-visual">
      <a class="brand auth-brand" href="#" aria-label="AuthPulse AI home">
        <span class="brand-mark">${icon("pulse", 23)}</span>
        <span class="brand-copy"><strong>AuthPulse<span>AI</span></strong><small>IDENTITY SECURITY</small></span>
      </a>
      <div class="auth-hero">
        <span class="auth-kicker"><i></i> IDENTITY THREAT DETECTION &amp; RESPONSE</span>
        <h1>Every identity.<br />Always <span>in focus.</span></h1>
        <p>One intelligent layer to detect risk, protect your people, and keep every session secure.</p>
        <div class="auth-visual-card">
          <div class="auth-visual-top"><span>${icon("shield", 18)} Perimeter protection</span><span class="auth-live"><i></i> ACTIVE</span></div>
          <div class="auth-visual-score"><div><span>Identity risk score</span><strong>24<span>/100</span></strong></div><div class="auth-score-ring"><span>LOW</span></div></div>
          <div class="auth-visual-meter"><i></i></div>
          <div class="auth-visual-footer"><span>${icon("lock", 14)} AI-powered threat monitoring</span><span>All systems secure</span></div>
        </div>
      </div>
      <div class="auth-visual-footerline"><span>BUILT FOR THE MODERN SECURITY TEAM</span><span>v1.0</span></div>
    </section>
    <section class="auth-form-side">
      <div class="auth-form-card">
        <span class="auth-form-kicker" id="auth-kicker">WELCOME BACK</span>
        <h2 id="auth-title">Sign in to AuthPulse</h2>
        <p class="auth-subtitle" id="auth-subtitle">Your identity security overview is waiting.</p>
        <form id="auth-form">
          <label class="auth-field" id="auth-username-field" hidden>Name<input name="username" type="text" autocomplete="name" minlength="2" maxlength="80" placeholder="How should we call you?" /></label>
          <label class="auth-field">Work email<input name="email" type="email" autocomplete="email" required placeholder="you@company.com" /></label>
          <label class="auth-field">Password<input name="password" type="password" autocomplete="current-password" required placeholder="Enter your password" /></label>
          <div class="auth-error" id="auth-error" role="alert"></div>
          <button type="submit" class="button button-primary auth-submit" id="auth-submit">Sign in ${icon("arrowRight", 16)}</button>
        </form>
        <p class="auth-switch-copy"><span id="auth-switch-prompt">New to AuthPulse?</span><button type="button" id="auth-switch">Create an account</button></p>
        <p class="auth-privacy">${icon("lock", 13)} Secure, encrypted authentication</p>
      </div>
      <div class="auth-mobile-brand"><span class="brand-mark">${icon("pulse", 18)}</span><strong>AuthPulse<span>AI</span></strong></div>
    </section>
  </div>
  <div class="app-shell" id="app-shell" data-theme="light" hidden>
    <aside class="sidebar" id="sidebar">
      <a class="brand" href="#" aria-label="AuthPulse AI home">
        <span class="brand-mark">${icon("pulse", 23)}</span>
        <span class="brand-copy"><strong>AuthPulse<span>AI</span></strong><small>IDENTITY SECURITY</small></span>
      </a>
      <div class="workspace-switcher">
        <div class="workspace-avatar">N</div>
        <span class="workspace-copy"><strong>Northstar Labs</strong><small>Enterprise plan</small></span>
        ${icon("down", 16)}
      </div>
      <div class="nav-caption">WORKSPACE</div>
      <nav class="main-nav" aria-label="Main navigation">
        ${navigation.map((item, index) => `
          <button class="nav-link ${index === 0 ? "active" : ""} ${item.section ? "nav-section" : ""}" data-view="${item.label}" title="${item.label}">
            ${icon(item.icon, 19)}<span>${item.label}</span>${item.count ? `<small>${item.count}</small>` : ""}
          </button>`).join("")}
      </nav>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-status">
        <div class="status-heading"><span class="status-dot" id="api-dot"></span><strong id="api-label">Checking connection</strong></div>
        <p id="api-description">Connecting to your AuthPulse API…</p>
        <button class="text-action" id="api-retry">Connection details ${icon("arrowRight", 14)}</button>
      </div>
      <div class="user-profile">
        <div class="profile-avatar" id="profile-avatar">JD</div>
        <div class="profile-copy"><strong id="profile-name">Security admin</strong><small id="profile-email">Signed in</small></div>
        <button class="icon-button profile-menu" id="profile-menu" aria-label="Sign out" title="Sign out">${icon("more", 19)}</button>
      </div>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <button class="icon-button mobile-menu" id="menu-button" aria-label="Open navigation">${icon("grid")}</button>
        <div class="breadcrumb"><span>Workspace</span>${icon("chevron", 14)}<strong id="breadcrumb-current">Overview</strong></div>
        <nav class="dashboard-tabs" aria-label="Security operations">
          <button class="dashboard-tab active" data-view="Overview">${icon("activity", 14)} Security Monitoring</button>
          <button class="dashboard-tab" data-view="Threat intelligence">${icon("shield", 14)} Threat Analysis</button>
          <button class="dashboard-tab" data-view="Live sessions">${icon("laptop", 14)} Incident Reports</button>
        </nav>
        <div class="topbar-actions">
          <div class="search-wrap">${icon("search", 18)}<input id="global-search" type="search" placeholder="Search anything..." aria-label="Search sessions"><kbd>⌘ K</kbd></div>
          <span class="topbar-divider"></span>
          <button class="icon-button theme-toggle" id="theme-toggle" aria-label="Switch to dark mode" title="Switch to dark mode">${icon("moon", 18)}</button>
          <button class="icon-button notification-button" id="notification-button" aria-label="Notifications">${icon("bell", 19)}<i></i></button>
          <button class="topbar-avatar" id="topbar-avatar" aria-label="Sign out" title="Sign out">JD</button>
        </div>
      </header>

      <div class="content" id="content">
        <section class="page-heading">
          <div><div class="eyebrow"><span class="eyebrow-dot"></span> SECURITY OPERATIONS CENTER <span class="demo-badge">LIVE MONITORING</span></div>
            <h1 id="dashboard-greeting">Security Operations Center</h1>
            <p>Monitor threats, authentication activity, and perimeter health in one place.</p></div>
          <div class="heading-actions"><div class="last-updated">${icon("clock", 15)} Updated just now</div>
            <button class="button button-primary" id="new-session-button">${icon("plus", 17)} Create test session</button></div>
        </section>

        <section class="soc-overview-grid">
          <div class="soc-main-column">
            <section class="metrics-grid soc-metrics-grid" aria-label="Security monitoring">
              <article class="metric-card soc-metric threat-detection-card"><div class="metric-top"><span>Threat Detection</span><span class="metric-more">···</span></div><div class="metric-value">2,847</div><div class="metric-foot">Threat signals monitored today</div><div class="incident-sparkline"><svg viewBox="0 0 180 60" preserveAspectRatio="none" role="img" aria-label="Threat detection trend"><defs><linearGradient id="spark-red-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f45c62" stop-opacity=".55"/><stop offset="100%" stop-color="#f45c62" stop-opacity=".02"/></linearGradient></defs><path class="spark-area" d="M0 50 18 42 36 45 53 28 72 35 90 18 108 27 126 12 144 20 162 7 180 13V60H0Z"/><path class="spark-line" d="M0 50 18 42 36 45 53 28 72 35 90 18 108 27 126 12 144 20 162 7 180 13"/></svg></div></article>
              <article class="metric-card soc-metric events-card"><div class="metric-top"><span>Security Events</span><button class="metric-more metric-more-button" id="period-select" type="button" aria-label="Activity period" title="Activity period">···</button></div><div class="metric-value">15,342</div><div class="metric-foot">Events processed across your network</div><div class="event-heatmap" aria-label="Recent event activity">${Array.from({ length: 24 }, (_, index) => `<i class="heat-${index % 5}"></i>`).join("")}</div></article>
              <article class="metric-card soc-metric health-card"><div class="metric-top"><span>System Health</span><span class="metric-more">···</span></div><div class="metric-value health-value">98.7<span>%</span></div><div class="metric-foot">All services operating normally</div><div class="health-bars" aria-hidden="true">${[48, 65, 53, 78, 60, 84].map((height) => `<i style="--bar-height:${height}%"></i>`).join("")}</div><div class="health-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div></article>
            </section>
            <article class="panel security-score-panel">
              <div class="score-main"><div class="score-title"><span>Security Score</span><span class="score-trophy">${icon("shield", 15)}</span></div><strong>847<span> / 1000</span></strong><div class="score-meter"><i></i></div><small>Strong security posture</small></div>
              <div class="score-recommendation"><p>Our AI found 3 actions to improve your security score.</p><button class="button button-primary" id="improve-score-button">Improve Security Score ${icon("arrowRight", 14)}</button></div>
            </article>
          </div>
          <article class="panel threat-panel">
            <div class="panel-header"><div><h2>Recent Security Incidents</h2><p>Latest events across your perimeter</p></div><button class="icon-button panel-more" aria-label="More incident options">${icon("more")}</button></div>
            <div class="threat-list">${threats.map((threat) => `<div class="threat-item"><div class="person-avatar ${threat.color}">${threat.initials}</div><div class="threat-copy"><div class="threat-title"><strong>${threat.type}</strong><span class="severity ${threat.level.toLowerCase()}">${threat.level}</span></div><p>${threat.detail}</p><small>${threat.time}</small></div></div>`).join("")}</div>
            <button class="panel-link" data-view="Threat intelligence">View all incidents ${icon("arrowRight", 15)}</button>
          </article>
        </section>

        <section class="soc-lower-grid">
          <article class="panel security-tools-panel">
            <div class="panel-header"><div><h2>Security Tools</h2><p>Connected protection across your stack</p></div><button class="icon-button panel-more" aria-label="More security tools">${icon("more")}</button></div>
            <div class="security-tools-grid">
              <div class="security-tool"><span class="tool-icon tool-blue">${icon("shield", 16)}</span><strong>SIEM</strong><small>Security information</small><em>● Active</em></div>
              <div class="security-tool"><span class="tool-icon tool-orange">${icon("search", 16)}</span><strong>Vulnerability Scanner</strong><small>Network security</small><em>● Running</em></div>
              <div class="security-tool"><span class="tool-icon tool-red">${icon("activity", 16)}</span><strong>EDR</strong><small>Endpoint detection</small><em>● Monitoring</em></div>
              <div class="security-tool"><span class="tool-icon tool-purple">${icon("grid", 16)}</span><strong>IDS / IPS</strong><small>Intrusion prevention</small><em>● Alert</em></div>
              <div class="security-tool"><span class="tool-icon tool-green">${icon("check", 16)}</span><strong>Email Security</strong><small>Anti-phishing</small><em>● Protected</em></div>
              <div class="security-tool"><span class="tool-icon tool-yellow">${icon("lock", 16)}</span><strong>IAM</strong><small>Identity management</small><em>● Configured</em></div>
              <div class="security-tool"><span class="tool-icon tool-indigo">${icon("shield", 16)}</span><strong>CASB</strong><small>Cloud security</small><em>● Active</em></div>
              <div class="security-tool"><span class="tool-icon tool-pink">${icon("sparkles", 16)}</span><strong>SOAR</strong><small>Security orchestration</small><em>● Automating</em></div>
            </div>
          </article>
          <article class="panel vulnerability-panel">
            <div class="panel-header"><div><h2>Vulnerability Analytics</h2><p>Exposure trends across your environment</p></div><div class="vuln-legend"><span><i></i> Patched</span><span><i></i> Critical</span></div></div>
            <div class="vulnerability-chart">
              <div class="vuln-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span></div>
              <svg viewBox="0 0 440 210" preserveAspectRatio="none" role="img" aria-label="Vulnerability analytics trend">
                <defs><linearGradient id="vulnerability-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ffab46" stop-opacity=".38"/><stop offset="100%" stop-color="#f25328" stop-opacity=".03"/></linearGradient></defs>
                <path class="vulnerability-area" d="M0 54 55 72 110 35 165 82 220 104 275 124 330 88 385 70 440 62V210H0Z"/>
                <path class="vulnerability-line" d="M0 54 55 72 110 35 165 82 220 104 275 124 330 88 385 70 440 62"/>
                <g class="vulnerability-points"><circle cx="0" cy="54" r="4"/><circle cx="55" cy="72" r="4"/><circle cx="110" cy="35" r="4"/><circle cx="165" cy="82" r="4"/><circle cx="220" cy="104" r="4"/><circle cx="275" cy="124" r="4"/><circle cx="330" cy="88" r="4"/><circle cx="385" cy="70" r="4"/><circle cx="440" cy="62" r="4"/></g>
              </svg>
              <div class="vuln-x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </div>
          </article>
        </section>

        <section class="panel sessions-panel">
          <div class="panel-header session-heading"><div><h2>Recent sessions <span class="live-indicator"><i></i> LIVE</span></h2><p>Monitor authentication activity in real time</p></div>
            <div class="table-actions"><button class="select-button filter-button" id="filter-button">${icon("filter", 15)} Filter</button><button class="button button-secondary" data-view="Live sessions">View all sessions ${icon("arrowRight", 15)}</button></div></div>
          <div class="table-wrap"><table><thead><tr><th>IDENTITY</th><th>DEVICE</th><th>LOCATION</th><th>RISK SCORE</th><th>STATUS</th><th>LAST ACTIVE</th><th></th></tr></thead><tbody id="session-rows"></tbody></table>
            <div id="empty-state" class="empty-state" hidden>No sessions match your search.</div></div>
          <div class="table-footer"><span>Showing <strong id="session-count">5</strong> of 2,847 sessions</span><div class="pagination"><button disabled aria-label="Previous page">${icon("chevron", 15)}</button><button class="current-page">1</button><button>2</button><button>3</button><span>…</span><button>24</button><button aria-label="Next page">${icon("chevron", 15)}</button></div></div>
        </section>
        <footer class="footer"><span>© 2026 AuthPulse AI</span><span>Identity Detection &amp; Response <i></i> All systems operational</span></footer>
      </div>
      <section class="content workspace-page" id="identities-view" hidden>
        <div class="workspace-page-heading">
          <div><span class="page-kicker">IDENTITY DIRECTORY</span><h1>Identities</h1><p>Review your account identity and its authentication activity.</p></div>
          <span class="page-count" id="identity-count">1 identity</span>
        </div>
        <article class="panel identity-profile-card">
          <div class="identity-profile-main">
            <div class="identity-large-avatar" id="identity-avatar">JD</div>
            <div class="identity-profile-copy"><span class="identity-state"><i></i> Protected identity</span><h2 id="identity-name">Account</h2><p id="identity-email">user@example.com</p></div>
          </div>
          <div class="identity-details">
            <div><span>IDENTITY ID</span><strong id="identity-id">—</strong></div>
            <div><span>ACCOUNT CREATED</span><strong id="identity-created">—</strong></div>
            <div><span>AUTHENTICATION</span><strong>Password protected</strong></div>
          </div>
        </article>
        <article class="panel identity-sessions-panel">
          <div class="panel-header"><div><h2>Authentication sessions</h2><p>Recent sessions associated with your identity.</p></div><button class="select-button" id="refresh-identity-sessions">${icon("activity", 15)} Refresh</button></div>
          <div class="identity-sessions-list" id="identity-sessions-list" aria-live="polite"><div class="identity-loading">Loading your sessions…</div></div>
        </article>
      </section>
      <section class="content workspace-page" id="settings-view" hidden>
        <div class="workspace-page-heading">
          <div><span class="page-kicker">PREFERENCES &amp; SECURITY</span><h1>Settings</h1><p>Manage your dashboard appearance and account security.</p></div>
        </div>
        <article class="panel settings-card">
          <div class="settings-section-heading"><span class="settings-icon">${icon("sparkles", 18)}</span><div><h2>Appearance</h2><p>Choose the dashboard theme that works best for you.</p></div></div>
          <fieldset class="theme-options"><legend class="sr-only">Dashboard theme</legend>
            <label class="theme-option"><input type="radio" name="theme" value="light"><span class="theme-preview theme-preview-light"><i></i><i></i><i></i></span><span><strong>Light</strong><small>Clean and bright</small></span><span class="theme-check">${icon("check", 15)}</span></label>
            <label class="theme-option"><input type="radio" name="theme" value="dark"><span class="theme-preview theme-preview-dark"><i></i><i></i><i></i></span><span><strong>Dark</strong><small>Easy on the eyes</small></span><span class="theme-check">${icon("check", 15)}</span></label>
          </fieldset>
        </article>
        <article class="panel settings-card password-settings-card">
          <div class="settings-section-heading"><span class="settings-icon security-settings-icon">${icon("lock", 18)}</span><div><h2>Password &amp; security</h2><p>Use your current password to set a new password.</p></div></div>
          <form id="change-password-form" class="password-form">
            <label>Current password<input name="current_password" type="password" autocomplete="current-password" minlength="1" maxlength="72" required></label>
            <label>New password<input name="new_password" type="password" autocomplete="new-password" minlength="8" maxlength="72" required><small>Use at least 8 characters.</small></label>
            <label>Confirm new password<input name="confirm_password" type="password" autocomplete="new-password" minlength="8" maxlength="72" required></label>
            <div class="settings-form-footer"><p id="password-settings-message" role="status" aria-live="polite"></p><button class="button button-primary" type="submit" id="change-password-button">Update password ${icon("arrowRight", 15)}</button></div>
          </form>
        </article>
      </section>
    </main>
  </div>
  <div class="toast-region" id="toast-region" aria-live="polite"></div>
  <dialog class="session-dialog" id="session-dialog">
    <form id="session-form">
      <div class="dialog-heading"><div><span class="dialog-kicker">RISK ENGINE</span><h2>Create a test session</h2>      <p>Evaluate sign-in signals with the prototype machine-learning risk model.</p></div><button type="button" class="icon-button" id="close-dialog" aria-label="Close dialog">${icon("close")}</button></div>
      <div class="form-row"><label>IP address<input name="ip_address" value="192.168.1.42" required /></label><label>Location<input name="location" value="San Francisco, US" required /></label></div>
      <div class="form-row"><label>Device<input name="device" value="MacBook Pro" required /></label><label>Browser<input name="browser" value="Chrome" required /></label></div>
      <details class="advanced-options"><summary>Risk signals <span>Optional</span></summary><div class="signal-grid">
        <label>Failed attempts<input name="failed_attempts" type="number" min="0" value="0" /></label>
        <label>Deepfake score<input name="deepfake_score" type="number" min="0" max="1" step="0.1" value="0" /></label>
        <label><input name="new_device" type="checkbox" /> New device</label><label><input name="location_change" type="checkbox" /> Location changed</label>
        <label><input name="impossible_travel" type="checkbox" /> Impossible travel</label><label><input name="unusual_time" type="checkbox" /> Unusual time</label>
      </div></details>
      <div class="form-error" id="form-error" role="alert"></div>
      <section class="prediction-result" id="prediction-result" aria-live="polite" hidden>
        <div class="prediction-result-heading"><span class="prediction-indicator" id="prediction-indicator"></span><div><small>ML MODEL PREDICTION</small><strong id="prediction-label"></strong></div><span class="prediction-confidence" id="prediction-confidence"></span></div>
        <div class="prediction-result-details"><span>Suspicious probability <strong id="prediction-probability"></strong></span><span>Recommended action <strong id="prediction-action"></strong></span></div>
        <p id="prediction-reasons"></p>
        <small class="prediction-model-note" id="prediction-model-note"></small>
      </section>
      <div class="dialog-actions"><button type="button" class="button button-secondary" id="cancel-dialog">Cancel</button><button type="submit" class="button button-primary" id="submit-session">${icon("pulse", 16)} Assess session</button></div>
    </form>
  </dialog>
`;

const rows = document.querySelector("#session-rows");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#global-search");
const toastRegion = document.querySelector("#toast-region");
const sessionDialog = document.querySelector("#session-dialog");
const authScreen = document.querySelector("#auth-screen");
const appShell = document.querySelector("#app-shell");
const authForm = document.querySelector("#auth-form");
const authError = document.querySelector("#auth-error");
let authMode = "login";
let accessToken = sessionStorage.getItem("authpulse_token");
let currentUser = null;
const storedTheme = localStorage.getItem("authpulse_theme");
let dashboardTheme = storedTheme === "dark" ? "dark" : "light";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function showDashboard(user) {
  currentUser = user;
  appShell.dataset.theme = dashboardTheme;
  updateThemeToggle();
  authScreen.hidden = true;
  appShell.hidden = false;
  const username = user.username || user.email.split("@")[0];
  const initials = username.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
  document.querySelector("#profile-name").textContent = username;
  document.querySelector("#profile-email").textContent = user.email;
  document.querySelector("#profile-avatar").textContent = initials;
  document.querySelector("#topbar-avatar").textContent = initials;
  document.querySelector("#identity-avatar").textContent = initials;
  document.querySelector("#identity-name").textContent = username;
  document.querySelector("#identity-email").textContent = user.email;
  document.querySelector("#identity-id").textContent = `ID-${String(user.user_id).padStart(4, "0")}`;
  document.querySelector("#identity-created").textContent = user.created_at
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(user.created_at))
    : "Available";
  document.querySelectorAll('input[name="theme"]').forEach((input) => {
    input.checked = input.value === dashboardTheme;
  });
}

function showLogin(message = "") {
  accessToken = null;
  currentUser = null;
  sessionStorage.removeItem("authpulse_token");
  appShell.hidden = true;
  authScreen.hidden = false;
  authError.textContent = message;
  if (sessionDialog.open) sessionDialog.close();
}

function getRequestErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return `Cannot reach AuthPulse API at ${API_BASE_URL}. Start the backend from the backend folder with: python -m uvicorn main:app --reload`;
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return `The AuthPulse API at ${API_BASE_URL} did not respond in time. Check that the backend is running and try again.`;
  }
  return error instanceof Error ? error.message : fallback;
}

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  document.querySelector("#auth-kicker").textContent = registering ? "GET STARTED" : "WELCOME BACK";
  document.querySelector("#auth-title").textContent = registering ? "Create your account" : "Sign in to AuthPulse";
  document.querySelector("#auth-subtitle").textContent = registering
    ? "Start protecting your identity perimeter."
    : "Your identity security overview is waiting.";
  document.querySelector("#auth-username-field").hidden = !registering;
  const password = authForm.elements.namedItem("password");
  password.autocomplete = registering ? "new-password" : "current-password";
  password.minLength = registering ? 8 : 0;
  document.querySelector("#auth-submit").innerHTML = `${registering ? "Create account" : "Sign in"} ${icon("arrowRight", 16)}`;
  document.querySelector("#auth-switch-prompt").textContent = registering ? "Already have an account?" : "New to AuthPulse?";
  document.querySelector("#auth-switch").textContent = registering ? "Sign in" : "Create an account";
}

async function initializeAuthentication() {
  await checkApi();
  if (!accessToken) return;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      showLogin("Your session expired. Please sign in again.");
      return;
    }
    showDashboard(await response.json());
  } catch {
    showLogin(`Can't reach the AuthPulse API at ${API_BASE_URL}. Start the backend and try again.`);
  }
}

async function handleAuthentication(event) {
  event.preventDefault();
  const formData = new FormData(authForm);
  const body = {
    email: String(formData.get("email")).trim(),
    password: String(formData.get("password")),
  };
  if (authMode === "register") body.username = String(formData.get("username")).trim();
  const submitButton = document.querySelector("#auth-submit");
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="button-spinner"></span> Connecting securely…';
  authError.textContent = "";
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${authMode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) {
      const detail = Array.isArray(result.detail)
        ? result.detail.map((issue) => issue.msg).join(". ")
        : result.detail;
      throw new Error(detail || `Authentication failed with status ${response.status}`);
    }
    accessToken = result.access_token;
    sessionStorage.setItem("authpulse_token", accessToken);
    const profileResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!profileResponse.ok) throw new Error("Signed in, but your profile could not be loaded. Please try again.");
    showDashboard(await profileResponse.json());
    await checkApi();
  } catch (requestError) {
    if (accessToken && !currentUser) {
      accessToken = null;
      sessionStorage.removeItem("authpulse_token");
    }
    authError.textContent = getRequestErrorMessage(requestError, "Authentication failed. Please try again.");
  } finally {
    submitButton.disabled = false;
    setAuthMode(authMode);
  }
}

function signOut() {
  showLogin();
  setAuthMode("login");
}

function renderSessions(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = sessions.filter((session) =>
    [session.name, session.email, session.device, session.location, session.status, session.ip]
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
  rows.innerHTML = filtered.map((session) => {
    const riskClass = session.score >= 80 ? "critical" : session.score >= 60 ? "high" : session.score >= 30 ? "medium" : "low";
    const statusClass = session.status.toLowerCase().replaceAll(" ", "-");
    const deviceIcon = session.device.toLowerCase().includes("iphone") || session.device.toLowerCase().includes("pixel") ? "activity" : "laptop";
    return `<tr><td><div class="identity-cell"><span class="person-avatar ${session.color}">${escapeHtml(session.initials)}</span><span><strong>${escapeHtml(session.name)}</strong><small>${escapeHtml(session.email)}</small></span></div></td><td><div class="device-cell">${icon(deviceIcon, 16)}<span>${escapeHtml(session.device)}</span></div></td><td><span class="location-cell">${icon("globe", 15)}${escapeHtml(session.location)}</span></td><td><div class="risk-cell"><span class="risk-number ${riskClass}">${escapeHtml(session.score)}</span><div class="risk-bar"><i class="${riskClass}" style="width:${escapeHtml(session.score)}%"></i></div></div></td><td><span class="status-badge ${statusClass}"><i></i>${escapeHtml(session.status)}</span></td><td class="time-cell">${escapeHtml(session.time)}</td><td><button class="icon-button row-more" aria-label="Session actions">${icon("more", 18)}</button></td></tr>`;
  }).join("");
  document.querySelector("#session-count").textContent = String(filtered.length);
  emptyState.hidden = filtered.length !== 0;
  rows.hidden = filtered.length === 0;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const toastIcon = document.createElement("span");
  toastIcon.className = "toast-icon";
  toastIcon.innerHTML = icon(type === "success" ? "check" : "shield", 17);
  const toastMessage = document.createElement("span");
  toastMessage.textContent = message;
  const dismissButton = document.createElement("button");
  dismissButton.className = "icon-button";
  dismissButton.type = "button";
  dismissButton.setAttribute("aria-label", "Dismiss");
  dismissButton.innerHTML = icon("close", 16);
  dismissButton.addEventListener("click", () => toast.remove());
  toast.append(toastIcon, toastMessage, dismissButton);
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 5000);
}

function setApiStatus(connected, message) {
  const dot = document.querySelector("#api-dot");
  const label = document.querySelector("#api-label");
  const description = document.querySelector("#api-description");
  dot.classList.toggle("connected", connected);
  label.textContent = connected ? "API connected" : "Demo mode";
  description.textContent = connected ? "AuthPulse API is responding normally." : message;
}

function applyDashboardTheme(theme) {
  dashboardTheme = theme;
  appShell.dataset.theme = theme;
  localStorage.setItem("authpulse_theme", theme);
  updateThemeToggle();
  document.querySelectorAll('input[name="theme"]').forEach((input) => {
    input.checked = input.value === theme;
  });
}

function updateThemeToggle() {
  const isDark = dashboardTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const button = document.querySelector("#theme-toggle");
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = icon(isDark ? "sun" : "moon", 18);
}

async function loadIdentitySessions() {
  const list = document.querySelector("#identity-sessions-list");
  list.innerHTML = '<div class="identity-loading">Loading your sessions…</div>';
  try {
    const response = await fetch(`${API_BASE_URL}/sessions?limit=20`, {
      headers: { Authorization: "Bearer " + accessToken },
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        return;
      }
      throw new Error(typeof result.detail === "string" ? result.detail : "Could not load identity sessions.");
    }

    if (result.length === 0) {
      list.innerHTML = '<div class="identity-empty">No sessions recorded yet. Create a test session from the overview to see activity here.</div>';
      return;
    }

    list.innerHTML = result.map((session) => {
      const score = Math.round(session.risk_score);
      const riskClass = score >= 80 ? "critical" : score >= 60 ? "high" : score >= 30 ? "medium" : "low";
      const status = session.status === "ALLOW" ? "Allowed"
        : session.status === "BLOCK" ? "Blocked"
          : session.status === "STEP_UP_AUTH" ? "Step-up auth"
            : session.status === "MONITOR" ? "Monitoring" : session.status;
      const statusClass = status.toLowerCase().replaceAll(" ", "-");
      const created = new Date(session.created_at);
      const time = Number.isNaN(created.getTime()) ? "Unknown date" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(created);
      return `<article class="identity-session-row"><span class="identity-session-device">${icon("laptop", 18)}</span><div class="identity-session-copy"><strong>${escapeHtml(session.device)} · ${escapeHtml(session.browser)}</strong><span>${escapeHtml(session.location)} <i>·</i> ${escapeHtml(session.ip_address)}</span><small>${escapeHtml(time)}</small></div><div class="identity-session-risk"><span class="risk-number ${riskClass}">${score}</span><span class="status-badge ${statusClass}"><i></i>${escapeHtml(status)}</span></div></article>`;
    }).join("");
  } catch (error) {
    list.innerHTML = `<div class="identity-error">${escapeHtml(getRequestErrorMessage(error, "Could not load identity sessions."))}</div>`;
  }
}

async function checkApi() {
  setApiStatus(false, "Checking your local AuthPulse API…");
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error(`Health check returned ${response.status}`);
    const health = await response.json();
    if (health.status !== "healthy") throw new Error("The API reported an unhealthy status");
    setApiStatus(true, "AuthPulse API is responding normally.");
  } catch {
    setApiStatus(false, "Connect the backend at " + API_BASE_URL);
  }
}

function selectView(label) {
  if (window.matchMedia("(max-width: 720px)").matches) {
    document.querySelector("#sidebar").classList.remove("sidebar-open");
  }
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === label));
  document.querySelectorAll(".dashboard-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === label));
  document.querySelector("#breadcrumb-current").textContent = label;
  const overview = document.querySelector("#content");
  const identitiesView = document.querySelector("#identities-view");
  const settingsView = document.querySelector("#settings-view");
  overview.hidden = label === "Identities" || label === "Settings";
  identitiesView.hidden = label !== "Identities";
  settingsView.hidden = label !== "Settings";
  if (label === "Identities") {
    void loadIdentitySessions();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (label === "Settings") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (label === "Overview") return;
  if (label === "Live sessions") {
    document.querySelector("#content").scrollIntoView({ behavior: "smooth" });
    document.querySelector(".sessions-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Showing the latest session activity.", "success");
    return;
  }
  if (label === "Threat intelligence") {
    document.querySelector(".threat-panel").scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Recent threat signals are highlighted on this overview.", "success");
    return;
  }
}

renderSessions();
initializeAuthentication();

document.querySelector("#auth-switch").addEventListener("click", () => {
  authError.textContent = "";
  setAuthMode(authMode === "login" ? "register" : "login");
});
authForm.addEventListener("submit", handleAuthentication);
document.querySelector("#topbar-avatar").addEventListener("click", signOut);
document.querySelector("#profile-menu").addEventListener("click", signOut);

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => selectView(button.dataset.view));
});
searchInput.addEventListener("input", () => renderSessions(searchInput.value));
document.querySelector("#new-session-button").addEventListener("click", () => {
  document.querySelector("#form-error").textContent = "";
  sessionDialog.showModal();
});
document.querySelector("#close-dialog").addEventListener("click", () => sessionDialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => sessionDialog.close());
sessionDialog.addEventListener("click", (event) => {
  if (event.target === sessionDialog) sessionDialog.close();
});
document.querySelector("#api-retry").addEventListener("click", checkApi);
document.querySelector("#refresh-identity-sessions").addEventListener("click", loadIdentitySessions);
document.querySelectorAll('input[name="theme"]').forEach((input) => {
  input.addEventListener("change", () => applyDashboardTheme(input.value));
});
document.querySelector("#theme-toggle").addEventListener("click", () => {
  applyDashboardTheme(dashboardTheme === "dark" ? "light" : "dark");
});
document.querySelector("#improve-score-button").addEventListener("click", () => {
  selectView("Threat intelligence");
  showToast("Review the latest security incidents to improve your score.");
});
document.querySelector("#change-password-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const currentPassword = String(data.get("current_password"));
  const newPassword = String(data.get("new_password"));
  const confirmPassword = String(data.get("confirm_password"));
  const message = document.querySelector("#password-settings-message");
  const submitButton = document.querySelector("#change-password-button");
  message.textContent = "";
  message.className = "";
  if (newPassword !== confirmPassword) {
    message.textContent = "New password and confirmation do not match.";
    message.classList.add("settings-message-error");
    return;
  }
  if (newPassword.length < 8) {
    message.textContent = "New password must be at least 8 characters.";
    message.classList.add("settings-message-error");
    return;
  }
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="button-spinner"></span> Updating…';
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        return;
      }
      throw new Error(typeof result.detail === "string" ? result.detail : "Password could not be updated.");
    }
    form.reset();
    message.textContent = result.message;
    message.classList.add("settings-message-success");
  } catch (error) {
    message.textContent = getRequestErrorMessage(error, "Password could not be updated.");
    message.classList.add("settings-message-error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = `Update password ${icon("arrowRight", 15)}`;
  }
});
document.querySelector("#filter-button").addEventListener("click", () => {
  searchInput.focus();
  showToast("Type a name, device, location or status to filter sessions.");
});
document.querySelector("#period-select").addEventListener("click", () => showToast("Security monitoring metrics are displaying the last 7 days."));
document.querySelector("#notification-button").addEventListener("click", () => {
  document.querySelector(".threat-panel").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("You have 3 recent threat signals to review.");
});
document.querySelector("#menu-button").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("sidebar-open"));
document.addEventListener("click", (event) => {
  const sidebar = document.querySelector("#sidebar");
  const menuButton = document.querySelector("#menu-button");
  if (
    window.matchMedia("(max-width: 720px)").matches
    && sidebar.classList.contains("sidebar-open")
    && event.target instanceof Element
    && !sidebar.contains(event.target)
    && !menuButton.contains(event.target)
  ) {
    sidebar.classList.remove("sidebar-open");
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelector("#session-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const body = Object.fromEntries(data.entries());
  for (const key of ["failed_attempts", "deepfake_score"]) body[key] = Number(body[key]);
  for (const key of ["new_device", "location_change", "impossible_travel", "unusual_time"]) body[key] = data.has(key);
  const submitButton = document.querySelector("#submit-session");
  const error = document.querySelector("#form-error");
  const predictionResult = document.querySelector("#prediction-result");
  error.textContent = "";
  predictionResult.hidden = true;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="button-spinner"></span> Predicting…';
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        throw new Error("Your session expired. Please sign in again.");
      }
      const message = typeof result.detail === "string" ? result.detail : `Request failed with status ${response.status}`;
      throw new Error(message);
    }
    const resultSession = {
      initials: "TS", name: `Test session #${result.session_id}`, email: `user ${currentUser.user_id} · ${body.ip_address}`,
      device: `${body.device} · ${body.browser}`, location: body.location, ip: body.ip_address,
      score: Math.round(result.risk_score), status: result.recommended_action === "ALLOW" ? "Allowed" : result.recommended_action === "BLOCK" ? "Blocked" : result.recommended_action === "STEP_UP_AUTH" ? "Step-up auth" : "Monitoring",
      time: "just now", color: "lavender",
    };
    document.querySelector("#prediction-label").textContent = result.prediction;
    document.querySelector("#prediction-confidence").textContent = `${result.confidence}% confidence`;
    document.querySelector("#prediction-probability").textContent = `${result.suspicious_probability}%`;
    document.querySelector("#prediction-action").textContent = result.recommended_action.replaceAll("_", " ");
    document.querySelector("#prediction-reasons").textContent = result.reasons.length
      ? `Signals considered: ${result.reasons.join(", ")}.`
      : "No high-risk signals were present in this request.";
    document.querySelector("#prediction-model-note").textContent = `${result.model_name}. ${result.model_notice}`;
    document.querySelector("#prediction-indicator").className = `prediction-indicator ${result.prediction.toLowerCase()}`;
    predictionResult.hidden = false;
    sessions.unshift(resultSession);
    renderSessions(searchInput.value);
    showToast(`ML prediction: ${result.prediction} · ${result.suspicious_probability}% suspicious probability.`);
  } catch (requestError) {
    error.textContent = getRequestErrorMessage(requestError, "Unable to assess this session.");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = `${icon("pulse", 16)} Assess session`;
  }
});
