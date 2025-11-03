/* ============================================
   🤝 TRAVEL COMPANIONS - PHASE 1
   User Profiles & Travel Preferences
   Designed with love by Kavlin 💖
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🤝 Travel Companions initializing...');
    initializeTravelCompanions();
});

// ============================================
// GLOBAL VARIABLES
// ============================================

let userProfile = null;
let currentQuizQuestion = 0;
let quizAnswers = [];

// Sample user profile data
const DEFAULT_PROFILE = {
    name: CURRENT_USER.isAuthenticated ? CURRENT_USER.name : 'Guest Traveler',
    email: CURRENT_USER.isAuthenticated ? CURRENT_USER.email : 'guest@example.com',
    photo: '/static/images/default-avatar.png',
    coverPhoto: null,
    bio: '"Adventure seeker and mountain lover. Always ready for the next journey! 🏔️"',
    location: 'Himachal Pradesh, India',
    ageGroup: '25-34',
    gender: 'Prefer not to say',
    languages: ['English', 'Hindi'],
    memberSince: 'January 2024',
    interests: ['Photography', 'Mountains', 'Adventure', 'Food'],
    favoriteRoutes: ['HT-101', 'HT-103', 'HT-105'],
    preferredTimes: 'Morning (6-10 AM)',
    travelStyle: 'Solo Adventurer',
    companionship: 'Open to meeting new people',
    stats: {
        totalTrips: 23,
        routesTraveled: 6,
        companionsMet: 12,
        storiesShared: 5,
        forumPosts: 18,
        likesReceived: 145
    },
    badges: [
        { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: '10+ morning trips', unlocked: true },
        { id: 'frequent-traveler', name: 'Frequent Traveler', icon: '🚌', description: '25+ total trips', unlocked: false },
        { id: 'storyteller', name: 'Storyteller', icon: '✍️', description: '5+ stories shared', unlocked: true },
        { id: 'community-helper', name: 'Community Helper', icon: '🤝', description: '50+ forum posts', unlocked: false },
        { id: 'route-explorer', name: 'Route Explorer', icon: '🗺️', description: 'Traveled all routes', unlocked: false },
        { id: 'social-butterfly', name: 'Social Butterfly', icon: '🎭', description: '20+ companions met', unlocked: false },
        { id: 'kavlins-choice', name: "Kavlin's Choice", icon: '💖', description: 'Special recognition', unlocked: false },
        { id: 'verified', name: 'Verified Traveler', icon: '⭐', description: 'Profile verified', unlocked: true }
    ],
    goals: [
        { text: 'Travel all 8 Happy Trails routes', progress: '6/8' },
        { text: 'Share 10 travel stories', progress: '5/10' },
        { text: 'Meet 25 travel companions', progress: '12/25' }
    ],
    completionPercentage: 75,
    travelStyleResult: null
};

// Travel Style Quiz Questions
const TRAVEL_QUIZ = [
    {
        question: "What's your ideal travel time?",
        options: [
            { text: 'Early morning sunrise', value: 'early-bird' },
            { text: 'Mid-day comfort', value: 'flexible' },
            { text: 'Late afternoon golden hour', value: 'golden-hour' },
            { text: 'Whenever the bus leaves!', value: 'spontaneous' }
        ]
    },
    {
        question: "How do you prefer to travel?",
        options: [
            { text: 'Alone with my thoughts', value: 'solo' },
            { text: 'With one close friend', value: 'duo' },
            { text: 'Small group (3-5 people)', value: 'small-group' },
            { text: 'The more, the merrier!', value: 'large-group' }
        ]
    },
    {
        question: "During the journey, you're most likely to:",
        options: [
            { text: 'Read a book or listen to music', value: 'introspective' },
            { text: 'Take photos of the scenery', value: 'photographer' },
            { text: 'Chat with fellow travelers', value: 'social' },
            { text: 'Plan the next adventure', value: 'planner' }
        ]
    },
    {
        question: "Your dream bus companion is someone who:",
        options: [
            { text: 'Respects silence and personal space', value: 'quiet' },
            { text: 'Shares interesting stories', value: 'storyteller' },
            { text: 'Knows all the best spots', value: 'guide' },
            { text: 'Is up for spontaneous detours', value: 'adventurous' }
        ]
    },
    {
        question: "After reaching your destination, you:",
        options: [
            { text: 'Immediately explore on your own', value: 'independent' },
            { text: 'Exchange contacts with companions', value: 'connector' },
            { text: 'Share photos on social media', value: 'sharer' },
            { text: 'Write in your travel journal', value: 'reflective' }
        ]
    }
];

// Travel Style Results
const TRAVEL_STYLES = {
    'solo-adventurer': {
        icon: '🎒',
        title: "Solo Adventurer",
        description: "You love independence but enjoy meaningful conversations with fellow travelers. You prefer peaceful journeys with optional social interactions."
    },
    'social-butterfly': {
        icon: '🎭',
        title: "Social Butterfly",
        description: "You thrive on connections! Meeting new people and sharing experiences makes your journey complete. Every trip is a chance to make friends."
    },
    'peaceful-observer': {
        icon: '🧘',
        title: "Peaceful Observer",
        description: "You seek tranquility in travel. The journey itself is meditation, and you appreciate companions who understand the beauty of silence."
    },
    'enthusiastic-explorer': {
        icon: '🌟',
        title: "Enthusiastic Explorer",
        description: "Adventure is your middle name! You're always ready for the unexpected and love companions who share your spontaneous spirit."
    },
    'thoughtful-traveler': {
        icon: '📖',
        title: "Thoughtful Traveler",
        description: "You see travel as a journey within. You prefer deep conversations over small talk and value companions who appreciate life's subtleties."
    },
    'family-oriented': {
        icon: '👨‍👩‍👧‍👦',
        title: "Family Oriented",
        description: "You believe the best memories are made together. Safety, comfort, and shared joy define your travel style."
    }
};

// ============================================
// INITIALIZATION
// ============================================

function initializeTravelCompanions() {
    // Load user profile
    loadUserProfile();
    
    // Setup tab navigation
    setupTabNavigation();
    
    // Render profile data
    renderProfileData();
    
    // Render badges
    renderBadges();
    
    // Render goals
    renderGoals();
    
    console.log('✅ Travel Companions initialized successfully!');
}

function loadUserProfile() {
    const stored = localStorage.getItem('happytrails_user_profile');
    if (stored) {
        try {
            userProfile = JSON.parse(stored);
        } catch (e) {
            userProfile = DEFAULT_PROFILE;
        }
    } else {
        userProfile = DEFAULT_PROFILE;
    }
}

function saveUserProfile() {
    localStorage.setItem('happytrails_user_profile', JSON.stringify(userProfile));
}

// ============================================
// TAB NAVIGATION
// ============================================

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.companions-tab');
    const tabContents = document.querySelectorAll('.companions-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            showToast(`Switched to: ${this.textContent.trim()} ✨`, 2000);
        });
    });
}

// ============================================
// PROFILE RENDERING
// ============================================

function renderProfileData() {
    if (!userProfile) return;
    
    // Basic info
    document.getElementById('profileName').textContent = userProfile.name;
    document.getElementById('profileLocation').innerHTML = `
        <i class="fas fa-map-marker-alt"></i>
        ${userProfile.location}
    `;
    document.getElementById('profileBio').textContent = userProfile.bio;
    
    // Tags
    const tagsContainer = document.getElementById('profileTags');
    tagsContainer.innerHTML = userProfile.interests.map(interest => {
        const icons = {
            'Photography': '📸',
            'Mountains': '🏔️',
            'Adventure': '🎒',
            'Food': '🍜',
            'Nature': '🌲',
            'Culture': '🎭',
            'History': '🏛️',
            'Spirituality': '🕉️'
        };
        return `<span class="interest-tag">${icons[interest] || '✨'} ${interest}</span>`;
    }).join('');
    
    // Stats
    document.getElementById('totalTrips').textContent = userProfile.stats.totalTrips;
    document.getElementById('routesTraveled').textContent = userProfile.stats.routesTraveled;
    document.getElementById('companionsMet').textContent = userProfile.stats.companionsMet;
    document.getElementById('storiesShared').textContent = userProfile.stats.storiesShared;
    document.getElementById('forumPosts').textContent = userProfile.stats.forumPosts;
    document.getElementById('likesReceived').textContent = userProfile.stats.likesReceived;
    
    // Profile completion
    document.getElementById('completionPercentage').textContent = `${userProfile.completionPercentage}%`;
    document.getElementById('completionProgressBar').style.width = `${userProfile.completionPercentage}%`;
    
    // Details
    document.getElementById('ageGroup').textContent = userProfile.ageGroup;
    document.getElementById('gender').textContent = userProfile.gender;
    document.getElementById('languages').textContent = userProfile.languages.join(', ');
    document.getElementById('memberSince').textContent = userProfile.memberSince;
    
    // Preferences
    const routeTags = userProfile.favoriteRoutes.map(route => 
        `<span class="route-tag">${route}</span>`
    ).join('');
    
    document.querySelector('.preference-item:nth-child(1) .preference-value').innerHTML = routeTags;
    document.querySelector('.preference-item:nth-child(2) .preference-value').textContent = userProfile.preferredTimes;
    document.querySelector('.preference-item:nth-child(3) .preference-value').textContent = userProfile.travelStyle;
    document.querySelector('.preference-item:nth-child(4) .preference-value').textContent = userProfile.companionship;
    
    // Quiz result if exists
    if (userProfile.travelStyleResult) {
        showQuizResult(userProfile.travelStyleResult);
    }
}

function renderBadges() {
    const container = document.getElementById('badgesGrid');
    if (!container || !userProfile) return;
    
    container.innerHTML = userProfile.badges.map(badge => `
        <div class="badge-item ${badge.unlocked ? '' : 'locked'}" 
             title="${badge.description}">
            <span class="badge-icon">${badge.icon}</span>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
        </div>
    `).join('');
}

function renderGoals() {
    const container = document.getElementById('goalsList');
    if (!container || !userProfile) return;
    
    container.innerHTML = userProfile.goals.map((goal, index) => `
        <div class="goal-item">
            <div class="goal-text">${goal.text}</div>
            <div class="goal-progress">${goal.progress}</div>
        </div>
    `).join('');
}

// ============================================
// PROFILE EDITING
// ============================================

function editProfile() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    
    const form = document.getElementById('profileEditForm');
    
    form.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <div class="form-group">
                <label style="font-weight: 600; color: #2C3E50; margin-bottom: 8px; display: block;">
                    <i class="fas fa-user"></i> Full Name
                </label>
                <input type="text" id="editName" class="form-control" 
                       value="${userProfile.name}" placeholder="Your name">
            </div>
            
            <div class="form-group">
                <label style="font-weight: 600; color: #2C3E50; margin-bottom: 8px; display: block;">
                    <i class="fas fa-map-marker-alt"></i> Location
                </label>
                <input type="text" id="editLocation" class="form-control" 
                       value="${userProfile.location}" placeholder="City, Country">
            </div>
            
            <div class="form-group">
                <label style="font-weight: 600; color: #2C3E50; margin-bottom: 8px; display: block;">
                    <i class="fas fa-pen"></i> Bio
                </label>
                <textarea id="editBio" class="form-control" rows="3" 
                          placeholder="Tell us about yourself...">${userProfile.bio}</textarea>
            </div>
            
            <div class="form-group">
                <label style="font-weight: 600; color: #2C3E50; margin-bottom: 8px; display: block;">
                    <i class="fas fa-heart"></i> Interests (select up to 6)
                </label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${['Photography', 'Mountains', 'Adventure', 'Food', 'Nature', 'Culture', 
                       'History', 'Spirituality', 'Relaxation', 'Socializing', 'Reading', 'Music'].map(interest => `
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" value="${interest}" 
                                   ${userProfile.interests.includes(interest) ? 'checked' : ''}>
                            ${interest}
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <div class="form-group">
                <label style="font-weight: 600; color: #2C3E50; margin-bottom: 8px; display: block;">
                    <i class="fas fa-birthday-cake"></i> Age Group
                </label>
                <select id="editAgeGroup" class="form-control">
                    <option value="18-24" ${userProfile.ageGroup === '18-24' ? 'selected' : ''}>18-24</option>
                    <option value="25-34" ${userProfile.ageGroup === '25-34' ? 'selected' : ''}>25-34</option>
                    <option value="35-44" ${userProfile.ageGroup === '35-44' ? 'selected' : ''}>35-44</option>
                    <option value="45-54" ${userProfile.ageGroup === '45-54' ? 'selected' : ''}>45-54</option>
                    <option value="55+" ${userProfile.ageGroup === '55+' ? 'selected' : ''}>55+</option>
                </select>
            </div>
            
            <div class="form-actions" style="display: flex; gap: 15px; margin-top: 10px;">
                <button class="btn-create-collection" onclick="saveProfileChanges()" style="flex: 1;">
                    <i class="fas fa-save"></i>
                    Save Changes
                </button>
                <button class="btn-cancel" onclick="closeEditProfile()" style="flex: 1;">
                    Cancel
                </button>
            </div>
            
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveProfileChanges() {
    // Get form values
    const name = document.getElementById('editName').value.trim();
    const location = document.getElementById('editLocation').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    const ageGroup = document.getElementById('editAgeGroup').value;
    
    // Get selected interests
    const interests = Array.from(document.querySelectorAll('#profileEditForm input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Validate
    if (!name) {
        showToast('⚠️ Please enter your name!', 3000);
        return;
    }
    
    if (interests.length === 0) {
        showToast('⚠️ Please select at least one interest!', 3000);
        return;
    }
    
    if (interests.length > 6) {
        showToast('⚠️ Please select up to 6 interests only!', 3000);
        return;
    }
    
    // Update profile
    userProfile.name = name;
    userProfile.location = location;
    userProfile.bio = bio;
    userProfile.ageGroup = ageGroup;
    userProfile.interests = interests;
    
    // Recalculate completion
    updateProfileCompletion();
    
    // Save to localStorage
    saveUserProfile();
    
    // Re-render
    renderProfileData();
    
    // Close modal
    closeEditProfile();
    
    showToast('Profile updated successfully! ✅', 2000);
}

function updateProfileCompletion() {
    let completion = 0;
    
    // Basic info (20%)
    if (userProfile.name && userProfile.location && userProfile.bio) completion += 20;
    
    // Photo (15%)
    if (userProfile.photo && userProfile.photo !== '/static/images/default-avatar.png') completion += 15;
    
    // Interests (15%)
    if (userProfile.interests.length >= 3) completion += 15;
    
    // Preferences (20%)
    if (userProfile.favoriteRoutes.length > 0 && userProfile.travelStyle) completion += 20;
    
    // Quiz (15%)
    if (userProfile.travelStyleResult) completion += 15;
    
    // Goals (15%)
    if (userProfile.goals.length > 0) completion += 15;
    
    userProfile.completionPercentage = Math.min(completion, 100);
}

// ============================================
// TRAVEL STYLE QUIZ
// ============================================

function startTravelQuiz() {
    currentQuizQuestion = 0;
    quizAnswers = [];
    
    const modal = document.getElementById('travelQuizModal');
    if (!modal) return;
    
    showQuizQuestion();
    modal.style.display = 'flex';
}

function showQuizQuestion() {
    const content = document.getElementById('quizContent');
    if (!content) return;
    
    if (currentQuizQuestion >= TRAVEL_QUIZ.length) {
        // Quiz complete - calculate result
        calculateQuizResult();
        return;
    }
    
    const question = TRAVEL_QUIZ[currentQuizQuestion];
    
    content.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="color: #6C757D; font-size: 0.9rem; margin-bottom: 10px;">
                Question ${currentQuizQuestion + 1} of ${TRAVEL_QUIZ.length}
            </div>
            <div style="height: 8px; background: rgba(255, 215, 0, 0.2); border-radius: 10px; margin-bottom: 30px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #FFD700, #FF8C00); width: ${((currentQuizQuestion) / TRAVEL_QUIZ.length) * 100}%; transition: width 0.3s ease;"></div>
            </div>
            <h3 style="font-family: 'Caveat', cursive; font-size: 2rem; color: #F57F17; margin-bottom: 30px;">
                ${question.question}
            </h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                ${question.options.map((option, index) => `
                    <button class="quiz-option-btn" onclick="selectQuizAnswer('${option.value}')">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add CSS for quiz buttons
    const style = document.createElement('style');
    style.textContent = `
        .quiz-option-btn {
            background: rgba(255, 249, 230, 0.5);
            border: 2px solid rgba(255, 215, 0, 0.3);
            color: #2C3E50;
            padding: 18px 25px;
            border-radius: 15px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: left;
        }
        .quiz-option-btn:hover {
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.2);
            transform: translateX(5px);
        }
    `;
    if (!document.getElementById('quiz-option-style')) {
        style.id = 'quiz-option-style';
        document.head.appendChild(style);
    }
}

function selectQuizAnswer(answer) {
    quizAnswers.push(answer);
    currentQuizQuestion++;
    showQuizQuestion();
}

function calculateQuizResult() {
    // Simple algorithm - count answer patterns
    const answerCounts = {};
    
    quizAnswers.forEach(answer => {
        answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    });
    
    // Determine style based on dominant answers
    let style = 'solo-adventurer'; // default
    
    if (quizAnswers.includes('social') && quizAnswers.includes('large-group')) {
        style = 'social-butterfly';
    } else if (quizAnswers.includes('quiet') && quizAnswers.includes('introspective')) {
        style = 'peaceful-observer';
    } else if (quizAnswers.includes('spontaneous') && quizAnswers.includes('adventurous')) {
        style = 'enthusiastic-explorer';
    } else if (quizAnswers.includes('reflective') && quizAnswers.includes('storyteller')) {
        style = 'thoughtful-traveler';
    } else if (quizAnswers.includes('small-group') && quizAnswers.includes('planner')) {
        style = 'family-oriented';
    }
    
    const result = TRAVEL_STYLES[style];
    
    // Save to profile
    userProfile.travelStyleResult = style;
    userProfile.travelStyle = result.title;
    updateProfileCompletion();
    saveUserProfile();
    
    // Show result
    showQuizResultModal(result);
}

function showQuizResultModal(result) {
    const content = document.getElementById('quizContent');
    if (!content) return;
    
    content.innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <div style="font-size: 5rem; margin-bottom: 20px; animation: bounce 1s ease-in-out;">
                ${result.icon}
            </div>
            <h3 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; color: #F57F17; margin-bottom: 15px;">
                You're a ${result.title}!
            </h3>
            <p style="color: #6C757D; line-height: 1.7; font-size: 1.1rem; margin-bottom: 30px;">
                ${result.description}
            </p>
            <button class="take-quiz-btn" onclick="closeTravelQuiz(); renderProfileData();">
                <i class="fas fa-check"></i>
                Awesome! Save to Profile
            </button>
        </div>
    `;
}

function closeTravelQuiz() {
    const modal = document.getElementById('travelQuizModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showQuizResult(styleKey) {
    const result = TRAVEL_STYLES[styleKey];
    if (!result) return;
    
    const resultDiv = document.getElementById('quizResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="quiz-result-icon">${result.icon}</div>
            <div class="quiz-result-title">You're a ${result.title}!</div>
            <div class="quiz-result-description">
                ${result.description}
            </div>
        `;
        resultDiv.style.display = 'block';
        
        // Hide take quiz button
        const quizBtn = document.querySelector('.take-quiz-btn');
        if (quizBtn) {
            quizBtn.textContent = 'Retake Quiz';
        }
    }
}

// ============================================
// OTHER PROFILE ACTIONS
// ============================================

function editAvatar() {
    showToast('📸 Photo upload coming soon! For now, use the Edit Profile button.', 3000);
}

function editCoverPhoto() {
    showToast('📸 Cover photo upload coming soon!', 3000);
}

function shareProfile() {
    const profileUrl = `${window.location.origin}/travel-companions?user=${encodeURIComponent(userProfile.name)}`;
    
    if (navigator.share) {
        navigator.share({
            title: `${userProfile.name}'s Travel Profile - Happy Trails`,
            text: `Check out my travel profile on Happy Trails!`,
            url: profileUrl
        }).catch(() => {
            copyToClipboard(profileUrl);
        });
    } else {
        copyToClipboard(profileUrl);
    }
    
    showToast('Profile link copied! 📋', 2000);
}

function viewSettings() {
    showToast('⚙️ Settings panel coming soon!', 2000);
}

function editPreferences() {
    showToast('✏️ Preferences editor coming soon!', 2000);
}

function addTravelGoal() {
    const goalText = prompt('What\'s your travel goal?');
    if (goalText && goalText.trim()) {
        userProfile.goals.push({
            text: goalText.trim(),
            progress: '0/1'
        });
        saveUserProfile();
        renderGoals();
        showToast('Goal added! 🎯', 2000);
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.companions-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'companions-toast';
    toast.innerHTML = `<i class="fas fa-check-circle me-2"></i><span>${message}</span>`;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #FFD700, #FF8C00);
        color: white;
        padding: 14px 24px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Make functions globally accessible
window.editProfile = editProfile;
window.closeEditProfile = closeEditProfile;
window.saveProfileChanges = saveProfileChanges;
window.editAvatar = editAvatar;
window.editCoverPhoto = editCoverPhoto;
window.shareProfile = shareProfile;
window.viewSettings = viewSettings;
window.editPreferences = editPreferences;
window.addTravelGoal = addTravelGoal;
window.startTravelQuiz = startTravelQuiz;
window.closeTravelQuiz = closeTravelQuiz;
window.selectQuizAnswer = selectQuizAnswer;

console.log('🤝 Phase 1: User Profiles & Travel Preferences loaded successfully! 💖');

/* ============================================
   🔍 PHASE 2: TRAVEL BUDDY FINDER
   Matching System & Search
   ============================================ */

