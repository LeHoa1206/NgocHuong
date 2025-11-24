// Extract all vocabulary from stories
let allVocabulary = [];
stories.forEach(story => {
    story.vocabulary.forEach(vocab => {
        allVocabulary.push({
            ...vocab,
            level: story.level,
            storyId: story.id,
            storyTitle: story.title,
            example: story.chinese
        });
    });
});

// Create lessons (15 words per lesson)
const WORDS_PER_LESSON = 15;
let lessons = [];
for (let i = 0; i < allVocabulary.length; i += WORDS_PER_LESSON) {
    lessons.push({
        id: Math.floor(i / WORDS_PER_LESSON) + 1,
        words: allVocabulary.slice(i, i + WORDS_PER_LESSON),
        level: allVocabulary[i].level
    });
}

// State
let currentLesson = null;
let currentIndex = 0;
let filteredVocab = [];
let learnedVocab = JSON.parse(localStorage.getItem('learnedVocab')) || [];
let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
let isFlipped = false;
let autoPlayInterval = null;
let isRandom = false;

// DOM Elements
const lessonGrid = document.getElementById('lessonGrid');
const flashcard = document.getElementById('flashcard');
const cardChinese = document.getElementById('cardChinese');
const cardPinyin = document.getElementById('cardPinyin');
const cardVietnamese = document.getElementById('cardVietnamese');
const cardExample = document.getElementById('cardExample');
const prevBtn = document.getElementById('prevCard');
const nextBtn = document.getElementById('nextCard');
const knowBtn = document.getElementById('knowBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const randomMode = document.getElementById('randomMode');
const autoPlay = document.getElementById('autoPlay');
const totalWords = document.getElementById('totalWords');
const learnedWords = document.getElementById('learnedWords');
const progress = document.getElementById('progress');

// Initialize
function init() {
    renderLessons();
    updateStats();
    setupEventListeners();
}

// Render lesson cards
function renderLessons() {
    lessonGrid.innerHTML = '';
    lessons.forEach(lesson => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        
        const completed = completedLessons.includes(lesson.id);
        if (completed) {
            lessonCard.classList.add('completed');
        }
        
        const learnedCount = lesson.words.filter(w => 
            learnedVocab.includes(getVocabId(w))
        ).length;
        
        lessonCard.innerHTML = `
            <div class="lesson-number">Bài ${lesson.id}</div>
            <div class="lesson-level">${lesson.level}</div>
            <div class="lesson-info">${lesson.words.length} từ</div>
            <div class="lesson-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(learnedCount/lesson.words.length)*100}%"></div>
                </div>
                <div class="progress-text">${learnedCount}/${lesson.words.length}</div>
            </div>
            ${completed ? '<div class="completed-badge">✓</div>' : ''}
        `;
        
        lessonCard.addEventListener('click', () => selectLesson(lesson));
        lessonGrid.appendChild(lessonCard);
    });
}

// Select a lesson
function selectLesson(lesson) {
    currentLesson = lesson;
    
    // Filter out already learned words
    filteredVocab = lesson.words.filter(w => 
        !learnedVocab.includes(getVocabId(w))
    );
    
    // If all words are learned, show all words again
    if (filteredVocab.length === 0) {
        filteredVocab = [...lesson.words];
    }
    
    currentIndex = 0;
    
    // Scroll to flashcard
    document.querySelector('.flashcard-container').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    showCard();
}

// Text-to-Speech function
function speakChinese(text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN'; // Chinese (Simplified)
    utterance.rate = 0.8; // Slower speed for learning
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
}

// Show current card
function showCard() {
    if (filteredVocab.length === 0) {
        cardChinese.textContent = '选择一个课程';
        cardPinyin.textContent = 'Xuǎnzé yī ge kèchéng';
        cardVietnamese.textContent = 'Chọn một bài học ở trên';
        cardExample.textContent = '';
        return;
    }
    
    const vocab = filteredVocab[currentIndex];
    
    // Find the story to get Vietnamese translation
    const story = stories.find(s => s.id === vocab.storyId);
    
    cardChinese.textContent = vocab.chinese;
    cardPinyin.textContent = vocab.pinyin;
    cardVietnamese.textContent = vocab.vietnamese;
    
    // Show example with translation
    if (story) {
        cardExample.innerHTML = `
            <div class="example-chinese">📖 ${vocab.example}</div>
            <div class="example-vietnamese">💬 ${story.vietnamese}</div>
        `;
    } else {
        cardExample.textContent = `Ví dụ: ${vocab.example}`;
    }
    
    // Update know button
    const isKnown = learnedVocab.includes(getVocabId(vocab));
    knowBtn.textContent = isKnown ? '✓ Đã biết' : '✓ Đã biết';
    knowBtn.classList.toggle('known', isKnown);
    
    // Reset flip
    flashcard.classList.remove('flipped');
    isFlipped = false;
    
    updateStats();
    
    // Auto-play pronunciation when showing new card
    setTimeout(() => speakChinese(vocab.chinese), 300);
}

