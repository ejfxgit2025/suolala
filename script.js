// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');
const livePriceElement = document.getElementById('livePrice');
const priceChangeElement = document.getElementById('priceChange');
const priceChangeText = document.getElementById('priceChangeText');
const marketCapElement = document.getElementById('marketCap');
const holdersElement = document.getElementById('holders');
const particlesContainer = document.querySelector('.particles-container');
const floatingShapes = document.querySelector('.floating-shapes');

// Music Player Elements
const suolalaAudio = document.getElementById('suolalaAudio');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const musicPlayer = document.querySelector('.music-player');
const songTitle = document.querySelector('.song-title');

// Music Player State
let isPlaying = false;
let audioInitialized = false;

// Real Token Data
let currentPrice = 0.004055;
let priceChange = 1.10;

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuOverlay.style.display = 'block';
    setTimeout(() => {
        mobileMenuOverlay.style.opacity = '1';
        mobileMenuOverlay.querySelector('.mobile-menu-container').style.transform = 'translateY(0)';
    }, 10);
});

mobileMenuClose.addEventListener('click', closeMobileMenu);

mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
    }
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    mobileMenuOverlay.style.opacity = '0';
    mobileMenuOverlay.querySelector('.mobile-menu-container').style.transform = 'translateY(100%)';
    setTimeout(() => {
        mobileMenuOverlay.style.display = 'none';
    }, 300);
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    const allLinks = [...navLinks, ...mobileNavLinks];
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Real Price Simulation with Real Data Fetching
let priceData = [0.004055];
let priceHistory = [];
const MAX_HISTORY = 50;

async function fetchRealTokenData() {
    try {
        // Fetch from DexScreener API
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/79Qaq5b1JfC8bFuXkAvXTR67fRPmMjMVNkEA3bb8bLzi');
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            
            // Update with real data
            currentPrice = parseFloat(pair.priceUsd);
            priceChange = parseFloat(pair.priceChange.h24);
            
            // Update price display
            livePriceElement.textContent = `$${currentPrice.toFixed(6)}`;
            
            // Update price change
            const isPositive = priceChange >= 0;
            priceChangeElement.innerHTML = `<i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> <span id="priceChangeText">${isPositive ? '+' : ''}${priceChange.toFixed(2)}%</span>`;
            priceChangeElement.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
            
            // Update market cap if available
            if (pair.fdv) {
                const marketCap = pair.fdv;
                if (marketCap >= 1000000) {
                    marketCapElement.textContent = `$${(marketCap / 1000000).toFixed(1)}M`;
                } else {
                    marketCapElement.textContent = `$${Math.floor(marketCap).toLocaleString()}`;
                }
            }
            
            // Add to history for price simulation
            priceData.push(currentPrice);
            if (priceData.length > 10) priceData.shift();
            
            console.log('Updated with real data:', { price: currentPrice, change: priceChange });
            return true;
        }
    } catch (error) {
        console.error('Error fetching real token data:', error);
        return false;
    }
    return false;
}

function simulatePriceFluctuations() {
    // Add small random fluctuations to the current price
    const fluctuation = (Math.random() - 0.5) * 0.0001;
    const newPrice = Math.max(0.000001, currentPrice + fluctuation);
    
    // Store in history
    priceHistory.push(newPrice);
    if (priceHistory.length > MAX_HISTORY) {
        priceHistory.shift();
    }
    
    // Calculate 24h change based on history
    if (priceHistory.length >= 2) {
        const oldPrice = priceHistory[0];
        priceChange = ((newPrice - oldPrice) / oldPrice) * 100;
    }
    
    // Update UI
    livePriceElement.textContent = `$${newPrice.toFixed(6)}`;
    
    const isPositive = priceChange >= 0;
    priceChangeElement.innerHTML = `<i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> <span id="priceChangeText">${isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)}%</span>`;
    priceChangeElement.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
    
    // Update chart if exists
    updatePriceChart();
    
    return newPrice;
}

