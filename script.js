// ===================================
// HERANIYA'S MAGICAL TAP GARDEN
// Designed for ages 1yr 9mo - 1mo
// ===================================

// Game State
let soundEnabled = true;
let tapCount = 0;
let flowers = [];
let butterflies = [];

// DOM Elements
const garden = document.getElementById('garden');
const butterflyLayer = document.getElementById('butterflyLayer');
const sparkleLayer = document.getElementById('sparkleLayer');
const sky = document.getElementById('sky');
const soundToggle = document.getElementById('soundToggle');
const encouragement = document.getElementById('encouragement');

// Flower emojis (bright and varied)
const flowerEmojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '💐', '🏵️', '🌹'];

// Butterfly emojis
const butterflyEmojis = ['🦋', '🦋', '🦋'];

// Sparkle emojis
const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '⚡', '💥'];

// Heart emojis
const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💞'];

// Happy face emojis
const happyEmojis = ['😊', '😄', '🤗', '😍', '🥰', '🎉'];

// Other fun emojis
const funEmojis = ['🎈', '🎁', '🍭', '🌈', '☀️', '🎨'];

// Encouraging messages
const encouragingMessages = [
    'Tap anywhere! ✨',
    'So beautiful! 🌸',
    'Keep tapping! 🦋',
    'Magic time! ⭐',
    'Wonderful! 💕',
    'You did it! 🎉'
];

// ===================================
// SOUND EFFECTS (Web Audio API)
// ===================================

// Create simple sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sound effects
function playBloomSound() {
    // Cheerful ascending tone
    playTone(523.25, 0.3, 'sine'); // C5
    setTimeout(() => playTone(659.25, 0.2, 'sine'), 100); // E5
}

function playButterflySound() {
    // Flutter sound - quick alternating tones
    playTone(880, 0.1, 'triangle', 0.2);
    setTimeout(() => playTone(987.77, 0.1, 'triangle', 0.2), 50);
}

function playSparkleSound() {
    // Magical chime
    playTone(1046.5, 0.4, 'sine', 0.2); // C6
    setTimeout(() => playTone(1318.51, 0.3, 'sine', 0.15), 100); // E6
}

function playGiggleSound() {
    // Happy bouncy sound
    playTone(659.25, 0.15, 'square', 0.2);
    setTimeout(() => playTone(783.99, 0.15, 'square', 0.2), 100);
    setTimeout(() => playTone(880, 0.2, 'square', 0.2), 200);
}

function playPopSound() {
    // Bubble pop
    playTone(200, 0.1, 'sine', 0.3);
}

// ===================================
// INITIALIZATION
// ===================================

function init() {
    // Create initial stars in the sky
    createStars();

    // Create floating clouds
    createClouds();

    // Auto-spawn elements periodically for passive engagement
    setInterval(autoSpawnElements, 8000);

    // Add tap/click listeners
    garden.addEventListener('click', handleGardenTap);
    garden.addEventListener('touchstart', handleGardenTouch);

    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);

    // Change encouragement message periodically
    setInterval(updateEncouragement, 5000);

    // Initial encouragement
    updateEncouragement();

    console.log('🌸 Heraniya\'s Magical Tap Garden is ready! 🦋');
}

// ===================================
// TAP HANDLERS
// ===================================

function handleGardenTap(e) {
    if (e.target !== garden) return; // Only tap empty areas
    const x = e.clientX;
    const y = e.clientY;
    createFlower(x, y);
}

function handleGardenTouch(e) {
    e.preventDefault();
    if (e.target !== garden) return;
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    createFlower(x, y);
}

// ===================================
// FLOWER CREATION
// ===================================

