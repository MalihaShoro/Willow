// Willow - Therapeutic Journaling App
// All data stored in memory (no localStorage)

// Global state
let currentEntry = {
    date: null,
    mood: null,
    intensity: null,
    text: '',
    wordCount: 0
};

let entries = [];
let currentScreen = 'welcome-screen';
let selectedMood = null;
let selectedIntensity = null;

// Moods with emojis
const moods = [
    { name: 'peaceful', emoji: '😌', color: '#99ad7d' },
    { name: 'grateful', emoji: '🙏', color: '#d9aa28' },
    { name: 'anxious', emoji: '😰', color: '#819295' },
    { name: 'excited', emoji: '✨', color: '#ea9566' },
    { name: 'sad', emoji: '😢', color: '#e1b1b1' },
    { name: 'content', emoji: '😊', color: '#99ad7d' },
    { name: 'frustrated', emoji: '😤', color: '#ea9566' },
    { name: 'hopeful', emoji: '🌱', color: '#d9aa28' }
];

// Therapeutic reflection prompts
const reflectionPrompts = [
    "What are three things that brought you joy today, no matter how small?",
    "How did you show kindness to yourself or others today?",
    "What emotions came up for you today, and what might they be telling you?",
    "Describe a moment today when you felt truly present and aware.",
    "What is one thing you're learning about yourself right now?",
    "How did you handle a challenge today, and what does that show about your strength?",
    "What would you tell a dear friend who was experiencing your current situation?",
    "What are you grateful for in this very moment?",
    "How has your perspective on something shifted recently?",
    "What do you need more of in your life right now?",
    "What boundary did you honor today, or what boundary do you need to set?",
    "How did you nurture your mind, body, or spirit today?",
    "What pattern in your thoughts or behaviors are you noticing?",
    "How did you connect with others or with nature today?",
    "What would 'being gentle with yourself' look like right now?"
];

// Encouragement messages
const encouragementMessages = [
    "Your willingness to reflect shows incredible self-awareness and courage.",
    "Every word you write is a step toward understanding yourself more deeply.",
    "You're creating a beautiful record of your growth and healing journey.",
    "Your thoughts and feelings are valid, and your story matters.",
    "The practice of reflection is a gift you give to your future self."
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Add sample entry for demonstration
    addSampleEntry();
});

function initializeApp() {
    // Set current date
    updateCurrentDate();
    
    // Generate mood buttons
    generateMoodButtons();
    
    // Set daily prompt
    setDailyPrompt();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome screen initially
    showScreen('welcome-screen');
}

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    currentEntry.date = now.toISOString().split('T')[0];
}

function generateMoodButtons() {
    const moodGrid = document.getElementById('mood-grid');
    moodGrid.innerHTML = '';
    
    moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = 'mood-btn';
        button.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">${mood.emoji}</div>
            <div style="font-size: 0.85rem; text-transform: capitalize;">${mood.name}</div>
        `;
        button.onclick = () => selectMood(mood);
        moodGrid.appendChild(button);
    });
}

function selectMood(mood) {
    // Remove previous selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Select current mood
    event.target.closest('.mood-btn').classList.add('selected');
    selectedMood = mood;
    currentEntry.mood = mood;
    
    // Show intensity selection
    document.getElementById('intensity-section').style.display = 'block';
}

function setDailyPrompt() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const promptIndex = dayOfYear % reflectionPrompts.length;
    
    document.getElementById('daily-prompt').textContent = reflectionPrompts[promptIndex];
}

function setupEventListeners() {
    // Intensity buttons
    document.querySelectorAll('.intensity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.intensity-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedIntensity = this.dataset.intensity;
            currentEntry.intensity = selectedIntensity;
        });
    });
    
    // Journal textarea
    const textarea = document.getElementById('journal-text');
    textarea.addEventListener('input', function() {
        currentEntry.text = this.value;
        updateWordCount();
    });
    
    // Auto-save draft every 30 seconds
    setInterval(saveDraft, 30000);
}

function updateWordCount() {
    const text = document.getElementById('journal-text').value;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    currentEntry.wordCount = wordCount;
    document.getElementById('word-count').textContent = `${wordCount} words`;
}

function togglePrompt() {
    const promptCard = document.querySelector('.prompt-card');
    if (promptCard.style.display === 'none') {
        promptCard.style.display = 'block';
    } else {
        promptCard.style.display = 'none';
    }
}

function saveDraft() {
    // In a real app, this would save to localStorage or server
    showSuccessMessage('Draft saved quietly 💚');
}

function saveEntry() {
    if (!currentEntry.text.trim()) {
        alert('Please write something before saving your reflection.');
        return;
    }
    
    // Create entry object
    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        mood: selectedMood,
        intensity: selectedIntensity,
        text: currentEntry.text,
        wordCount: currentEntry.wordCount,
        timestamp: new Date().toISOString()
    };
    
    // Add to entries array
    entries.unshift(entry); // Add to beginning of array
    
    // Show success message
    showSuccessMessage('Your reflection has been saved with love 💚');
    
    // Clear current entry
    resetCurrentEntry();
    
    // Update insights
    updateInsights();
}

function resetCurrentEntry() {
    currentEntry = {
        date: null,
        mood: null,
        intensity: null,
        text: '',
        wordCount: 0
    };
    
    selectedMood = null;
    selectedIntensity = null;
    
    // Clear UI
    document.getElementById('journal-text').value = '';
    document.getElementById('word-count').textContent = '0 words';
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.intensity-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('intensity-section').style.display = 'none';
    document.querySelector('.prompt-card').style.display = 'block';
    
    // Generate new prompt
    setDailyPrompt();
}

function showSuccessMessage(message) {
    const successMsg = document.getElementById('success-message');
    const successText = document.querySelector('.success-text');
    
    successText.textContent = message;
    successMsg.classList.add('show');
    
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Update navigation
    updateNavigation(screenId);
    
    // Load screen-specific content
    if (screenId === 'entries-screen') {
        loadEntries();
    } else if (screenId === 'insights-screen') {
        updateInsights();
    }
}

function updateNavigation(screenId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const screenMap = {
        'journal-screen': 'journal',
        'entries-screen': 'entries',
        'insights-screen': 'insights'
    };
    
    const targetScreen = screenMap[screenId];
    if (targetScreen) {
        const navBtn = document.querySelector(`[data-screen="${targetScreen}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }
    }
}

