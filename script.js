const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let fireworks = [];
let angle = 0;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Star Particles
class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.color = ['#ffffff', '#ff99cc', '#99ccff', '#ffcc00'][Math.floor(Math.random() * 4)];
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 120; i++) {
    stars.push(new Star());
}

// Firework (Potka) Animation from bottom to top
class Firework {
    constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = Math.random() * (height / 2);
        this.speed = Math.random() * 4 + 4;
        this.exploded = false;
        this.particles = [];
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    }
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                for (let i = 0; i < 40; i++) {
                    this.particles.push({
                        x: this.x,
                        y: this.y,
                        angle: Math.random() * Math.PI * 2,
                        speed: Math.random() * 5 + 1,
                        alpha: 1
                    });
                }
            }
        } else {
            this.particles.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.alpha -= 0.02;
            });
        }
    }
    draw() {
        if (!this.exploded) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, 3, 10);
        } else {
            this.particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = Math.max(p.alpha, 0);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    }
}

function animateScene() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Draw Stars
    stars.forEach(star => star.draw());

    // Galaxy, Sun, Earth, Moon Orbit Animation
    let centerX = width / 2;
    let centerY = height / 2;

    // Center Sun
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ffaa00';
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Earth Orbit
    let earthDist = 120;
    let earthX = centerX + Math.cos(angle) * earthDist;
    let earthY = centerY + Math.sin(angle) * earthDist;

    ctx.fillStyle = '#3399ff';
    ctx.beginPath();
    ctx.arc(earthX, earthY, 16, 0, Math.PI * 2);
    ctx.fill();

    // Moon Orbit around Earth
    let moonDist = 30;
    let moonX = earthX + Math.cos(angle * 4) * moonDist;
    let moonY = earthY + Math.sin(angle * 4) * moonDist;

    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 6, 0, Math.PI * 2);
    ctx.fill();

    angle += 0.015; // Speed of rotation

    // Random Fireworks from bottom
    if (Math.random() < 0.04) {
        fireworks.push(new Firework());
    }

    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.exploded && fw.particles.every(p => p.alpha <= 0)) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animateScene);
}
animateScene();

// URL Parameters handling
const urlParams = new URLSearchParams(window.location.search);
const customName = urlParams.get('name') || "Raj Khan";
const customMsg = urlParams.get('msg') || "May your life be filled with endless joy, success, and happiness. Happy Birthday!";

// Typing Effect Function
function typeWriter(text, elementId, speed, callback) {
    let i = 0;
    const el = document.getElementById(elementId);
    el.innerHTML = "";
    function typing() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else if (callback) {
            callback();
        }
    }
    typing();
}

// Open Gift Box & Trigger Typing
function openGift() {
    const overlay = document.getElementById('gift-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        // Sequence of typing animations
        typeWriter("🎂 Happy Birthday! 🎉", "typing-banner", 70, () => {
            typeWriter(customName, "typing-name", 100, () => {
                typeWriter(customMsg, "typing-message", 40);
            });
        });
    }, 500); 
}

// Generate Wish Link with Local Photo Support
function generateWish() {
    const name = document.getElementById('input-name').value;
    const msg = document.getElementById('input-message').value;
    const photoInput = document.getElementById('input-photo');
    
    if(!name) {
        alert('Please enter your name!');
        return;
    }

    if(photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-img').src = e.target.result;
        }
        reader.readAsDataURL(photoInput.files[0]);
    }

    const currentUrl = window.location.href.split('?')[0];
    const generatedLink = `${currentUrl}?name=${encodeURIComponent(name)}&msg=${encodeURIComponent(msg)}`;
    
    const resultBox = document.getElementById('link-result-box');
    const linkInput = document.getElementById('generated-link-input');
    
    linkInput.value = generatedLink;
    resultBox.style.display = 'block';
}

function copyLink() {
    const linkInput = document.getElementById('generated-link-input');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(linkInput.value).then(() => {
        alert('Link copied to clipboard successfully!');
    }).catch(err => {
        alert('Failed to copy link. Please select and copy manually.');
    });
}