function createFlower(x, y) {
    tapCount++;

    // Create flower element
    const flower = document.createElement('div');
    flower.className = 'flower type-' + (Math.floor(Math.random() * 6) + 1);
    flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
    flower.style.left = (x - 40) + 'px'; // Center the flower
    flower.style.top = (y - 80) + 'px'; // Position above tap point

    // Add to garden
    garden.appendChild(flower);
    flowers.push(flower);

    // Play bloom sound
    playBloomSound();

    // Create sparkles around flower
    createSparkles(x, y, 3);

    // Add tap listener to flower
    flower.addEventListener('click', (e) => {
        e.stopPropagation();
        onFlowerTap(flower, x, y);
    });

    flower.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onFlowerTap(flower, x, y);
    });

    // Special effects every 5 taps
    if (tapCount % 5 === 0) {
        createRainbowBurst(x, y);
        playGiggleSound();
    }

    // Special effects every 10 taps
    if (tapCount % 10 === 0) {
        createHappyFace(x, y);
        createConfetti(x, y);
    }

    // Limit number of flowers (memory management)
    if (flowers.length > 20) {
        const oldFlower = flowers.shift();
        oldFlower.remove();
    }
}

// ===================================
// FLOWER TAP HANDLER
// ===================================

function onFlowerTap(flower, x, y) {
    // Create butterflies
    createButterfly(x, y);
    createButterfly(x + 50, y - 30);

    // Extra sparkles
    createSparkles(x, y, 5);

    // Play butterfly sound
    playButterflySound();

    // Make flower bounce
    flower.style.animation = 'none';
    setTimeout(() => {
        flower.style.animation = 'bloomIn 0.3s ease-out, gentleSway 3s ease-in-out infinite';
    }, 10);

    // Random chance for bonus effects
    if (Math.random() > 0.6) {
        createHeart(x, y);
    }

    if (Math.random() > 0.7) {
        createBubble(x, y);
    }
}

// ===================================
// BUTTERFLY CREATION
// ===================================

function createButterfly(x, y) {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    butterfly.textContent = butterflyEmojis[Math.floor(Math.random() * butterflyEmojis.length)];
    butterfly.style.left = (x - 35) + 'px';
    butterfly.style.top = (y - 35) + 'px';

    butterflyLayer.appendChild(butterfly);
    butterflies.push(butterfly);

    // Tap handler
    butterfly.addEventListener('click', (e) => {
        e.stopPropagation();
        onButterflyTap(butterfly, x, y);
    });

    butterfly.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        onButterflyTap(butterfly, touch.clientX, touch.clientY);
    });

    // Auto-remove after animation
    setTimeout(() => {
        butterfly.remove();
        butterflies = butterflies.filter(b => b !== butterfly);
    }, 6000);

    // Limit butterflies
    if (butterflies.length > 10) {
        const oldButterfly = butterflies.shift();
        if (oldButterfly) oldButterfly.remove();
    }
}

// ===================================
// BUTTERFLY TAP HANDLER
// ===================================

function onButterflyTap(butterfly, x, y) {
    // Create lots of sparkles!
    createSparkles(x, y, 7);

    // Play sparkle sound
    playSparkleSound();

    // Create rainbow burst
    createRainbowBurst(x, y);

    // Maybe create happy face
    if (Math.random() > 0.5) {
        createHappyFace(x, y);
        playGiggleSound();
    }

    // Make butterfly disappear with style
    butterfly.style.animation = 'sparkleRise 0.5s ease-out forwards';
}

// ===================================
// SPARKLE EFFECTS
// ===================================

function createSparkles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

            // Random offset
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 50;
            sparkle.style.left = (x + offsetX - 25) + 'px';
            sparkle.style.top = (y + offsetY - 25) + 'px';
            sparkle.style.setProperty('--dx', offsetX + 'px');

            sparkleLayer.appendChild(sparkle);

            // Remove after animation
            setTimeout(() => sparkle.remove(), 1500);
        }, i * 100);
    }
}

// ===================================
// RAINBOW BURST
// ===================================

function createRainbowBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'rainbow-burst';
    burst.style.left = (x - 100) + 'px';
    burst.style.top = (y - 100) + 'px';

    sparkleLayer.appendChild(burst);

    setTimeout(() => burst.remove(), 800);
}