// Enhanced Background Animations
function createParticles() {
    if (!particlesContainer) return;
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const moveX = (Math.random() - 0.5) * 100;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.5 ? 'rgba(153, 69, 255, 0.3)' : 'rgba(20, 241, 149, 0.3)'};
            border-radius: 50%;
            left: ${posX}%;
            bottom: -10px;
            animation: particleMove ${duration}s linear ${delay}s infinite;
            --move-x: ${moveX}px;
            filter: blur(${Math.random() * 2}px);
        `;
        
        particlesContainer.appendChild(particle);
    }
}

function createFloatingShapes() {
    if (!floatingShapes) return;
    
    // Create additional floating shapes
    for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        shape.className = `shape-${i + 1}`;
        
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 90 + 5;
        const posY = Math.random() * 90 + 5;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 20;
        
        const colors = [
            'rgba(153, 69, 255, 0.05)',
            'rgba(20, 241, 149, 0.04)',
            'rgba(0, 209, 255, 0.03)',
            'rgba(255, 107, 157, 0.02)'
        ];
        
        shape.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${posY}%;
            left: ${posX}%;
            background: radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent 70%);
            animation: float ${duration}s infinite linear ${delay}s;
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        `;
        
        floatingShapes.appendChild(shape);
    }
}

// Mini Price Chart Animation
let chartCanvas, chartCtx, chartData, chart;

function initializeChart() {
    chartCanvas = document.getElementById('priceChart');
    if (!chartCanvas) return;
    
    chartCtx = chartCanvas.getContext('2d');
    
    // Initial chart data based on current price
    chartData = [];
    let baseValue = currentPrice;
    
    for (let i = 0; i < 50; i++) {
        baseValue += (Math.random() - 0.5) * 0.0001;
        chartData.push(Math.max(0.000001, baseValue));
    }
    
    // Create gradient
    const gradient = chartCtx.createLinearGradient(0, 0, 0, chartCanvas.height);
    gradient.addColorStop(0, 'rgba(153, 69, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(153, 69, 255, 0.1)');
    
    // Draw chart
    chart = {
        width: chartCanvas.width,
        height: chartCanvas.height,
        data: chartData,
        
        draw: function() {
            // Clear canvas
            chartCtx.clearRect(0, 0, this.width, this.height);
            
            // Calculate dimensions
            const dataLength = this.data.length;
            const step = this.width / (dataLength - 1);
            const max = Math.max(...this.data);
            const min = Math.min(...this.data);
            const range = max - min || 0.000001;
            const scale = this.height / range;
            
            // Draw gradient area
            chartCtx.beginPath();
            chartCtx.moveTo(0, this.height);
            
            for (let i = 0; i < dataLength; i++) {
                const x = i * step;
                const y = this.height - (this.data[i] - min) * scale;
                
                if (i === 0) {
                    chartCtx.lineTo(x, y);
                } else {
                    chartCtx.lineTo(x, y);
                }
            }
            
            chartCtx.lineTo(this.width, this.height);
            chartCtx.closePath();
            
            chartCtx.fillStyle = gradient;
            chartCtx.fill();
            
            // Draw line
            chartCtx.beginPath();
            chartCtx.moveTo(0, this.height - (this.data[0] - min) * scale);
            
            for (let i = 1; i < dataLength; i++) {
                const x = i * step;
                const y = this.height - (this.data[i] - min) * scale;
                chartCtx.lineTo(x, y);
            }
            
            chartCtx.strokeStyle = '#9945FF';
            chartCtx.lineWidth = 2;
            chartCtx.stroke();
            
            // Draw current price point
            const lastX = (dataLength - 1) * step;
            const lastY = this.height - (this.data[dataLength - 1] - min) * scale;
            
            chartCtx.beginPath();
            chartCtx.arc(lastX, lastY, 6, 0, Math.PI * 2);
            chartCtx.fillStyle = '#14F195';
            chartCtx.fill();
            chartCtx.strokeStyle = '#FFFFFF';
            chartCtx.lineWidth = 2;
            chartCtx.stroke();
        },
        
        update: function(newValue) {
            // Shift data and add new value
            this.data.shift();
            this.data.push(newValue);
            this.draw();
        }
    };
    
    // Initial draw
    chart.draw();
    
    // Resize handler
    window.addEventListener('resize', resizeChart);
    resizeChart();
}

function updatePriceChart() {
    if (chart) {
        chart.update(currentPrice);
    }
}

