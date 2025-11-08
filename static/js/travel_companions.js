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