// Global Phase 2 variables
let allTravelers = [];
let filteredTravelers = [];
let displayedTravelers = [];
let travelersPerPage = 6;
let currentPage = 1;
let activeFilters = {
    route: 'all',
    date: '',
    travelStyle: 'all',
    ageGroup: 'all',
    gender: 'all',
    interests: [],
    verifiedOnly: false,
    travelingToday: false,
    highMatchOnly: false
};

// Sample travelers data
const SAMPLE_TRAVELERS = [
    {
        id: 1,
        name: 'Priya Sharma',
        photo: 'https://i.pravatar.cc/150?img=5',
        ageGroup: '25-34',
        gender: 'female',
        location: 'Solan, HP',
        travelStyle: 'social-butterfly',
        verified: true,
        online: true,
        memberSince: 'March 2024',
        totalTrips: 18,
        bio: 'Love meeting new people on every journey! Photography enthusiast and food lover.',
        interests: ['Photography', 'Food', 'Culture', 'Socializing'],
        favoriteRoutes: ['HT-101', 'HT-102'],
        travelingDate: '2025-11-03',
        travelingRoute: 'HT-101'
    },
    {
        id: 2,
        name: 'Arjun Mehta',
        photo: 'https://i.pravatar.cc/150?img=12',
        ageGroup: '25-34',
        gender: 'male',
        location: 'Dharampur, HP',
        travelStyle: 'solo-adventurer',
        verified: true,
        online: true,
        memberSince: 'January 2024',
        totalTrips: 32,
        bio: 'Solo traveler who enjoys peaceful mountain journeys and occasional conversations.',
        interests: ['Mountains', 'Reading', 'Nature', 'Photography'],
        favoriteRoutes: ['HT-101', 'HT-103', 'HT-105'],
        travelingDate: '2025-11-02',
        travelingRoute: 'HT-101'
    },
    {
        id: 3,
        name: 'Maya Krishnan',
        photo: 'https://i.pravatar.cc/150?img=9',
        ageGroup: '35-44',
        gender: 'female',
        location: 'Barog, HP',
        travelStyle: 'family-oriented',
        verified: true,
        online: false,
        memberSince: 'February 2024',
        totalTrips: 15,
        bio: 'Traveling with family, looking for other families to share experiences with!',
        interests: ['Family', 'Culture', 'Food', 'History'],
        favoriteRoutes: ['HT-102', 'HT-107'],
        travelingDate: '2025-11-05',
        travelingRoute: 'HT-102'
    },
    {
        id: 4,
        name: 'Vikram Patel',
        photo: 'https://i.pravatar.cc/150?img=13',
        ageGroup: '25-34',
        gender: 'male',
        location: 'Solan, HP',
        travelStyle: 'enthusiastic-explorer',
        verified: true,
        online: true,
        memberSince: 'April 2024',
        totalTrips: 27,
        bio: 'Adventure seeker! Always up for exploring new routes and hidden gems.',
        interests: ['Adventure', 'Mountains', 'Photography', 'Hiking'],
        favoriteRoutes: ['HT-103', 'HT-108'],
        travelingDate: '2025-11-02',
        travelingRoute: 'HT-103'
    },
    {
        id: 5,
        name: 'Neha Singh',
        photo: 'https://i.pravatar.cc/150?img=1',
        ageGroup: '18-24',
        gender: 'female',
        location: 'Dagshai, HP',
        travelStyle: 'thoughtful-traveler',
        verified: false,
        online: false,
        memberSince: 'May 2024',
        totalTrips: 8,
        bio: 'Deep conversations and scenic views. Looking for meaningful travel connections.',
        interests: ['Reading', 'Nature', 'Spirituality', 'Music'],
        favoriteRoutes: ['HT-104', 'HT-103'],
        travelingDate: '2025-11-10',
        travelingRoute: 'HT-104'
    },
    {
        id: 6,
        name: 'Raj Kumar',
        photo: 'https://i.pravatar.cc/150?img=8',
        ageGroup: '45-54',
        gender: 'male',
        location: 'Dharampur, HP',
        travelStyle: 'peaceful-observer',
        verified: true,
        online: false,
        memberSince: 'December 2023',
        totalTrips: 45,
        bio: 'Experienced traveler who enjoys the quiet beauty of mountain journeys.',
        interests: ['Nature', 'Photography', 'Relaxation', 'History'],
        favoriteRoutes: ['HT-101', 'HT-104', 'HT-106'],
        travelingDate: '2025-11-08',
        travelingRoute: 'HT-106'
    },
    {
        id: 7,
        name: 'Aditya Kumar',
        photo: 'https://i.pravatar.cc/150?img=14',
        ageGroup: '25-34',
        gender: 'male',
        location: 'Solan, HP',
        travelStyle: 'social-butterfly',
        verified: true,
        online: true,
        memberSince: 'January 2024',
        totalTrips: 22,
        bio: 'Making friends on every trip! Love sharing stories and travel tips.',
        interests: ['Socializing', 'Food', 'Music', 'Adventure'],
        favoriteRoutes: ['HT-102', 'HT-105'],
        travelingDate: '2025-11-03',
        travelingRoute: 'HT-102'
    },
    {
        id: 8,
        name: 'Sneha Reddy',
        photo: 'https://i.pravatar.cc/150?img=10',
        ageGroup: '25-34',
        gender: 'female',
        location: 'Barog, HP',
        travelStyle: 'solo-adventurer',
        verified: true,
        online: false,
        memberSince: 'March 2024',
        totalTrips: 19,
        bio: 'Solo female traveler. Open to meeting like-minded women travelers.',
        interests: ['Photography', 'Adventure', 'Nature', 'Culture'],
        favoriteRoutes: ['HT-101', 'HT-102', 'HT-103'],
        travelingDate: '2025-11-06',
        travelingRoute: 'HT-101'
    },
    {
        id: 9,
        name: 'Rohit Sharma',
        photo: 'https://i.pravatar.cc/150?img=15',
        ageGroup: '35-44',
        gender: 'male',
        location: 'Dharampur, HP',
        travelStyle: 'family-oriented',
        verified: true,
        online: true,
        memberSince: 'February 2024',
        totalTrips: 12,
        bio: 'Traveling with kids! Looking for family-friendly travel buddies.',
        interests: ['Family', 'Food', 'Culture', 'Relaxation'],
        favoriteRoutes: ['HT-105', 'HT-106'],
        travelingDate: '2025-11-04',
        travelingRoute: 'HT-105'
    },
    {
        id: 10,
        name: 'Kavya Iyer',
        photo: 'https://i.pravatar.cc/150?img=16',
        ageGroup: '25-34',
        gender: 'female',
        location: 'Solan, HP',
        travelStyle: 'enthusiastic-explorer',
        verified: false,
        online: false,
        memberSince: 'June 2024',
        totalTrips: 6,
        bio: 'New to Happy Trails but loving every journey! Open to adventures.',
        interests: ['Adventure', 'Photography', 'Food', 'Hiking'],
        favoriteRoutes: ['HT-101', 'HT-107'],
        travelingDate: '2025-11-12',
        travelingRoute: 'HT-107'
    },
    {
        id: 11,
        name: 'Manish Gupta',
        photo: 'https://i.pravatar.cc/150?img=11',
        ageGroup: '55+',
        gender: 'male',
        location: 'Dagshai, HP',
        travelStyle: 'peaceful-observer',
        verified: true,
        online: false,
        memberSince: 'October 2023',
        totalTrips: 56,
        bio: 'Retired and exploring. Enjoy peaceful journeys and historical sites.',
        interests: ['History', 'Culture', 'Relaxation', 'Nature'],
        favoriteRoutes: ['HT-103', 'HT-104', 'HT-108'],
        travelingDate: '2025-11-15',
        travelingRoute: 'HT-103'
    },
    {
        id: 12,
        name: 'Ananya Desai',
        photo: 'https://i.pravatar.cc/150?img=20',
        ageGroup: '18-24',
        gender: 'female',
        location: 'Dharampur, HP',
        travelStyle: 'social-butterfly',
        verified: true,
        online: true,
        memberSince: 'July 2024',
        totalTrips: 11,
        bio: 'College student exploring on weekends. Love meeting new people!',
        interests: ['Socializing', 'Music', 'Photography', 'Food'],
        favoriteRoutes: ['HT-101', 'HT-105'],
        travelingDate: '2025-11-02',
        travelingRoute: 'HT-101'
    }
];