// Flip card
function flipCard() {
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

// Navigate cards
function nextCard() {
    if (isRandom) {
        currentIndex = Math.floor(Math.random() * filteredVocab.length);
    } else {
        currentIndex = (currentIndex + 1) % filteredVocab.length;
    }
    showCard();
}

function prevCard() {
    if (isRandom) {
        currentIndex = Math.floor(Math.random() * filteredVocab.length);
    } else {
        currentIndex = (currentIndex - 1 + filteredVocab.length) % filteredVocab.length;
    }
    showCard();
}

// Mark as known
function toggleKnown() {
    if (filteredVocab.length === 0) return;
    
    const vocab = filteredVocab[currentIndex];
    if (!vocab) return;
    
    const vocabId = getVocabId(vocab);
    const index = learnedVocab.indexOf(vocabId);
    
    if (index > -1) {
        // Remove from learned
        learnedVocab.splice(index, 1);
        localStorage.setItem('learnedVocab', JSON.stringify(learnedVocab));
        renderLessons();
        showCard();
    } else {
        // Add to learned
        learnedVocab.push(vocabId);
        localStorage.setItem('learnedVocab', JSON.stringify(learnedVocab));
        
        // Remove from current filtered list (skip learned words)
        filteredVocab.splice(currentIndex, 1);
        
        // Adjust index
        if (currentIndex >= filteredVocab.length) {
            currentIndex = 0;
        }
        
        // Check if lesson is completed
        if (currentLesson) {
            const allLearned = currentLesson.words.every(w => 
                learnedVocab.includes(getVocabId(w))
            );
            
            if (allLearned && !completedLessons.includes(currentLesson.id)) {
                completedLessons.push(currentLesson.id);
                localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
                
                // Show celebration
                setTimeout(() => {
                    alert(`🎉 Chúc mừng! Bạn đã hoàn thành Bài ${currentLesson.id}!`);
                    renderLessons();
                }, 300);
            }
        }
        
        renderLessons();
        
        // Show next card or completion message
        if (filteredVocab.length === 0) {
            cardChinese.textContent = '完成了！';
            cardPinyin.textContent = 'Wánchéng le!';
            cardVietnamese.textContent = 'Hoàn thành rồi!';
            cardExample.innerHTML = '<div>🎉 Bạn đã học xong tất cả từ trong bài này!</div>';
        } else {
            showCard();
        }
    }
}

// Get unique vocab ID
function getVocabId(vocab) {
    if (!vocab || !vocab.chinese || !vocab.pinyin) return '';
    return `${vocab.chinese}-${vocab.pinyin}`;
}

// Filter by level
function filterByLevel(level) {
    currentLesson = null;
    
    if (level === 'all') {
        renderLessons();
    } else {
        // Filter lessons by level
        lessonGrid.innerHTML = '';
        lessons.filter(l => l.level === level).forEach(lesson => {
            const lessonCard = document.createElement('div');
            lessonCard.className = 'lesson-card';
            
            const completed = completedLessons.includes(lesson.id);
            if (completed) {
                lessonCard.classList.add('completed');
            }
            
            const learnedCount = lesson.words.filter(w => 
                learnedVocab.includes(getVocabId(w))
            ).length;
            
            lessonCard.innerHTML = `
                <div class="lesson-number">Bài ${lesson.id}</div>
                <div class="lesson-level">${lesson.level}</div>
                <div class="lesson-info">${lesson.words.length} từ</div>
                <div class="lesson-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(learnedCount/lesson.words.length)*100}%"></div>
                    </div>
                    <div class="progress-text">${learnedCount}/${lesson.words.length}</div>
                </div>
                ${completed ? '<div class="completed-badge">✓</div>' : ''}
            `;
            
            lessonCard.addEventListener('click', () => selectLesson(lesson));
            lessonGrid.appendChild(lessonCard);
        });
    }
    
    filteredVocab = [];
    currentIndex = 0;
    showCard();
}

// Update stats
function updateStats() {
    totalWords.textContent = filteredVocab.length;
    learnedWords.textContent = learnedVocab.length;
    progress.textContent = `${currentIndex + 1}/${filteredVocab.length}`;
}

// Auto play
function toggleAutoPlay() {
    if (autoPlay.checked) {
        autoPlayInterval = setInterval(() => {
            if (!isFlipped) {
                flipCard();
            } else {
                nextCard();
            }
        }, 3000);
    } else {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    const speakerBtn = document.getElementById('speakerBtn');
    
    flashcard.addEventListener('click', (e) => {
        // Don't flip if clicking speaker button
        if (e.target.id === 'speakerBtn' || e.target.closest('.speaker-btn')) {
            return;
        }
        flipCard();
    });
    
    // Speaker button
    speakerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (filteredVocab.length > 0) {
            speakChinese(filteredVocab[currentIndex].chinese);
            speakerBtn.classList.add('speaking');
            setTimeout(() => speakerBtn.classList.remove('speaking'), 1000);
        }
    });
    
    prevBtn.addEventListener('click', prevCard);
    nextBtn.addEventListener('click', nextCard);
    knowBtn.addEventListener('click', toggleKnown);
    
    // Review all button - Show vocabulary list
    const reviewAllBtn = document.getElementById('reviewAll');
    const vocabModal = document.getElementById('vocabModal');
    const closeVocabModal = document.getElementById('closeVocabModal');
    const vocabModalBody = document.getElementById('vocabModalBody');
    const vocabModalTitle = document.getElementById('vocabModalTitle');
    const startReviewBtn = document.getElementById('startReview');
    
    reviewAllBtn.addEventListener('click', () => {
        if (currentLesson) {
            showVocabList();
        } else {
            alert('Vui lòng chọn một bài học trước!');
        }
    });
    
    closeVocabModal.addEventListener('click', () => {
        vocabModal.style.display = 'none';
    });
    
    vocabModal.addEventListener('click', (e) => {
        if (e.target === vocabModal) {
            vocabModal.style.display = 'none';
        }
    });
    
    startReviewBtn.addEventListener('click', () => {
        if (currentLesson) {
            filteredVocab = [...currentLesson.words];
            currentIndex = 0;
            vocabModal.style.display = 'none';
            showCard();
            document.querySelector('.flashcard-container').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterByLevel(btn.dataset.level);
        });
    });
    
    randomMode.addEventListener('change', (e) => {
        isRandom = e.target.checked;
    });
    
    autoPlay.addEventListener('change', toggleAutoPlay);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                flipCard();
                break;
            case 'ArrowLeft':
                prevCard();
                break;
            case 'ArrowRight':
                nextCard();
                break;
            case 'k':
            case 'K':
                toggleKnown();
                break;
            case 'p':
            case 'P':
                // Press P to play pronunciation
                if (filteredVocab.length > 0) {
                    speakChinese(filteredVocab[currentIndex].chinese);
                }
                break;
        }
    });
}

