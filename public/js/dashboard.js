// Check if user is logged in
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
    window.location.href = 'login.html';
}

// Display user name
document.getElementById('userName').textContent = user.name;
document.getElementById('welcomeName').textContent = user.name;

// Display current date
const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
document.getElementById('currentDate').textContent = currentDate;

// Load user data from localStorage
let userData = JSON.parse(localStorage.getItem(`userData_${user.email}`)) || {
    steps: 0,
    workouts: 0,
    sleep: 0,
    activities: []
};

// Update display with saved data
updateDisplay();

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Update Steps
function updateSteps() {
    const steps = prompt('Enter your steps for today:', userData.steps);
    if (steps !== null && !isNaN(steps) && steps >= 0) {
        userData.steps = parseInt(steps);
        addActivity('👣', 'Steps Updated', `${steps} steps recorded`);
        saveAndUpdate();
    }
}

// Update Workouts
function updateWorkouts() {
    const workoutName = prompt('Enter workout name (e.g., Running, Gym, Yoga):');
    if (workoutName) {
        userData.workouts++;
        addActivity('💪', 'Workout Completed', workoutName);
        saveAndUpdate();
    }
}

// Update Sleep
function updateSleep() {
    const sleep = prompt('Enter hours of sleep:', userData.sleep);
    if (sleep !== null && !isNaN(sleep) && sleep >= 0) {
        userData.sleep = parseFloat(sleep);
        addActivity('😴', 'Sleep Logged', `${sleep} hours of sleep`);
        saveAndUpdate();
    }
}

// Add activity to list
function addActivity(icon, title, description) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    userData.activities.unshift({
        icon,
        title,
        description,
        time,
        timestamp: now.getTime()
    });
    
    // Keep only last 10 activities
    if (userData.activities.length > 10) {
        userData.activities = userData.activities.slice(0, 10);
    }
}

// Save and update display
function saveAndUpdate() {
    localStorage.setItem(`userData_${user.email}`, JSON.stringify(userData));
    updateDisplay();
}

// Update all display elements
function updateDisplay() {
    // Update stats
    document.getElementById('stepsValue').textContent = userData.steps.toLocaleString();
    document.getElementById('workoutsValue').textContent = userData.workouts;
    document.getElementById('sleepValue').textContent = `${userData.sleep}h`;
    
    // Calculate progress (based on goals)
    const stepsProgress = Math.min((userData.steps / 10000) * 100, 100);
    const workoutsProgress = Math.min((userData.workouts / 5) * 100, 100);
    const sleepProgress = Math.min((userData.sleep / 8) * 100, 100);
    const totalProgress = Math.round((stepsProgress + workoutsProgress + sleepProgress) / 3);
    
    document.getElementById('progressFill').style.width = `${totalProgress}%`;
    document.getElementById('progressValue').textContent = `${totalProgress}%`;
    
    // Update activity list
    const activityList = document.getElementById('activityList');
    
    if (userData.activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <p>No activities yet. Start tracking your fitness journey!</p>
            </div>
        `;
    } else {
        activityList.innerHTML = userData.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <span class="activity-icon">${activity.icon}</span>
                    <div class="activity-details">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                    </div>
                </div>
                <span class="activity-time">${activity.time}</span>
            </div>
        `).join('');
    }
}

// Initialize with some sample data if first time
if (userData.activities.length === 0 && userData.steps === 0) {
    // This is a new user, you can add a welcome activity
    addActivity('🎉', 'Welcome!', 'Start your fitness journey today');
    saveAndUpdate();
}