function loadEntries() {
    const entriesList = document.getElementById('entries-list');
    
    if (entries.length === 0) {
        entriesList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--cool-gray);">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">📖</p>
                <p>Your reflection journey will appear here.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Start by writing your first entry!</p>
            </div>
        `;
        return;
    }
    
    entriesList.innerHTML = '';
    
    entries.forEach(entry => {
        const entryCard = document.createElement('div');
        entryCard.className = 'entry-card';
        
        const preview = entry.text.length > 150 ? 
            entry.text.substring(0, 150) + '...' : 
            entry.text;
        
        const moodDisplay = entry.mood ? 
            `<span class="entry-mood">${entry.mood.emoji} ${entry.mood.name}</span>` : 
            '<span class="entry-mood">📝 Reflection</span>';
        
        entryCard.innerHTML = `
            <div class="entry-header">
                <span class="entry-date">${entry.date}</span>
                ${moodDisplay}
            </div>
            <div class="entry-preview">${preview}</div>
            <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--cool-gray);">
                ${entry.wordCount} words
            </div>
        `;
        
        entriesList.appendChild(entryCard);
    });
}

function updateInsights() {
    // Total entries
    document.getElementById('total-entries').textContent = entries.length;
    
    // Total words
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    document.getElementById('total-words').textContent = totalWords.toLocaleString();
    
    // Mood summary
    updateMoodSummary();
    
    // Encouragement
    updateEncouragement();
}

function updateMoodSummary() {
    const moodSummary = document.getElementById('mood-summary');
    
    if (entries.length === 0) {
        moodSummary.innerHTML = '<p style="color: var(--cool-gray); font-size: 0.9rem;">Start journaling to see your emotional patterns</p>';
        return;
    }
    
    // Count moods
    const moodCounts = {};
    entries.forEach(entry => {
        if (entry.mood) {
            const moodName = entry.mood.name;
            moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
        }
    });
    
    // Sort by frequency
    const sortedMoods = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Show top 5
    
    moodSummary.innerHTML = '';
    sortedMoods.forEach(([mood, count]) => {
        const tag = document.createElement('span');
        tag.className = 'mood-tag';
        tag.textContent = `${mood} (${count})`;
        moodSummary.appendChild(tag);
    });
}

function updateEncouragement() {
    const encouragementText = document.getElementById('encouragement-text');
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
    encouragementText.textContent = encouragementMessages[randomIndex];
}

function addSampleEntry() {
    const sampleEntry = {
        id: Date.now() - 86400000, // Yesterday
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        mood: moods[0], // peaceful
        intensity: "3",
        text: "Today I took a moment to really notice the small things around me. The way the morning light filtered through my window, the sound of birds outside, and the warmth of my coffee cup in my hands. Sometimes I get so caught up in the rush of daily life that I forget to appreciate these gentle moments. I'm learning that mindfulness doesn't have to be complicated - it can be as simple as pausing to breathe and notice what's right in front of me.",
        wordCount: 78,
        timestamp: new Date(Date.now() - 86400000).toISOString()
    };
    
    entries.push(sampleEntry);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentScreen === 'journal-screen') {
            saveEntry();
        }
    }
    
    // Escape to go back to journal
    if (e.key === 'Escape' && currentScreen !== 'journal-screen') {
        showScreen('journal-screen');
    }
});

// Responsive navigation for mobile
function handleMobileNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}