// Show vocabulary list
function showVocabList() {
    const vocabModal = document.getElementById('vocabModal');
    const vocabModalBody = document.getElementById('vocabModalBody');
    const vocabModalTitle = document.getElementById('vocabModalTitle');
    
    if (!currentLesson) return;
    
    vocabModalTitle.textContent = `Bài ${currentLesson.id} - ${currentLesson.level} (${currentLesson.words.length} từ)`;
    
    let html = '<div class="vocab-list-grid">';
    
    currentLesson.words.forEach((vocab, index) => {
        const isLearned = learnedVocab.includes(getVocabId(vocab));
        const story = stories.find(s => s.id === vocab.storyId);
        
        html += `
            <div class="vocab-list-item ${isLearned ? 'learned' : ''}">
                <div class="vocab-list-number">${index + 1}</div>
                <div class="vocab-list-content">
                    <div class="vocab-list-chinese">${vocab.chinese}</div>
                    <div class="vocab-list-pinyin">${vocab.pinyin}</div>
                    <div class="vocab-list-vietnamese">${vocab.vietnamese}</div>
                    ${story ? `<div class="vocab-list-example">
                        <div class="example-cn">例: ${vocab.example}</div>
                        <div class="example-vn">${story.vietnamese}</div>
                    </div>` : ''}
                </div>
                ${isLearned ? '<div class="vocab-learned-badge">✓</div>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    
    vocabModalBody.innerHTML = html;
    vocabModal.style.display = 'flex';
}

// Start
init();
