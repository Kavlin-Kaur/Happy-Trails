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