function resizeChart() {
    if (!chartCanvas) return;
    
    // Get parent container dimensions
    const container = chartCanvas.parentElement;
    chartCanvas.width = container.clientWidth;
    chartCanvas.height = container.clientHeight;
    
    if (chart) {
        chart.width = chartCanvas.width;
        chart.height = chartCanvas.height;
        chart.draw();
    }
}

// Theme Management (Light/Dark)
function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('suolala-theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('suolala-theme', newTheme);
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        document.documentElement.style.setProperty('--dark-bg', '#F5F5FA');
        document.documentElement.style.setProperty('--darker-bg', '#FFFFFF');
        document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
        document.documentElement.style.setProperty('--text-primary', '#0A0A0F');
        document.documentElement.style.setProperty('--text-secondary', '#555566');
        document.documentElement.style.setProperty('--glass-border', 'rgba(153, 69, 255, 0.15)');
        document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--build-rise-color', '#FF6B9D');
        document.documentElement.style.setProperty('--build-rise-gradient', 'linear-gradient(135deg, #FF6B9D 0%, #FFD166 50%, #00D1FF 100%)');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.documentElement.style.setProperty('--dark-bg', '#0A0A0F');
        document.documentElement.style.setProperty('--darker-bg', '#050508');
        document.documentElement.style.setProperty('--card-bg', 'rgba(25, 25, 35, 0.7)');
        document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
        document.documentElement.style.setProperty('--text-secondary', '#B0B0C0');
        document.documentElement.style.setProperty('--glass-border', 'rgba(153, 69, 255, 0.2)');
        document.documentElement.style.setProperty('--glass-bg', 'rgba(15, 15, 25, 0.8)');
        document.documentElement.style.setProperty('--build-rise-color', '#FF6B9D');
        document.documentElement.style.setProperty('--build-rise-gradient', 'linear-gradient(135deg, #FF6B9D 0%, #FFD166 50%, #00D1FF 100%)');
    }
}