// ===================================
// HEARTS
// ===================================

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = (x - 30) + 'px';
    heart.style.top = (y - 30) + 'px';

    sparkleLayer.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
}

// ===================================
// HAPPY FACE
// ===================================

function createHappyFace(x, y) {
    const face = document.createElement('div');
    face.className = 'happy-face';
    face.textContent = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
    face.style.left = (x - 50) + 'px';
    face.style.top = (y - 50) + 'px';

    sparkleLayer.appendChild(face);

    setTimeout(() => face.remove(), 1000);
}

// ===================================
// BUBBLES
// ===================================

function createBubble(x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = (x - 30) + 'px';
    bubble.style.top = (y - 30) + 'px';

    // Random size variation
    const size = 40 + Math.random() * 40;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';

    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    bubble.style.setProperty('--drift', drift + 'px');

    sparkleLayer.appendChild(bubble);

    // Tap to pop
    bubble.addEventListener('click', () => {
        createSparkles(
            parseFloat(bubble.style.left) + size/2,
            parseFloat(bubble.style.top) + size/2,
            4
        );
        playPopSound();
        bubble.remove();
    });

    bubble.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = bubble.getBoundingClientRect();
        createSparkles(rect.left + size/2, rect.top + size/2, 4);
        playPopSound();
        bubble.remove();
    });

    setTimeout(() => bubble.remove(), 4000);
}

// ===================================
// CONFETTI
// ===================================

function createConfetti(x, y) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Random horizontal spread
            const spread = (Math.random() - 0.5) * 200;
            confetti.style.setProperty('--spread', spread + 'px');

            sparkleLayer.appendChild(confetti);

            setTimeout(() => confetti.remove(), 2000);
        }, i * 30);
    }
}

// ===================================
// BACKGROUND ELEMENTS
// ===================================

function createStars() {
    const starCount = 8;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '⭐';
        star.style.left = (Math.random() * 90 + 5) + '%';
        star.style.top = (Math.random() * 40) + '%';
        star.style.animationDelay = (Math.random() * 4) + 's';

        sky.appendChild(star);
    }
}

function createClouds() {
    setInterval(() => {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.textContent = '☁️';
        cloud.style.top = (Math.random() * 30 + 10) + '%';
        cloud.style.left = '-100px';
        cloud.style.animationDuration = (15 + Math.random() * 10) + 's';

        sky.appendChild(cloud);

        setTimeout(() => cloud.remove(), 25000);
    }, 10000);
}

// ===================================
// AUTO-SPAWN ELEMENTS
// ===================================

function autoSpawnElements() {
    // Random position
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight - 200) + 100;

    const rand = Math.random();

    if (rand > 0.6) {
        // Auto-spawn butterfly
        createButterfly(x, y);
    } else if (rand > 0.3) {
        // Auto-spawn bubble
        createBubble(x, y);
    } else {
        // Auto-spawn sparkles
        createSparkles(x, y, 5);
    }
}

// ===================================
// ENCOURAGEMENT MESSAGES
// ===================================

function updateEncouragement() {
    const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    encouragement.textContent = message;
}

// ===================================
// SOUND TOGGLE
// ===================================

function toggleSound() {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        soundToggle.textContent = '🔊';
        soundToggle.classList.remove('muted');
        playSparkleSound();
    } else {
        soundToggle.textContent = '🔇';
        soundToggle.classList.add('muted');
    }
}

// ===================================
// SPECIAL INTERACTION: SUNBURST
// ===================================

function createSunburst(x, y) {
    const sunburst = document.createElement('div');
    sunburst.className = 'sunburst';
    sunburst.textContent = '☀️';
    sunburst.style.left = (x - 75) + 'px';
    sunburst.style.top = (y - 75) + 'px';

    sparkleLayer.appendChild(sunburst);

    setTimeout(() => sunburst.remove(), 2000);
}

// ===================================
// PREVENT DEFAULT BEHAVIORS
// ===================================

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// ===================================
// START THE MAGIC!
// ===================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