// ============================================
// BUDDY FINDER INITIALIZATION
// ============================================

function initializeBuddyFinder() {
    // Load travelers data
    allTravelers = SAMPLE_TRAVELERS;
    filteredTravelers = [...allTravelers];
    
    // Calculate compatibility scores for each traveler
    calculateCompatibilityScores();
    
    // Render initial data
    renderTopRecommendations();
    renderTravelersGrid();
    updateBuddyStats();
    
    console.log('🔍 Buddy Finder initialized');
}

// ============================================
// COMPATIBILITY CALCULATION
// ============================================

function calculateCompatibilityScores() {
    if (!userProfile) return;
    
    allTravelers.forEach(traveler => {
        let score = 0;
        
        // Route match (25%)
        const routeMatch = traveler.favoriteRoutes.some(r => 
            userProfile.favoriteRoutes.includes(r)
        );
        score += routeMatch ? 25 : 0;
        
        // Interest match (20%)
        const sharedInterests = traveler.interests.filter(i => 
            userProfile.interests.includes(i)
        );
        const interestMatchPercent = (sharedInterests.length / Math.max(traveler.interests.length, userProfile.interests.length)) * 20;
        score += interestMatchPercent;
        
        // Travel style match (15%)
        const styleMatch = traveler.travelStyle === userProfile.travelStyleResult;
        score += styleMatch ? 15 : 10; // Partial credit if not exact match
        
        // Age group proximity (10%)
        const ageMatch = traveler.ageGroup === userProfile.ageGroup;
        score += ageMatch ? 10 : 5;
        
        // Verification bonus (10%)
        score += traveler.verified ? 10 : 0;
        
        // Experience level similarity (10%)
        const experienceDiff = Math.abs(traveler.totalTrips - userProfile.stats.totalTrips);
        const experienceScore = Math.max(0, 10 - (experienceDiff / 5));
        score += experienceScore;
        
        // Online bonus (5%)
        score += traveler.online ? 5 : 0;
        
        // Traveling soon bonus (5%)
        const today = new Date();
        const travelDate = new Date(traveler.travelingDate);
        const daysUntilTravel = Math.ceil((travelDate - today) / (1000 * 60 * 60 * 24));
        if (daysUntilTravel >= 0 && daysUntilTravel <= 7) {
            score += 5;
        }
        
        traveler.compatibilityScore = Math.min(Math.round(score), 99);
        traveler.sharedInterests = sharedInterests;
    });
    
    // Sort by compatibility
    allTravelers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderTopRecommendations() {
    const container = document.getElementById('topRecommendations');
    if (!container) return;
    
    // Get top 3 matches
    const topMatches = filteredTravelers.slice(0, 3);
    
    if (topMatches.length === 0) {
        container.innerHTML = `
            <div class="travelers-empty" style="grid-column: 1 / -1;">
                <div class="travelers-empty-icon">🔍</div>
                <h3>No recommendations yet</h3>
                <p>Complete your profile to get personalized buddy recommendations!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = topMatches.map((traveler, index) => 
        createTravelerCard(traveler, index === 0)
    ).join('');
}

function renderTravelersGrid() {
    const container = document.getElementById('travelersGrid');
    if (!container) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * travelersPerPage;
    const endIndex = startIndex + travelersPerPage;
    displayedTravelers = filteredTravelers.slice(0, endIndex);
    
    if (displayedTravelers.length === 0) {
        container.innerHTML = `
            <div class="travelers-empty" style="grid-column: 1 / -1;">
                <div class="travelers-empty-icon">😔</div>
                <h3>No travelers found</h3>
                <p>Try adjusting your filters to find more travel buddies!</p>
            </div>
        `;
        
        // Hide load more button
        document.getElementById('loadMoreContainer').style.display = 'none';
        return;
    }
    
    container.innerHTML = displayedTravelers.map(traveler => 
        createTravelerCard(traveler, false)
    ).join('');
    
    // Show/hide load more button
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = displayedTravelers.length < filteredTravelers.length ? 'block' : 'none';
    }
}

function createTravelerCard(traveler, isFeatured = false) {
    const travelStyleIcons = {
        'solo-adventurer': '🎒',
        'social-butterfly': '🎭',
        'peaceful-observer': '🧘',
        'enthusiastic-explorer': '🌟',
        'thoughtful-traveler': '📖',
        'family-oriented': '👨‍👩‍👧‍👦'
    };
    
    const travelStyleLabels = {
        'solo-adventurer': 'Solo Adventurer',
        'social-butterfly': 'Social Butterfly',
        'peaceful-observer': 'Peaceful Observer',
        'enthusiastic-explorer': 'Enthusiastic Explorer',
        'thoughtful-traveler': 'Thoughtful Traveler',
        'family-oriented': 'Family Oriented'
    };
    
    return `
        <div class="traveler-card ${isFeatured ? 'featured' : ''}" onclick="viewTravelerDetail(${traveler.id})">
            ${isFeatured ? '<div class="featured-badge"><i class="fas fa-crown"></i> Top Match</div>' : ''}
            
            <div class="traveler-card-header">
                <div class="traveler-avatar-wrapper">
                    <img src="${traveler.photo}" alt="${traveler.name}" class="traveler-avatar">
                    ${traveler.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                <div class="traveler-info">
                    <div class="traveler-name">
                        ${traveler.name}
                        ${traveler.verified ? '<i class="fas fa-check-circle verified-badge"></i>' : ''}
                    </div>
                    <div class="traveler-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${traveler.location}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-bus"></i>
                            ${traveler.totalTrips} trips
                        </div>
                    </div>
                    <div class="travel-style-badge">
                        ${travelStyleIcons[traveler.travelStyle]}
                        ${travelStyleLabels[traveler.travelStyle]}
                    </div>
                </div>
            </div>
            
            <div class="compatibility-section">
                <div class="compatibility-header">
                    <span class="compatibility-label">
                        <i class="fas fa-heart"></i>
                        Compatibility
                    </span>
                    <span class="compatibility-score">${traveler.compatibilityScore}%</span>
                </div>
                <div class="compatibility-bar">
                    <div class="compatibility-fill" style="width: ${traveler.compatibilityScore}%"></div>
                </div>
            </div>
            
            ${traveler.sharedInterests && traveler.sharedInterests.length > 0 ? `
                <div class="shared-interests">
                    <div class="shared-interests-title">
                        <i class="fas fa-heart"></i>
                        ${traveler.sharedInterests.length} Shared Interest${traveler.sharedInterests.length !== 1 ? 's' : ''}
                    </div>
                    <div class="interest-tags">
                        ${traveler.sharedInterests.map(interest => `
                            <span class="interest-tag-small">${interest}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="traveler-card-actions">
                <button class="traveler-action-btn connect-btn" onclick="event.stopPropagation(); sendConnectionRequest(${traveler.id})">
                    <i class="fas fa-user-plus"></i>
                    Connect
                </button>
                <button class="traveler-action-btn view-profile-btn" onclick="event.stopPropagation(); viewTravelerDetail(${traveler.id})">
                    <i class="fas fa-eye"></i>
                    View
                </button>
            </div>
        </div>
    `;
}

// ============================================
// FILTERING & SEARCH
// ============================================

function toggleFilters() {
    const container = document.getElementById('searchFiltersContainer');
    const btn = document.querySelector('.toggle-filters-btn');
    
    if (container.classList.contains('show')) {
        container.classList.remove('show');
        btn.classList.remove('active');
        btn.querySelector('span').textContent = 'Show Filters';
    } else {
        container.classList.add('show');
        btn.classList.add('active');
        btn.querySelector('span').textContent = 'Hide Filters';
    }
}

function applyBuddyFilters() {
    // Get filter values
    activeFilters.route = document.getElementById('filterRoute').value;
    activeFilters.date = document.getElementById('filterDate').value;
    activeFilters.travelStyle = document.getElementById('filterTravelStyle').value;
    activeFilters.ageGroup = document.getElementById('filterAgeGroup').value;
    activeFilters.gender = document.getElementById('filterGender').value;
    activeFilters.verifiedOnly = document.getElementById('filterVerified').checked;
    activeFilters.travelingToday = document.getElementById('filterTravelingToday').checked;
    activeFilters.highMatchOnly = document.getElementById('filterHighMatch').checked;
    
    // Get selected interests
    const interestsSelect = document.getElementById('filterInterests');
    activeFilters.interests = Array.from(interestsSelect.selectedOptions).map(opt => opt.value);
    
    // Apply filters
    filteredTravelers = allTravelers.filter(traveler => {
        // Route filter
        if (activeFilters.route !== 'all' && !traveler.favoriteRoutes.includes(activeFilters.route)) {
            return false;
        }
        
        // Date filter
        if (activeFilters.date && traveler.travelingDate !== activeFilters.date) {
            return false;
        }
        
        // Travel style filter
        if (activeFilters.travelStyle !== 'all' && traveler.travelStyle !== activeFilters.travelStyle) {
            return false;
        }
        
        // Age group filter
        if (activeFilters.ageGroup !== 'all' && traveler.ageGroup !== activeFilters.ageGroup) {
            return false;
        }
        
        // Gender filter
        if (activeFilters.gender !== 'all' && traveler.gender !== activeFilters.gender) {
            return false;
        }
        
        // Interests filter
        if (activeFilters.interests.length > 0) {
            const hasSharedInterest = activeFilters.interests.some(interest => 
                traveler.interests.includes(interest)
            );
            if (!hasSharedInterest) return false;
        }
        
        // Verified only
        if (activeFilters.verifiedOnly && !traveler.verified) {
            return false;
        }
        
        // Traveling today
        if (activeFilters.travelingToday) {
            const today = new Date().toISOString().split('T')[0];
            if (traveler.travelingDate !== today) return false;
        }
        
        // High match only
        if (activeFilters.highMatchOnly && traveler.compatibilityScore < 70) {
            return false;
        }
        
        return true;
    });
    
    // Reset pagination
    currentPage = 1;
    
    // Re-render
    renderTopRecommendations();
    renderTravelersGrid();
    updateBuddyStats();
    
    showToast(`Found ${filteredTravelers.length} matching traveler${filteredTravelers.length !== 1 ? 's' : ''}! 🔍`, 2000);
}

function resetBuddyFilters() {
    // Reset form
    document.getElementById('filterRoute').value = 'all';
    document.getElementById('filterDate').value = '';
    document.getElementById('filterTravelStyle').value = 'all';
    document.getElementById('filterAgeGroup').value = 'all';
    document.getElementById('filterGender').value = 'all';
    document.getElementById('filterInterests').selectedIndex = -1;
    document.getElementById('filterVerified').checked = false;
    document.getElementById('filterTravelingToday').checked = false;
    document.getElementById('filterHighMatch').checked = false;
    
    // Reset active filters
    activeFilters = {
        route: 'all',
        date: '',
        travelStyle: 'all',
        ageGroup: 'all',
        gender: 'all',
        interests: [],
        verifiedOnly: false,
        travelingToday: false,
        highMatchOnly: false
    };
    
    // Reset data
    filteredTravelers = [...allTravelers];
    currentPage = 1;
    
    // Re-render
    renderTopRecommendations();
    renderTravelersGrid();
    updateBuddyStats();
    
    showToast('Filters reset! 🔄', 2000);
}

function sortTravelers() {
    const sortBy = document.getElementById('sortBy').value;
    
    switch(sortBy) {
        case 'compatibility':
            filteredTravelers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
            break;
        case 'newest':
            filteredTravelers.sort((a, b) => new Date(b.memberSince) - new Date(a.memberSince));
            break;
        case 'trips':
            filteredTravelers.sort((a, b) => b.totalTrips - a.totalTrips);
            break;
        case 'online':
            filteredTravelers.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
            break;
    }
    
    currentPage = 1;
    renderTravelersGrid();
    
    showToast(`Sorted by ${sortBy}! 📊`, 2000);
}

function loadMoreTravelers() {
    currentPage++;
    renderTravelersGrid();
    
    // Scroll to newly loaded content
    const grid = document.getElementById('travelersGrid');
    if (grid) {
        const newCards = grid.children[displayedTravelers.length - travelersPerPage];
        if (newCards) {
            newCards.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// ============================================
// CONNECTION REQUESTS
// ============================================

function sendConnectionRequest(travelerId) {
    const traveler = allTravelers.find(t => t.id === travelerId);
    if (!traveler) return;
    
    const modal = document.getElementById('connectionModal');
    const modalBody = document.getElementById('connectionModalBody');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🤝</div>
            <h3 style="font-family: 'Dancing Script', cursive; font-size: 2rem; color: #F57F17; margin-bottom: 15px;">
                Connect with ${traveler.name}?
            </h3>
            <p style="color: #6C757D; line-height: 1.7; margin-bottom: 25px;">
                Send a connection request to start building your travel friendship!
                You'll be able to message once ${traveler.name} accepts.
            </p>
            
            <div style="background: rgba(255, 249, 230, 0.5); border-radius: 15px; padding: 20px; margin-bottom: 25px; text-align: left;">
                <div style="margin-bottom: 15px;">
                    <label style="font-weight: 600; color: #2C3E50; display: block; margin-bottom: 8px;">
                        Add a personal message (optional):
                    </label>
                    <textarea id="connectionMessage" 
                              style="width: 100%; padding: 12px; border: 2px solid #E9ECEF; border-radius: 12px; 
                                     font-family: inherit; resize: vertical; min-height: 80px;"
                              placeholder="Hi! I noticed we're traveling the same route. Would love to connect!"></textarea>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px;">
                <button class="btn-create-collection" onclick="confirmConnectionRequest(${travelerId})" style="flex: 1;">
                    <i class="fas fa-paper-plane"></i>
                    Send Request
                </button>
                <button class="btn-cancel" onclick="closeConnectionModal()" style="flex: 1;">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function confirmConnectionRequest(travelerId) {
    const traveler = allTravelers.find(t => t.id === travelerId);
    if (!traveler) return;
    
    const message = document.getElementById('connectionMessage').value;
    
    // Simulate sending request (in production, this would be an API call)
    closeConnectionModal();
    
    showToast(`Connection request sent to ${traveler.name}! 🤝`, 3000);
    
    // You could store this in localStorage or send to backend
    console.log('Connection request:', {
        to: travelerId,
        from: CURRENT_USER.name,
        message: message,
        timestamp: new Date().toISOString()
    });
}

function closeConnectionModal() {
    const modal = document.getElementById('connectionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// TRAVELER DETAIL VIEW
// ============================================

function viewTravelerDetail(travelerId) {
    const traveler = allTravelers.find(t => t.id === travelerId);
    if (!traveler) return;
    
    const modal = document.getElementById('travelerDetailModal');
    const modalBody = document.getElementById('travelerDetailBody');
    
    if (!modal || !modalBody) return;
    
    const travelStyleIcons = {
        'solo-adventurer': '🎒',
        'social-butterfly': '🎭',
        'peaceful-observer': '🧘',
        'enthusiastic-explorer': '🌟',
        'thoughtful-traveler': '📖',
        'family-oriented': '👨‍👩‍👧‍👦'
    };
    
    const travelStyleLabels = {
        'solo-adventurer': 'Solo Adventurer',
        'social-butterfly': 'Social Butterfly',
        'peaceful-observer': 'Peaceful Observer',
        'enthusiastic-explorer': 'Enthusiastic Explorer',
        'thoughtful-traveler': 'Thoughtful Traveler',
        'family-oriented': 'Family Oriented'
    };
    
    modalBody.innerHTML = `
        <div style="padding: 20px;">
            <!-- Profile Header -->
            <div style="display: flex; gap: 25px; margin-bottom: 30px; align-items: center;">
                <div style="position: relative;">
                    <img src="${traveler.photo}" alt="${traveler.name}" 
                         style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #FFD700; object-fit: cover;">
                    ${traveler.online ? '<div class="online-indicator" style="position: absolute; bottom: 5px; right: 5px;"></div>' : ''}
                </div>
                <div style="flex: 1;">
                    <h2 style="font-size: 2rem; color: #2C3E50; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        ${traveler.name}
                        ${traveler.verified ? '<i class="fas fa-check-circle" style="color: #32CD32;"></i>' : ''}
                    </h2>
                    <div style="color: #6C757D; margin-bottom: 10px; display: flex; gap: 20px; flex-wrap: wrap;">
                        <span><i class="fas fa-map-marker-alt"></i> ${traveler.location}</span>
                        <span><i class="fas fa-bus"></i> ${traveler.totalTrips} trips</span>
                        <span><i class="fas fa-calendar"></i> ${traveler.memberSince}</span>
                    </div>
                    <div class="travel-style-badge">
                        ${travelStyleIcons[traveler.travelStyle]}
                        ${travelStyleLabels[traveler.travelStyle]}
                    </div>
                </div>
            </div>
            
            <!-- Compatibility -->
            <div class="compatibility-section" style="margin-bottom: 25px;">
                <div class="compatibility-header">
                    <span class="compatibility-label">
                        <i class="fas fa-heart"></i>
                        Your Compatibility
                    </span>
                    <span class="compatibility-score">${traveler.compatibilityScore}%</span>
                </div>
                <div class="compatibility-bar">
                    <div class="compatibility-fill" style="width: ${traveler.compatibilityScore}%"></div>
                </div>
            </div>
            
            <!-- Bio -->
            <div style="background: rgba(255, 249, 230, 0.5); border-radius: 15px; padding: 20px; margin-bottom: 25px;">
                <h3 style="font-weight: 700; color: #2C3E50; margin-bottom: 10px;">
                    <i class="fas fa-info-circle"></i> About
                </h3>
                <p style="color: #6C757D; line-height: 1.7;">${traveler.bio}</p>
            </div>
            
            <!-- Interests -->
            <div style="margin-bottom: 25px;">
                <h3 style="font-weight: 700; color: #2C3E50; margin-bottom: 15px;">
                    <i class="fas fa-heart"></i> Interests
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${traveler.interests.map(interest => {
                        const isShared = traveler.sharedInterests && traveler.sharedInterests.includes(interest);
                        return `
                            <span class="interest-tag" style="${isShared ? 'background: rgba(50, 205, 50, 0.2); border-color: #32CD32; color: #228B22;' : ''}">
                                ${isShared ? '✓ ' : ''}${interest}
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Favorite Routes -->
            <div style="margin-bottom: 25px;">
                <h3 style="font-weight: 700; color: #2C3E50; margin-bottom: 15px;">
                    <i class="fas fa-route"></i> Favorite Routes
                </h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${traveler.favoriteRoutes.map(route => `
                        <span class="route-tag">${route}</span>
                    `).join('')}
                </div>
            </div>
            
            <!-- Next Trip -->
            ${traveler.travelingDate ? `
                <div style="background: linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(147, 112, 219, 0.1)); 
                            border-radius: 15px; padding: 20px; margin-bottom: 25px; border: 2px solid rgba(138, 43, 226, 0.3);">
                    <h3 style="font-weight: 700; color: #8A2BE2; margin-bottom: 10px;">
                        <i class="fas fa-calendar-alt"></i> Next Trip
                    </h3>
                    <p style="color: #2C3E50; font-size: 1.1rem;">
                        <strong>${traveler.travelingRoute}</strong> on ${new Date(traveler.travelingDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>
            ` : ''}
            
            <!-- Actions -->
            <div style="display: flex; gap: 15px;">
                <button class="btn-create-collection" onclick="sendConnectionRequest(${traveler.id}); closeTravelerDetail();" style="flex: 1;">
                    <i class="fas fa-user-plus"></i>
                    Send Connection Request
                </button>
                <button class="btn-cancel" onclick="closeTravelerDetail()" style="flex: 1;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeTravelerDetail() {
    const modal = document.getElementById('travelerDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// ADDITIONAL FEATURES
// ============================================

function findMyMatch() {
    showToast('Finding your perfect match... 🔍', 2000);
    
    setTimeout(() => {
        // Get highest compatibility traveler
        const topMatch = filteredTravelers[0];
        if (topMatch) {
            viewTravelerDetail(topMatch.id);
        } else {
            showToast('Complete your profile for better matches! 📋', 3000);
        }
    }, 1000);
}

function saveSearch() {
    const searchData = {
        filters: activeFilters,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const savedSearches = JSON.parse(localStorage.getItem('happytrails_saved_searches') || '[]');
    savedSearches.push(searchData);
    localStorage.setItem('happytrails_saved_searches', JSON.stringify(savedSearches));
    
    showToast('Search saved! 💾', 2000);
}

function updateBuddyStats() {
    // Update stats at top
    const onlineCount = allTravelers.filter(t => t.online).length;
    const today = new Date().toISOString().split('T')[0];
    const travelingTodayCount = allTravelers.filter(t => t.travelingDate === today).length;
    const yourMatchesCount = filteredTravelers.filter(t => t.compatibilityScore >= 60).length;
    const topMatchScore = filteredTravelers.length > 0 ? filteredTravelers[0].compatibilityScore : 0;
    
    const travelersOnlineEl = document.getElementById('travelersOnline');
    const travelingTodayEl = document.getElementById('travelingToday');
    const yourMatchesEl = document.getElementById('yourMatches');
    const topMatchEl = document.getElementById('topMatch');
    
    if (travelersOnlineEl) travelersOnlineEl.textContent = onlineCount;
    if (travelingTodayEl) travelingTodayEl.textContent = travelingTodayCount;
    if (yourMatchesEl) yourMatchesEl.textContent = yourMatchesCount;
    if (topMatchEl) topMatchEl.textContent = topMatchScore + '%';
}

// ============================================
// UPDATE MAIN INITIALIZATION
// ============================================

// Update the main initialization
const originalInitTravelCompanions = initializeTravelCompanions;
initializeTravelCompanions = function() {
    originalInitTravelCompanions();
    
    // Initialize buddy finder when tab is clicked
    const buddiesTab = document.querySelector('[data-tab="find-buddies"]');
    if (buddiesTab) {
        buddiesTab.addEventListener('click', function() {
            // Check if already initialized
            if (allTravelers.length === 0) {
                initializeBuddyFinder();
            }
        });
    }
};

// Make functions globally accessible
window.toggleFilters = toggleFilters;
window.applyBuddyFilters = applyBuddyFilters;
window.resetBuddyFilters = resetBuddyFilters;
window.sortTravelers = sortTravelers;
window.loadMoreTravelers = loadMoreTravelers;
window.sendConnectionRequest = sendConnectionRequest;
window.confirmConnectionRequest = confirmConnectionRequest;
window.closeConnectionModal = closeConnectionModal;
window.viewTravelerDetail = viewTravelerDetail;
window.closeTravelerDetail = closeTravelerDetail;
window.findMyMatch = findMyMatch;
window.saveSearch = saveSearch;

console.log('🔍 Phase 2: Travel Buddy Finder & Matching System loaded successfully! 💖');

/* ============================================
   📖 PHASE 3: TRAVELER'S TALES
   Story Sharing & Reading
   ============================================ */

// Global Phase 3 variables
let allStories = [];
let filteredStories = [];
let displayedStories = [];
let storiesPerPage = 6;
let currentStoriesPage = 1;
let activeCategory = 'all';
let userStories = [];

// Sample stories data
const SAMPLE_STORIES = [
    {
        id: 1,
        title: 'Sunrise at 10,000 Feet: A Journey of Self-Discovery',
        subtitle: 'How a simple bus ride changed my perspective on life',
        content: `It was 5:30 AM when I boarded the HT-101 from Dharampur. The morning mist clung to the mountains like a soft blanket, and I was the only passenger crazy enough to take the first bus.

As we climbed higher, something magical happened. The sun began to rise, painting the sky in shades of orange and pink I'd never seen before. Our driver, an elderly gentleman named Ram Singh, pulled over at a viewpoint without me asking.

"First time on this route?" he asked with a knowing smile.

I nodded, unable to speak, tears streaming down my face. Not from sadness, but from the overwhelming beauty of it all. In that moment, at 10,000 feet above sea level, I realized I'd been living my entire life at ground level - afraid to climb, afraid to see what lay beyond.

Ram Singh shared his chai with me. We sat in silence, watching the world wake up. He told me he'd been driving this route for 30 years and never got tired of this view.

"The mountains teach us patience," he said. "They were here before us, and they'll be here long after. All our worries? They're just clouds passing by."

That sunrise changed me. I went back to the city a different person - calmer, more grateful, ready to climb my own mountains.`,
        route: 'HT-101',
        category: 'life-changing',
        author: {
            name: 'Priya Sharma',
            avatar: 'https://i.pravatar.cc/150?img=5',
            id: 1
        },
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        publishDate: '2025-10-15',
        readTime: 8,
        likes: 234,
        comments: 45,
        bookmarked: false,
        featured: true,
        kavlinsPick: true,
        views: 1245
    },
    {
        id: 2,
        title: 'The Chai Wallah Who Saved My Day',
        subtitle: 'A heartwarming encounter at Barog station',
        content: `I missed my connecting bus at Barog. Typical me - always running late. I sat on a bench, frustrated and hungry, when an elderly chai wallah approached me.

"Beta, you look troubled. Have some chai," he said, handing me a steaming cup.

I tried to pay, but he refused. "First cup is always free for troubled souls," he smiled.

We got talking. He'd been selling chai at this station for 40 years. He'd seen thousands of travelers - happy, sad, lost, found. He told me stories of people he'd met, lives he'd touched with just a cup of tea.

"You know what I've learned?" he asked. "Life is like this chai. Sometimes too hot, sometimes too sweet, sometimes bitter. But you drink it anyway, because the warmth matters more than the taste."

That wisdom from a chai wallah taught me more than any self-help book ever could.

When my bus finally arrived, he waved goodbye like an old friend. I still think about him every time I drink chai.

Three months later, I went back to thank him. He'd passed away the week before. His son now runs the stall. He told me his father always said, "Every cup of chai is a prayer for safe travels."

I cried. For a stranger who became a friend. For wisdom shared over a clay cup. For the reminder that kindness lives in the smallest gestures.`,
        route: 'HT-102',
        category: 'spiritual',
        author: {
            name: 'Arjun Mehta',
            avatar: 'https://i.pravatar.cc/150?img=12',
            id: 2
        },
        image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
        publishDate: '2025-10-20',
        readTime: 6,
        likes: 189,
        comments: 32,
        bookmarked: false,
        featured: true,
        kavlinsPick: true,
        views: 892
    },
    {
        id: 3,
        title: 'When My Mother Finally Smiled',
        subtitle: 'A family healing journey through the mountains',
        content: `My mother hadn't smiled in three years. Not since Dad passed away. She'd become a shadow of herself - going through the motions but not really living.

I surprised her with tickets on the HT-105 Deluxe route. "Just one day," I pleaded. "One day in the mountains with me."

She agreed reluctantly. For the first hour, she stared out the window, silent. Then, slowly, something changed.

A little girl in the seat ahead started singing "Paharon ki rani, Paharon ki rani." My mother's lips moved. She was mouthing the words - a song she used to sing to me.

At Kasauli viewpoint, we got off for photos. The wind whipped through her hair, and for the first time in years, she laughed. Really laughed.

"Your father proposed to me at a viewpoint just like this," she said, tears in her eyes. But they were happy tears.

We spent the day talking - really talking - for the first time since his death. She told me stories about their travels together, dreams they'd shared, places they'd promised to visit.

"He'd want me to keep traveling," she said as we boarded the bus back. "He'd want me to keep living."

That bus ride gave me my mother back. The mountains healed what grief had broken.

Now we travel together every month. She's planning a solo trip to Manali next spring. She's 65 and discovering herself again.

Dad would be proud.`,
        route: 'HT-105',
        category: 'family',
        author: {
            name: 'Rahul Verma',
            avatar: 'https://i.pravatar.cc/150?img=14',
            id: 4
        },
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        publishDate: '2025-10-25',
        readTime: 7,
        likes: 456,
        comments: 89,
        bookmarked: false,
        featured: true,
        kavlinsPick: true,
        views: 2134
    },
    {
        id: 4,
        title: 'I Proposed on a Moving Bus (And She Said Yes!)',
        subtitle: 'The most unconventional proposal ever',
        content: `Everyone said I was crazy. "Propose on a bus? Are you insane?"

But Neha and I had our first conversation on a Happy Trails bus. We'd met on HT-101, became friends, fell in love - all while traveling these routes together.

So yes, I was going to propose on a bus.

I coordinated with the driver (thank you, Suresh bhai!), the conductor, even some regular passengers. Operation Bus Proposal was underway.

As we approached the tunnel near Barog, the lights dimmed (as planned). Neha looked confused.

Then, the passengers started singing "Tum Hi Ho" - off-key, enthusiastic, perfect.

She looked at me. I was on one knee in the aisle, ring in hand, nervous as hell.

"Neha, we've traveled hundreds of kilometers together. Can we travel the rest of life together too?"

She laughed. Then cried. Then said YES!

The entire bus erupted in cheers. Strangers were hugging, crying, taking photos. The driver honked the horn non-stop.

We got free chai at the next stop. Passengers gave us blessings, advice, and one aunty ji insisted on feeding us laddoos she'd packed.

That evening, we had 47 unofficial "wedding guests" - all fellow passengers who witnessed our engagement.

Best. Proposal. Ever.

P.S. We're getting married next month. And yes, we've invited Suresh bhai and the entire crew!`,
        route: 'HT-101',
        category: 'romance',
        author: {
            name: 'Vikram Patel',
            avatar: 'https://i.pravatar.cc/150?img=13',
            id: 4
        },
        image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800',
        publishDate: '2025-10-28',
        readTime: 5,
        likes: 567,
        comments: 123,
        bookmarked: false,
        featured: false,
        kavlinsPick: false,
        views: 3456
    },
    {
        id: 5,
        title: 'The Day I Lost My Luggage and Found Myself',
        subtitle: 'Solo travel adventures and misadventures',
        content: `They say solo travel is empowering. They don't mention it can also be terrifying.

I was on my first solo trip, clutching my backpack like a lifeline. At Solan, I got off to buy samosas. The bus left. With my luggage.

Panic. Pure panic.

I stood there, alone in an unknown town, no clothes, no toiletries, no plan. Just me, my phone, and a bag of samosas.

A local shopkeeper saw my tears. "First time solo?" she asked.

I nodded, embarrassed. She made me sit, gave me water, called the bus company. "Your bag will be at the next stop. You can catch the evening bus."

I had five hours to kill in Solan. She convinced me to explore instead of sulking.

Those five hours changed everything. I wandered narrow lanes, ate street food (best pakoras EVER), talked to locals, visited a tiny temple, bought handicrafts.

I wasn't a tourist following an itinerary. I was a traveler, experiencing life.

When I finally got my bag back, I realized I hadn't needed it at all. The best part of my trip was the unplanned detour.

Now I travel with a tiny backpack and a huge sense of adventure. Because sometimes you need to lose your luggage to find yourself.`,
        route: 'HT-102',
        category: 'solo-travel',
        author: {
            name: 'Neha Singh',
            avatar: 'https://i.pravatar.cc/150?img=1',
            id: 5
        },
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        publishDate: '2025-10-30',
        readTime: 6,
        likes: 298,
        comments: 67,
        bookmarked: false,
        featured: false,
        kavlinsPick: false,
        views: 1567
    },
    {
        id: 6,
        title: 'The Monkey That Stole My Lunch (And My Heart)',
        subtitle: 'When wildlife encounters go hilariously wrong',
        content: `I was warned about monkeys. "Don't eat outside," they said. "Keep your bags closed," they said.

Did I listen? Of course not.

I was having a peaceful lunch at Kasauli viewpoint - sandwich in one hand, phone in the other, taking selfies like a basic tourist.

Then HE appeared. A monkey. Not just any monkey - a CHONKY boy. He looked at my sandwich. I looked at him. Time froze.

"Shoo," I said weakly.

He tilted his head. "That's cute," his expression said. "Now gimme the sandwich."

What happened next was pure chaos. He grabbed my sandwich. I grabbed it back. He grabbed my bag. I screamed. He screamed (do monkeys scream? This one did).

Other tourists were filming. No one helped. EVERYONE WAS FILMING.

The monkey won. He ran away with my sandwich, chips, AND my dignity. He sat on a tree, eating MY lunch, making eye contact the whole time.

But here's the thing - it was hilarious. I laughed until I cried. Other tourists shared their food with me. We bonded over monkey warfare stories.

That chonky monkey taught me not to take life too seriously. Sometimes you lose your lunch. Sometimes life is absurd. Laugh anyway.

I named him Gerald. If you visit Kasauli, say hi to Gerald for me. And hide your sandwiches.`,
        route: 'HT-103',
        category: 'funny',
        author: {
            name: 'Aditya Kumar',
            avatar: 'https://i.pravatar.cc/150?img=14',
            id: 7
        },
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
        publishDate: '2025-11-01',
        readTime: 4,
        likes: 789,
        comments: 234,
        bookmarked: false,
        featured: false,
        kavlinsPick: true,
        views: 4567
    },
    {
        id: 7,
        title: 'The Temple Bell That Rings for Love',
        subtitle: 'A spiritual encounter at Dagshai',
        content: `There's an old temple near Dagshai that locals say grants wishes. I didn't believe in such things.

But I was heartbroken, directionless, and the bus stopped there anyway. So I walked up.

An old priest was ringing the bell. Each ring echoed through the mountains, clear and pure.

"Ring it three times," he told me. "Once for what was, once for what is, once for what will be."

I rang the bell. The first ring was for my lost love - painful but necessary. The second was for my present confusion - accepting where I was. The third...

The third ring felt different. Hopeful. Like a promise.

"Love returns," the priest said simply. "Not always as we expect, but it returns."

Three months later, I met Maya. We were both regular Happy Trails travelers. We bonded over mountain stories and chai.

Last week, she told me she loved me.

I took her to that temple. We rang the bell together - three times.

Once for what was, once for what is, once for what will be.

The priest remembered me. He smiled.

"I told you," he said. "Love always returns."`,
        route: 'HT-103',
        category: 'spiritual',
        author: {
            name: 'Karan Malhotra',
            avatar: 'https://i.pravatar.cc/150?img=11',
            id: 8
        },
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
        publishDate: '2025-11-02',
        readTime: 5,
        likes: 345,
        comments: 78,
        bookmarked: false,
        featured: false,
        kavlinsPick: false,
        views: 1890
    },
    {
        id: 8,
        title: 'Maggi at Midnight: A Foodie\'s Mountain Adventure',
        subtitle: 'Finding the best roadside food on HT routes',
        content: `I'm a food blogger, and I've eaten at Michelin-starred restaurants worldwide.

But the best meal I ever had? Maggi at a roadside dhaba at midnight, somewhere between Solan and Barog.

Our bus broke down (classic adventure, right?). Instead of panicking, our driver suggested we all walk to a nearby dhaba.

Picture this: 20 strangers at midnight, sitting on plastic chairs under the stars, eating Maggi and pakoras.

The dhaba owner, Sharma ji, made us special "mountain-style" Maggi with extra butter, cheese, and love. He told us stories of travelers he'd fed over 30 years.

We sang songs. A couple shared their anniversary cake. Someone played guitar. It became a spontaneous party.

That Maggi - simple, cheap, roadside Maggi - tasted like happiness.

I've tried to recreate it at home. I can't. Because it wasn't about the food.

It was about the moment. The mountains. The strangers who became friends. The driver who turned a breakdown into an adventure.

Food tastes better when seasoned with good company.

P.S. I still visit Sharma ji's dhaba. He never charges me for Maggi. "Food critics get free food," he says with a wink. "Friends eat free."`,
        route: 'HT-102',
        category: 'food-culture',
        author: {
            name: 'Sneha Reddy',
            avatar: 'https://i.pravatar.cc/150?img=10',
            id: 8
        },
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        publishDate: '2025-11-03',
        readTime: 6,
        likes: 412,
        comments: 95,
        bookmarked: false,
        featured: false,
        kavlinsPick: true,
        views: 2345
    },
    {
        id: 9,
        title: 'My Son\'s First Mountain: A Father\'s Joy',
        subtitle: 'Introducing the next generation to travel',
        content: `My son is 5. Yesterday, I took him on his first mountain bus ride.

He'd been begging for months. "Papa, when can I see the mountains? The REAL mountains?"

We boarded HT-105 early morning. He was glued to the window, eyes wide with wonder.

"Papa, why are the mountains wearing clouds?"
"Papa, can we touch the sky from here?"
"Papa, do gods really live up there?"

Every question was a poem. Every reaction was pure joy.

When we reached the highest point, he asked to get off. We stood at the viewpoint, his tiny hand in mine.

"This is the biggest thing I've ever seen," he whispered.

I realized he wasn't talking about the mountains. He was talking about the world - suddenly so much bigger than his bedroom, his school, his playground.

On the way back, he fell asleep on my lap. I looked at his peaceful face and thought about my own father, who first brought me to these mountains 30 years ago.

This is how traditions begin. This is how love for travel passes from one generation to the next.

Someday, my son will bring his children here. He'll tell them, "This is where Dadu first showed me the mountains."

And the circle will continue.`,
        route: 'HT-105',
        category: 'family',
        author: {
            name: 'Rohit Sharma',
            avatar: 'https://i.pravatar.cc/150?img=15',
            id: 9
        },
        image: 'https://images.unsplash.com/photo-1476304884326-cd2c88572c5f?w=800',
        publishDate: '2025-11-03',
        readTime: 5,
        likes: 523,
        comments: 112,
        bookmarked: false,
        featured: false,
        kavlinsPick: false,
        views: 2890
    },
    {
        id: 10,
        title: 'The 70-Year-Old Solo Traveler Who Inspired Me',
        subtitle: 'Age is just a number when it comes to adventure',
        content: `I met Mrs. Lakshmi on HT-104. She was 70, traveling alone with just a small bag.

"Where are you headed?" I asked.

"Everywhere," she smiled. "I have time now."

She told me her story. After her husband passed, her children wanted her to "settle down" - meaning stop living.

"I settled down for 50 years," she said. "Raised kids, managed a home, took care of everyone. Now it's my turn."

She travels every week. Different routes, different places. She's made friends on every bus, tried every local food, collected stories like souvenirs.

"But aren't you afraid?" I asked. "Traveling alone at your age?"

She laughed. "Beta, I lived through partition, raised four kids on one salary, fought cancer twice. A bus ride doesn't scare me."

She showed me her journal - pages filled with sketches, pressed flowers, ticket stubs, memories.

"Life doesn't end at retirement," she said. "It begins."

I was 28 and making excuses for not traveling. Too busy. Too broke. Too scared.

She was 70 and finding reasons to explore. So much time. So much world. So much life.

We exchanged numbers. She texts me photos from her trips with captions like "Still not settling down!"

If Mrs. Lakshmi can travel at 70, what's stopping you?`,
        route: 'HT-104',
        category: 'life-changing',
        author: {
            name: 'Kavya Iyer',
            avatar: 'https://i.pravatar.cc/150?img=16',
            id: 10
        },
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
        publishDate: '2025-11-03',
        readTime: 6,
        likes: 678,
        comments: 145,
        bookmarked: false,
        featured: false,
        kavlinsPick: true,
        views: 3678
    },
    {
        id: 11,
        title: 'The Accident That Changed Everything',
        subtitle: 'A close call that reminded me what matters',
        content: `We almost didn't make it.

A landslide on HT-108. Rocks the size of cars tumbling down. Our driver swerved, passengers screamed, time slowed down.

We stopped inches from the edge. INCHES.

For 10 seconds, nobody spoke. We were frozen, processing how close we'd come to...

Then someone started crying. Then laughing. Then we were all crying and laughing together.

Strangers hugged. Numbers were exchanged. "Stay in touch," everyone said. And meant it.

The bus was stuck for 3 hours. We couldn't go forward or back. Just... wait.

But something beautiful happened. We talked. REALLY talked.

About dreams we'd postponed. Calls we'd forgotten to make. I-love-yous we'd assumed could wait.

One man called his estranged brother, right there, in front of everyone. "I'm sorry," he said. "Life's too short for this."

Another woman decided to quit her job and start the business she'd dreamed about.

I realized I'd been living on autopilot, taking tomorrow for granted.

When we finally got moving, nobody complained about the delay. We were grateful for the reminder.

Life doesn't wait. Dreams don't wait. Love doesn't wait.

Whatever you've been postponing - do it now.`,
        route: 'HT-108',
        category: 'life-changing',
        author: {
            name: 'Manish Gupta',
            avatar: 'https://i.pravatar.cc/150?img=11',
            id: 11
        },
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        publishDate: '2025-11-03',
        readTime: 7,
        likes: 891,
        comments: 189,
        bookmarked: false,
        featured: false,
        kavlinsPick: false,
        views: 4234
    },
    {
        id: 12,
        title: 'Dancing in the Rain: An Unexpected Adventure',
        subtitle: 'When monsoon turns a journey into magic',
        content: `The forecast said "light drizzle." The sky said "LOL NO."

Torrential rain hit our bus on HT-106. The kind that turns roads into rivers.

We had to stop and wait it out. The driver announced we'd be there for at least an hour.

That's when the magic happened.

A girl in the back started playing "Baarish" on her phone. Another girl started singing. Then we ALL started singing.

Then someone said, "Screw it, let's dance!"

And we did. In the rain. On the side of a mountain road. Twenty strangers dancing to Bollywood songs, soaking wet, not caring.

An elderly couple did a slow dance. A kid showed us his TikTok moves. Our driver joined in with classical moves that put us all to shame.

We were cold, wet, and having the time of our lives.

A passing truck stopped. The drivers got out and danced with us.

Someone had pakoras in their bag. They got shared. Wet pakoras. Still delicious.

When the rain finally stopped, nobody wanted to leave. We'd created a moment of pure, unfiltered joy.

Now, whenever it rains, I smile. Because I remember the day I danced in a downpour with strangers who became friends.

Life isn't about waiting for the storm to pass. It's about learning to dance in the rain.`,
        route: 'HT-106',
        category: 'mountain-adventures',
        author: {
            name: 'Ananya Desai',
            avatar: 'https://i.pravatar.cc/150?img=20',
            id: 12
        },
        image: 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=800',
        publishDate: '2025-11-03',
        readTime: 5,
        likes: 756,
        comments: 167,
        bookmarked: false,
        featured: false,
        kavlinsPick: true,
        views: 3890
    }
];

// Category labels and icons
const STORY_CATEGORIES = {
    'mountain-adventures': { label: 'Mountain Adventures', icon: '🏔️' },
    'romance': { label: 'Romance & Connection', icon: '💑' },
    'funny': { label: 'Funny Moments', icon: '😂' },
    'spiritual': { label: 'Spiritual Journeys', icon: '🙏' },
    'food-culture': { label: 'Food & Culture', icon: '🍜' },
    'solo-travel': { label: 'Solo Travel', icon: '🎒' },
    'family': { label: 'Family Tales', icon: '👨‍👩‍👧‍👦' },
    'life-changing': { label: 'Life Changing', icon: '🌟' }
};

// ============================================
// TRAVELER'S TALES INITIALIZATION
// ============================================

function initializeTravelersTales() {
    // Load stories data
    allStories = SAMPLE_STORIES;
    filteredStories = [...allStories];
    
    // Load user stories from localStorage
    loadUserStories();
    
    // Render initial data
    renderFeaturedStories();
    renderStoriesGrid();
    updateTalesStats();
    
    // Setup form character counters
    setupStoryFormCounters();
    
    console.log('📖 Traveler\'s Tales initialized');
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderFeaturedStories() {
    const container = document.getElementById('featuredStoriesCarousel');
    if (!container) return;
    
    const featuredStories = allStories.filter(s => s.featured).slice(0, 3);
    
    if (featuredStories.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6C757D;">
                <p>No featured stories yet. Be the first to share your tale!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = featuredStories.map(story => createStoryCard(story, true)).join('');
}

function renderStoriesGrid() {
    const container = document.getElementById('storiesGrid');
    if (!container) return;
    
    // Calculate pagination
    const startIndex = (currentStoriesPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;
    displayedStories = filteredStories.slice(0, endIndex);
    
    if (displayedStories.length === 0) {
        container.innerHTML = `
            <div class="travelers-empty" style="grid-column: 1 / -1;">
                <div class="travelers-empty-icon">📖</div>
                <h3>No stories found</h3>
                <p>Try adjusting your filters or be the first to share a story!</p>
            </div>
        `;
        
        document.getElementById('loadMoreTales').style.display = 'none';
        return;
    }
    
    container.innerHTML = displayedStories.map(story => createStoryCard(story, false)).join('');
    
    // Show/hide load more button
    const loadMoreContainer = document.getElementById('loadMoreTales');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = displayedStories.length < filteredStories.length ? 'block' : 'none';
    }
}

function createStoryCard(story, isFeatured = false) {
    const category = STORY_CATEGORIES[story.category];
    const dateStr = new Date(story.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    return `
        <div class="story-card ${isFeatured ? 'featured' : ''}" onclick="viewStoryDetail(${story.id})">
            <div class="story-image-container">
                ${story.kavlinsPick ? '<div class="story-featured-badge"><i class="fas fa-crown"></i> Kavlin\'s Pick</div>' : ''}
                <img src="${story.image}" alt="${story.title}" class="story-image">
                <div class="story-category-badge">
                    ${category.icon} ${category.label}
                </div>
            </div>
            <div class="story-card-body">
                <h3 class="story-title">${story.title}</h3>
                <p class="story-subtitle">${story.subtitle}</p>
                
                <div class="story-author-info">
                    <img src="${story.author.avatar}" alt="${story.author.name}" class="story-author-avatar">
                    <div class="story-author-details">
                        <div class="story-author-name">${story.author.name}</div>
                        <div class="story-publish-date">${dateStr} · ${story.readTime} min read</div>
                    </div>
                </div>
                
                <div class="story-meta">
                    <div class="story-meta-left">
                        <div class="story-meta-item">
                            <i class="fas fa-heart"></i>
                            <span>${story.likes}</span>
                        </div>
                        <div class="story-meta-item">
                            <i class="fas fa-comment"></i>
                            <span>${story.comments}</span>
                        </div>
                        <div class="story-meta-item">
                            <i class="fas fa-eye"></i>
                            <span>${story.views}</span>
                        </div>
                    </div>
                    <div class="story-route-tag">${story.route}</div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// STORY DETAIL VIEW
// ============================================

function viewStoryDetail(storyId) {
    const story = allStories.find(s => s.id === storyId);
    if (!story) return;
    
    const modal = document.getElementById('storyDetailModal');
    const modalBody = document.getElementById('storyDetailBody');
    
    if (!modal || !modalBody) return;
    
    const category = STORY_CATEGORIES[story.category];
    const dateStr = new Date(story.publishDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Split content into paragraphs
    const paragraphs = story.content.split('\n\n').filter(p => p.trim());
    
    modalBody.innerHTML = `
        <div style="position: relative;">
            <!-- Header Image -->
            <div style="position: relative; height: 400px; overflow: hidden; border-radius: 25px 25px 0 0;">
                <img src="${story.image}" alt="${story.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;">
                ${story.kavlinsPick ? `
                    <div style="position: absolute; top: 20px; left: 20px; background: linear-gradient(135deg, #FFD700, #FF8C00); 
                                color: white; padding: 8px 16px; border-radius: 20px; font-weight: 700; display: flex; 
                                align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);">
                        <i class="fas fa-crown"></i>
                        Kavlin's Pick
                    </div>
                ` : ''}
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
                <!-- Category & Route -->
                <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                    <span style="background: rgba(255, 99, 71, 0.2); border: 2px solid #FF6347; color: #DC143C; 
                                 padding: 6px 14px; border-radius: 15px; font-size: 0.85rem; font-weight: 600; 
                                 display: inline-flex; align-items: center; gap: 6px;">
                        ${category.icon} ${category.label}
                    </span>
                    <span style="background: rgba(255, 215, 0, 0.2); border: 2px solid #FFD700; color: #F57F17; 
                                 padding: 6px 14px; border-radius: 15px; font-size: 0.85rem; font-weight: 600;">
                        ${story.route}
                    </span>
                </div>
                
                <!-- Title -->
                <h1 style="font-family: 'Dancing Script', cursive; font-size: 2.8rem; color: #2C3E50; 
                           margin-bottom: 15px; line-height: 1.3;">
                    ${story.title}
                </h1>
                
                <!-- Subtitle -->
                <p style="font-size: 1.3rem; color: #6C757D; margin-bottom: 25px; font-weight: 500;">
                    ${story.subtitle}
                </p>
                
                <!-- Author Info -->
                <div style="display: flex; align-items: center; gap: 15px; padding-bottom: 25px; 
                            border-bottom: 2px solid rgba(255, 99, 71, 0.2); margin-bottom: 30px;">
                    <img src="${story.author.avatar}" alt="${story.author.name}" 
                         style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid #FF6347; object-fit: cover;">
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #2C3E50; font-size: 1.1rem; margin-bottom: 5px;">
                            ${story.author.name}
                        </div>
                        <div style="color: #6C757D; font-size: 0.9rem;">
                            ${dateStr} · ${story.readTime} min read
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center; color: #6C757D; font-size: 0.9rem;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-eye"></i>
                            <span>${story.views}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-heart"></i>
                            <span>${story.likes}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-comment"></i>
                            <span>${story.comments}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Story Content -->
                <div style="color: #2C3E50; line-height: 1.9; font-size: 1.1rem;">
                    ${paragraphs.map(p => `<p style="margin-bottom: 25px;">${p}</p>`).join('')}
                </div>
                
                <!-- Actions -->
                <div style="display: flex; gap: 15px; margin-top: 40px; padding-top: 30px; 
                            border-top: 2px solid rgba(255, 99, 71, 0.2);">
                    <button class="btn-create-collection" onclick="likeStory(${story.id})" style="flex: 1;">
                        <i class="fas fa-heart"></i>
                        Like Story (${story.likes})
                    </button>
                    <button class="btn-save-draft" onclick="bookmarkStory(${story.id})" style="flex: 1;">
                        <i class="fas fa-bookmark"></i>
                        Bookmark
                    </button>
                    <button class="btn-cancel" onclick="shareStory(${story.id})" style="flex: 1;">
                        <i class="fas fa-share-alt"></i>
                        Share
                    </button>
                </div>
                
                <!-- Comments Section -->
                <div style="margin-top: 50px;">
                    <h3 style="font-family: 'Caveat', cursive; font-size: 2rem; color: #F57F17; margin-bottom: 20px;">
                        <i class="fas fa-comments"></i>
                        Comments (${story.comments})
                    </h3>
                    <div style="background: rgba(255, 249, 230, 0.5); border-radius: 15px; padding: 30px; text-align: center;">
                        <p style="color: #6C757D;">Comments feature coming in Phase 4! 💬</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Increment view count (in a real app, this would be a backend call)
    story.views++;
    updateTalesStats();
}

function closeStoryDetail() {
    const modal = document.getElementById('storyDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// STORY EDITOR
// ============================================

function openStoryEditor(prompt = '') {
    const modal = document.getElementById('storyEditorModal');
    if (!modal) return;
    
    // Clear form
    document.getElementById('storyTitle').value = '';
    document.getElementById('storySubtitle').value = '';
    document.getElementById('storyContent').value = prompt;
    document.getElementById('storyRoute').value = '';
    document.getElementById('storyCategory').value = '';
    
    // Update counters
    updateCharCounter('storyTitle', 'titleCount');
    updateCharCounter('storySubtitle', 'subtitleCount');
    updateCharCounter('storyContent', 'contentCount');
    updateReadingTime();
    
    modal.style.display = 'flex';
}

function closeStoryEditor() {
    const modal = document.getElementById('storyEditorModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function setupStoryFormCounters() {
    const titleInput = document.getElementById('storyTitle');
    const subtitleInput = document.getElementById('storySubtitle');
    const contentInput = document.getElementById('storyContent');
    
    if (titleInput) {
        titleInput.addEventListener('input', () => {
            updateCharCounter('storyTitle', 'titleCount');
        });
    }
    
    if (subtitleInput) {
        subtitleInput.addEventListener('input', () => {
            updateCharCounter('storySubtitle', 'subtitleCount');
        });
    }
    
    if (contentInput) {
        contentInput.addEventListener('input', () => {
            updateCharCounter('storyContent', 'contentCount');
            updateReadingTime();
        });
    }
}

function updateCharCounter(inputId, counterId) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    
    if (input && counter) {
        counter.textContent = input.value.length;
    }
}

function updateReadingTime() {
    const content = document.getElementById('storyContent').value;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed: 200 words/min
    
    const readTimeEl = document.getElementById('readingTime');
    if (readTimeEl) {
        readTimeEl.textContent = readTime;
    }
}

function publishStory() {
    // Get form values
    const title = document.getElementById('storyTitle').value.trim();
    const subtitle = document.getElementById('storySubtitle').value.trim();
    const content = document.getElementById('storyContent').value.trim();
    const route = document.getElementById('storyRoute').value;
    const category = document.getElementById('storyCategory').value;
    
    // Validate
    if (!title) {
        showToast('⚠️ Please enter a story title!', 3000);
        return;
    }
    
    if (!content || content.length < 100) {
        showToast('⚠️ Story content must be at least 100 characters!', 3000);
        return;
    }
    
    if (!route) {
        showToast('⚠️ Please select a route!', 3000);
        return;
    }
    
    if (!category) {
        showToast('⚠️ Please select a category!', 3000);
        return;
    }
    
    // Calculate reading time
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Create new story
    const newStory = {
        id: Date.now(),
        title: title,
        subtitle: subtitle || 'A Happy Trails journey',
        content: content,
        route: route,
        category: category,
        author: {
            name: userProfile ? userProfile.name : 'Anonymous Traveler',
            avatar: userProfile && userProfile.photo ? userProfile.photo : '/static/images/default-avatar.png',
            id: CURRENT_USER.isAuthenticated ? 'current-user' : 0
        },
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // Default image
        publishDate: new Date().toISOString().split('T')[0],
        readTime: readTime,
        likes: 0,
        comments: 0,
        bookmarked: false,
        featured: false,
        kavlinsPick: false,
        views: 0
    };
    
    // Add to stories
    allStories.unshift(newStory);
    filteredStories = [...allStories];
    
    // Save user story
    userStories.push(newStory);
    saveUserStories();
    
    // Re-render
    renderStoriesGrid();
    updateTalesStats();
    
    // Close modal
    closeStoryEditor();
    
    showToast('Story published successfully! 🎉', 3000);
}

function saveStoryDraft() {
    const title = document.getElementById('storyTitle').value.trim();
    const subtitle = document.getElementById('storySubtitle').value.trim();
    const content = document.getElementById('storyContent').value.trim();
    const route = document.getElementById('storyRoute').value;
    const category = document.getElementById('storyCategory').value;
    
    if (!title && !content) {
        showToast('⚠️ Nothing to save!', 2000);
        return;
    }
    
    const draft = {
        title,
        subtitle,
        content,
        route,
        category,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('happytrails_story_draft', JSON.stringify(draft));
    
    showToast('Draft saved! 💾', 2000);
}

function loadUserStories() {
    const stored = localStorage.getItem('happytrails_user_stories');
    if (stored) {
        try {
            userStories = JSON.parse(stored);
            // Add user stories to all stories
            userStories.forEach(story => {
                if (!allStories.find(s => s.id === story.id)) {
                    allStories.unshift(story);
                }
            });
        } catch (e) {
            userStories = [];
        }
    }
}

function saveUserStories() {
    localStorage.setItem('happytrails_user_stories', JSON.stringify(userStories));
}

// ============================================
// FILTERING & SEARCH
// ============================================

function searchStories() {
    const searchTerm = document.getElementById('talesSearchInput').value.toLowerCase();
    
    filteredStories = allStories.filter(story => {
        return story.title.toLowerCase().includes(searchTerm) ||
               story.subtitle.toLowerCase().includes(searchTerm) ||
               story.content.toLowerCase().includes(searchTerm) ||
               story.author.name.toLowerCase().includes(searchTerm);
    });
    
    currentStoriesPage = 1;
    renderStoriesGrid();
}

function filterByCategory(category) {
    activeCategory = category;
    
    // Update pills
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.getAttribute('data-category') === category) {
            pill.classList.add('active');
        }
    });
    
    // Update dropdown
    document.getElementById('categoryFilter').value = category;
    
    filterStories();
}

function filterStories() {
    const category = document.getElementById('categoryFilter').value;
    const route = document.getElementById('routeFilterTales').value;
    
    filteredStories = allStories.filter(story => {
        // Category filter
        if (category !== 'all' && story.category !== category) {
            return false;
        }
        
        // Route filter
        if (route !== 'all' && story.route !== route) {
            return false;
        }
        
        return true;
    });
    
    currentStoriesPage = 1;
    renderStoriesGrid();
    
    showToast(`Found ${filteredStories.length} stories! 📖`, 2000);
}

function sortStories() {
    const sortBy = document.getElementById('sortTales').value;
    
    switch(sortBy) {
        case 'latest':
            filteredStories.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
            break;
        case 'popular':
            filteredStories.sort((a, b) => b.likes - a.likes);
            break;
        case 'trending':
            filteredStories.sort((a, b) => (b.views * 0.5 + b.likes * 0.5) - (a.views * 0.5 + a.likes * 0.5));
            break;
        case 'oldest':
            filteredStories.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
            break;
    }
    
    currentStoriesPage = 1;
    renderStoriesGrid();
}

function loadMoreStories() {
    currentStoriesPage++;
    renderStoriesGrid();
    
    // Scroll to newly loaded content
    const grid = document.getElementById('storiesGrid');
    if (grid) {
        const newCards = grid.children[displayedStories.length - storiesPerPage];
        if (newCards) {
            newCards.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// ============================================
// STORY INTERACTIONS
// ============================================

function likeStory(storyId) {
    const story = allStories.find(s => s.id === storyId);
    if (!story) return;
    
    story.likes++;
    updateTalesStats();
    
    // Update detail view if open
    const modal = document.getElementById('storyDetailModal');
    if (modal && modal.style.display === 'flex') {
        viewStoryDetail(storyId);
    }
    
    showToast('Story liked! ❤️', 2000);
}

function bookmarkStory(storyId) {
    const story = allStories.find(s => s.id === storyId);
    if (!story) return;
    
    story.bookmarked = !story.bookmarked;
    
    // Save to localStorage
    const bookmarks = JSON.parse(localStorage.getItem('happytrails_bookmarked_stories') || '[]');
    if (story.bookmarked) {
        bookmarks.push(storyId);
        showToast('Story bookmarked! 🔖', 2000);
    } else {
        const index = bookmarks.indexOf(storyId);
        if (index > -1) bookmarks.splice(index, 1);
        showToast('Bookmark removed! 📑', 2000);
    }
    localStorage.setItem('happytrails_bookmarked_stories', JSON.stringify(bookmarks));
}

function shareStory(storyId) {
    const story = allStories.find(s => s.id === storyId);
    if (!story) return;
    
    const shareUrl = `${window.location.origin}/travel-companions?story=${storyId}`;
    
    if (navigator.share) {
        navigator.share({
            title: story.title,
            text: story.subtitle,
            url: shareUrl
        }).catch(() => {
            copyToClipboard(shareUrl);
        });
    } else {
        copyToClipboard(shareUrl);
    }
    
    showToast('Story link copied! 📋', 2000);
}

function usePrompt(promptText) {
    openStoryEditor(promptText);
    showToast('Prompt loaded! Start writing... ✍️', 2000);
}

function updateTalesStats() {
    const totalStories = allStories.length;
    const activeWriters = new Set(allStories.map(s => s.author.id)).size;
    const totalLikes = allStories.reduce((sum, s) => sum + s.likes, 0);
    const totalComments = allStories.reduce((sum, s) => sum + s.comments, 0);
    
    const totalStoriesEl = document.getElementById('totalStories');
    const activeWritersEl = document.getElementById('activeWriters');
    const totalLikesEl = document.getElementById('totalLikes');
    const totalCommentsEl = document.getElementById('totalComments');
    
    if (totalStoriesEl) totalStoriesEl.textContent = totalStories;
    if (activeWritersEl) activeWritersEl.textContent = activeWriters;
    if (totalLikesEl) totalLikesEl.textContent = totalLikes.toLocaleString();
    if (totalCommentsEl) totalCommentsEl.textContent = totalComments;
}

// ============================================
// UPDATE MAIN INITIALIZATION
// ============================================

// Update the main initialization
const originalInitTravelCompanions2 = initializeTravelCompanions;
initializeTravelCompanions = function() {
    originalInitTravelCompanions2();
    
    // Initialize tales when tab is clicked
    const talesTab = document.querySelector('[data-tab="travelers-tales"]');
    if (talesTab) {
        talesTab.addEventListener('click', function() {
            // Check if already initialized
            if (allStories.length === 0) {
                initializeTravelersTales();
            }
        });
    }
};

// Make functions globally accessible
window.openStoryEditor = openStoryEditor;
window.closeStoryEditor = closeStoryEditor;
window.publishStory = publishStory;
window.saveStoryDraft = saveStoryDraft;
window.viewStoryDetail = viewStoryDetail;
window.closeStoryDetail = closeStoryDetail;
window.searchStories = searchStories;
window.filterByCategory = filterByCategory;
window.filterStories = filterStories;
window.sortStories = sortStories;
window.loadMoreStories = loadMoreStories;
window.likeStory = likeStory;
window.bookmarkStory = bookmarkStory;
window.shareStory = shareStory;
window.usePrompt = usePrompt;

console.log('📖 Phase 3: Traveler\'s Tales & Story Sharing loaded successfully! 💖');