// Animate elements on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll('.feature-card, .nft-card, .token-stat-card, .roadmap-phase');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Music Player Functionality
function initializeMusicPlayer() {
    // Check if audio element exists
    if (!suolalaAudio) {
        console.error("Audio element not found");
        return;
    }
    
    // Set initial volume
    if (volumeSlider) {
        suolalaAudio.volume = volumeSlider.value / 100;
    }
    
    // Load song metadata
    suolalaAudio.addEventListener('loadedmetadata', function() {
        if (suolalaAudio.duration && !isNaN(suolalaAudio.duration)) {
            const duration = suolalaAudio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            if (songTitle) {
                songTitle.textContent = `SUOLALA Theme (${minutes}:${seconds.toString().padStart(2, '0')})`;
            }
        }
    });
    
    // Update progress bar
    suolalaAudio.addEventListener('timeupdate', function() {
        if (suolalaAudio.duration && !isNaN(suolalaAudio.duration) && progressBar) {
            const progress = (suolalaAudio.currentTime / suolalaAudio.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });
    
    // Handle song end (restart for loop)
    suolalaAudio.addEventListener('ended', function() {
        if (suolalaAudio.loop) {
            suolalaAudio.currentTime = 0;
            suolalaAudio.play().catch(e => console.log("Auto-restart failed:", e));
        } else {
            isPlaying = false;
            updateMusicButton();
        }
    });
    
    // Handle audio errors
    suolalaAudio.addEventListener('error', function(e) {
        console.error("Audio error:", e);
        if (songTitle) {
            songTitle.textContent = "Add suolalasong.mp3";
            songTitle.style.color = "var(--warning)";
        }
        if (musicToggle) {
            musicToggle.disabled = true;
            musicToggle.style.opacity = "0.5";
        }
    });
    
    // Update button when audio starts playing
    suolalaAudio.addEventListener('play', function() {
        isPlaying = true;
        updateMusicButton();
    });
    
    // Update button when audio pauses
    suolalaAudio.addEventListener('pause', function() {
        isPlaying = false;
        updateMusicButton();
    });
    
    // Initial button state
    updateMusicButton();
}

// Toggle play/pause
function toggleMusic() {
    if (!suolalaAudio) return;
    
    if (isPlaying) {
        suolalaAudio.pause();
    } else {
        suolalaAudio.play().then(() => {
            console.log("Audio play successful");
        }).catch(e => {
            console.log("Audio play failed:", e);
            if (musicToggle) {
                musicToggle.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    musicToggle.style.animation = '';
                }, 500);
            }
            
            // For browsers that require user interaction
            const playOnInteraction = () => {
                suolalaAudio.play().then(() => {
                    console.log("Audio play successful after interaction");
                }).catch(err => console.log("Still failed after interaction:", err));
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
        });
    }
}

// Update music button
function updateMusicButton() {
    if (!musicIcon || !musicPlayer) return;
    
    // Update icon
    musicIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    
    // Update player class for animation
    if (isPlaying) {
        musicPlayer.classList.add('playing');
    } else {
        musicPlayer.classList.remove('playing');
    }
}

// Initialize audio on first user interaction
function initAudioOnInteraction() {
    if (!audioInitialized && suolalaAudio) {
        console.log("Audio context initialized");
        audioInitialized = true;
        
        // On mobile, we'll load the audio but not autoplay
        suolalaAudio.load();
        
        // Show a subtle hint to user on mobile
        if (window.innerWidth <= 768 && songTitle) {
            const originalText = songTitle.textContent;
            songTitle.textContent = "Tap to play music";
            setTimeout(() => {
                songTitle.textContent = originalText;
            }, 2000);
        }
    }
}

// Real-time Data Updater
async function updateRealTimeData() {
    // Try to fetch real data first
    const realDataSuccess = await fetchRealTokenData();
    
    // If real data fetch fails or we want to keep the simulation running
    if (!realDataSuccess) {
        currentPrice = simulatePriceFluctuations();
    }
    
    // Update the chart if it exists
    updatePriceChart();
}

// Interactive NFT Cards
function setupNFTInteractions() {
    const nftCards = document.querySelectorAll('.nft-card');
    
    nftCards.forEach(card => {
        const buyBtn = card.querySelector('.btn-nft');
        
        if (buyBtn) {
            buyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add click animation
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300);
                
                // Show purchase modal or redirect (simulated)
                console.log(`NFT purchase attempt: ${card.querySelector('.nft-name').textContent}`);
                
                // Simulate purchase animation
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        }
        
        // Hover effect for NFT cards
        card.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.nft-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1.05)';
                placeholder.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.nft-placeholder');
            if (placeholder) {
                placeholder.style.transform = 'scale(1)';
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScrolling();
    initializeChart();
    setupThemeToggle();
    setupScrollAnimations();
    setupNFTInteractions();
    
    // Create enhanced background animations
    createParticles();
    createFloatingShapes();
    
    // Initialize music player
    if (suolalaAudio && musicToggle && volumeSlider) {
        initializeMusicPlayer();
        
        // Set up event listeners for music player
        musicToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMusic();
        });
        
        // Volume control
        volumeSlider.addEventListener('input', function() {
            if (suolalaAudio) {
                suolalaAudio.volume = this.value / 100;
            }
        });
        
        // Click on music player to toggle (except volume slider)
        if (musicPlayer) {
            musicPlayer.addEventListener('click', function(e) {
                if (e.target !== volumeSlider && !volumeSlider.contains(e.target) && e.target !== musicToggle) {
                    e.preventDefault();
                    toggleMusic();
                }
            });
            
            // Touch events for mobile - prevent scrolling when interacting with player
            musicPlayer.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, { passive: true });
            
            // Prevent context menu on long press for mobile
            musicPlayer.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
        
        // Initialize audio on first user interaction
        document.addEventListener('click', initAudioOnInteraction, { once: true });
        document.addEventListener('touchstart', initAudioOnInteraction, { once: true });
        
        // Also initialize if user interacts with any button
        document.querySelectorAll('button, a').forEach(element => {
            element.addEventListener('click', initAudioOnInteraction, { once: true });
        });
    }
    
    // Fetch real token data on load
    fetchRealTokenData();
    
    // Start price updates every 3 seconds for simulation
    const simulationInterval = setInterval(() => {
        simulatePriceFluctuations();
    }, 3000);
    
    // Fetch real data every 30 seconds
    const realDataInterval = setInterval(async () => {
        await fetchRealTokenData();
    }, 30000);
    
    // Add animation classes
    document.body.classList.add('loaded');
    
    // Check if audio file exists
    if (suolalaAudio) {
        suolalaAudio.addEventListener('canplaythrough', () => {
            console.log("SUOLALA song is ready to play");
        });
        
        // Set a timeout to check if audio loaded
        setTimeout(() => {
            if (suolalaAudio.readyState < 2 && songTitle) {
                console.log("Audio file may be missing or inaccessible");
                songTitle.textContent = "Add suolalasong.mp3";
                songTitle.style.color = "var(--warning)";
            }
        }, 3000);
    }
    
    // Add click animations to all buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for theme toggle and particles
const themeToggleCSS = `
.theme-toggle {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-primary);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 1001;
    box-shadow: 0 5px 20px rgba(153, 69, 255, 0.4);
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    transform: scale(1.1) rotate(30deg);
    box-shadow: 0 8px 25px rgba(153, 69, 255, 0.6);
}

@media (max-width: 768px) {
    .theme-toggle {
        bottom: 80px;
        right: 15px;
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
}

/* Animation classes */
.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Particle animations */
@keyframes particleMove {
    0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(var(--move-x, 0));
        opacity: 0;
    }
}

/* Negative price change */
.price-change.negative {
    color: var(--warning);
}

/* Shake animation for audio errors */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Ripple effect for buttons */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Click animation for NFT buttons */
.btn-nft.clicked {
    animation: nftClick 0.3s ease;
}

@keyframes nftClick {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
}

/* Solana logo pulse */
@keyframes solanaPulse {
    0%, 100% {
        opacity: 0.7;
        transform: scaleY(1);
    }
    50% {
        opacity: 1;
        transform: scaleY(1.3);
    }
}

/* Floating shapes */
@keyframes float {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    25% {
        transform: translate(100px, 50px) rotate(90deg);
    }
    50% {
        transform: translate(50px, 100px) rotate(180deg);
    }
    75% {
        transform: translate(-50px, 50px) rotate(270deg);
    }
}

/* Text glow for hero */
@keyframes textGlow {
    0%, 100% {
        filter: drop-shadow(0 0 10px rgba(255, 107, 157, 0.3));
    }
    50% {
        filter: drop-shadow(0 0 20px rgba(255, 107, 157, 0.6));
    }
}

/* Pulse animation for current roadmap phase */
@keyframes pulse {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(153, 69, 255, 0.4);
    }
    50% {
        box-shadow: 0 0 0 15px rgba(153, 69, 255, 0);
    }
}

/* Music player pulse */
@keyframes musicPulse {
    0% {
        box-shadow: 0 0 0 0 rgba(153, 69, 255, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(153, 69, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(153, 69, 255, 0);
    }
}

/* Grid background animation */
@keyframes gridMove {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(20px, 20px);
    }
}

/* Glow pulse animation */
@keyframes glowPulse {
    0%, 100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
    }
    50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.1);
    }
}

/* Glow rotate animation */
@keyframes glowRotate {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

/* Twinkle effect for particles */
@keyframes twinkle {
    0%, 100% {
        opacity: 0.2;
    }
    50% {
        opacity: 1;
    }
}
`;

// Inject theme toggle CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = themeToggleCSS;
document.head.appendChild(styleSheet);

// Handle page visibility change for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause music and reduce intervals
        if (suolalaAudio && isPlaying) {
            suolalaAudio.pause();
        }
    } else {
        // Page is visible again, resume if needed
        if (suolalaAudio && isPlaying) {
            suolalaAudio.play().catch(e => console.log("Resume failed:", e));
        }
    }
});

// Add error handling for network issues
window.addEventListener('online', function() {
    console.log("Network connection restored");
    // Try to fetch real data again
    fetchRealTokenData();
});

window.addEventListener('offline', function() {
    console.log("Network connection lost");
    // Show offline message or handle gracefully
    if (songTitle) {
        songTitle.textContent = "SUOLALA Theme (Offline)";
    }
});

// Add copy contract address functionality
document.querySelectorAll('.contract-info, .info-item code').forEach(element => {
    element.addEventListener('click', function() {
        const contractAddress = 'CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8';
        navigator.clipboard.writeText(contractAddress).then(() => {
            // Show copied message
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.color = 'var(--success)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 2000);
        });
    });
});
