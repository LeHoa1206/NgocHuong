// State management
let currentStoryIndex = 0;
let learnedStories = JSON.parse(localStorage.getItem('learnedStories')) || [];
let filteredStories = [...stories];

// DOM Elements
const storiesGrid = document.getElementById('storiesGrid');
const modal = document.getElementById('storyModal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const learnedCount = document.getElementById('learnedCount');

// Initialize
function init() {
    renderStories(stories);
    updateLearnedCount();
    setupEventListeners();
}

// Render stories
function renderStories(storiesToRender) {
    storiesGrid.innerHTML = '';
    filteredStories = storiesToRender;
    
    storiesToRender.forEach((story, index) => {
        const card = document.createElement('div');
        card.className = `story-card ${learnedStories.includes(story.id) ? 'learned' : ''}`;
        card.innerHTML = `
            <div>
                <span class="story-number">${story.level} #${story.id}</span>
                <span class="story-category">${getCategoryName(story.category)}</span>
            </div>
            <h3 class="story-title">${story.title}</h3>
            <div class="story-preview">
                <div class="chinese">${story.chinese}</div>
                <div class="pinyin">${story.pinyin}</div>
                <div class="vietnamese">${story.vietnamese}</div>
            </div>
        `;
        card.addEventListener('click', () => openModal(story, index));
        storiesGrid.appendChild(card);
    });
}

// Get category name in Vietnamese
function getCategoryName(category) {
    const categories = {
        'daily': 'Cuộc sống',
        'love': 'Tình yêu',
        'food': 'Ẩm thực',
        'travel': 'Du lịch',
        'work': 'Công việc'
    };
    return categories[category] || category;
}

// Open modal
function openModal(story, index) {
    currentStoryIndex = filteredStories.findIndex(s => s.id === story.id);
    
    document.getElementById('modalTitle').textContent = story.title;
    document.getElementById('modalChinese').textContent = story.chinese;
    document.getElementById('modalPinyin').textContent = story.pinyin;
    document.getElementById('modalVietnamese').textContent = story.vietnamese;
    
    // Render vocabulary
    const vocabList = document.getElementById('vocabularyList');
    vocabList.innerHTML = story.vocabulary.map(vocab => `
        <div class="vocab-item">
            <div class="vocab-chinese">${vocab.chinese}</div>
            <div class="vocab-pinyin">${vocab.pinyin}</div>
            <div class="vocab-vietnamese">${vocab.vietnamese}</div>
        </div>
    `).join('');
    
    // Update learned button
    const markLearnedBtn = document.getElementById('markLearnedBtn');
    if (learnedStories.includes(story.id)) {
        markLearnedBtn.innerHTML = '<span class="heart">♥</span> Đã học';
        markLearnedBtn.style.background = '#4CAF50';
    } else {
        markLearnedBtn.innerHTML = '<span class="heart">♡</span> Đánh dấu đã học';
        markLearnedBtn.style.background = 'white';
        markLearnedBtn.style.color = '#667eea';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Toggle learned status
function toggleLearned() {
    const currentStory = filteredStories[currentStoryIndex];
    const index = learnedStories.indexOf(currentStory.id);
    
    if (index > -1) {
        learnedStories.splice(index, 1);
    } else {
        learnedStories.push(currentStory.id);
    }
    
    localStorage.setItem('learnedStories', JSON.stringify(learnedStories));
    updateLearnedCount();
    renderStories(filteredStories);
    openModal(currentStory, currentStoryIndex);
}

// Navigate stories
function navigateStory(direction) {
    currentStoryIndex += direction;
    if (currentStoryIndex < 0) currentStoryIndex = filteredStories.length - 1;
    if (currentStoryIndex >= filteredStories.length) currentStoryIndex = 0;
    
    openModal(filteredStories[currentStoryIndex], currentStoryIndex);
}

// Update learned count
function updateLearnedCount() {
    learnedCount.textContent = learnedStories.length;
}

// Search stories
function searchStories(query) {
    const filtered = stories.filter(story => 
        story.title.toLowerCase().includes(query.toLowerCase()) ||
        story.chinese.includes(query) ||
        story.pinyin.toLowerCase().includes(query.toLowerCase()) ||
        story.vietnamese.toLowerCase().includes(query.toLowerCase())
    );
    renderStories(filtered);
}

// Filter by category
function filterByCategory(category) {
    const filtered = category === 'all' 
        ? stories 
        : stories.filter(story => story.category === category);
    renderStories(filtered);
}

// Filter by level
function filterByLevel(level) {
    const filtered = stories.filter(story => story.level === level);
    renderStories(filtered);
}

// Setup event listeners
function setupEventListeners() {
    closeModal.addEventListener('click', closeModalFunc);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
    
    document.getElementById('markLearnedBtn').addEventListener('click', toggleLearned);
    document.getElementById('prevStory').addEventListener('click', () => navigateStory(-1));
    document.getElementById('nextStory').addEventListener('click', () => navigateStory(1));
    
    searchInput.addEventListener('input', (e) => {
        searchStories(e.target.value);
    });
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.level) {
                filterByLevel(btn.dataset.level);
            } else {
                filterByCategory(btn.dataset.category);
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeModalFunc();
            if (e.key === 'ArrowLeft') navigateStory(-1);
            if (e.key === 'ArrowRight') navigateStory(1);
        }
    });
}

// Start the app
init();
