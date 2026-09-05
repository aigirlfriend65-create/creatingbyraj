// Galaxy & Stars Background Animation Script
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Create Star Particles
class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.baseSpeed = Math.random() * 0.5 + 0.2;
        this.color = ['#ffffff', '#ff99cc', '#99ccff', '#ffcc00'][Math.floor(Math.random() * 4)];
    }
    update() {
        this.y -= this.baseSpeed;
        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Init Stars
for (let i = 0; i < 150; i++) {
    stars.push(new Star());
}

function animateGalaxy() {
    ctx.clearRect(0, 0, width, height);
    
    // Create a subtle deep space nebula gradient effect
    let gradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, '#1a0033'); // Deep purple center
    gradient.addColorStop(0.5, '#0d001a');
    gradient.addColorStop(1, '#000000'); // Pure space black edges
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Render and update stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateGalaxy);
}
animateGalaxy();

// Read parameters from URL
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('name')) {
    document.getElementById('display-name').innerText = urlParams.get('name');
}
if(urlParams.has('msg')) {
    document.getElementById('display-message').innerText = urlParams.get('msg');
}
if(urlParams.has('img')) {
    document.getElementById('profile-img').src = urlParams.get('img');
}

// Function to open the gift box
function openGift() {
    const overlay = document.getElementById('gift-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 500); 
}

// Function to generate wish link
function generateWish() {
    const name = document.getElementById('input-name').value;
    const msg = document.getElementById('input-message').value;
    const photoUrl = document.getElementById('input-photo-url').value;
    
    if(!name) {
        alert('Please enter your name!');
        return;
    }

    const currentUrl = window.location.href.split('?')[0];
    let generatedLink = `${currentUrl}?name=${encodeURIComponent(name)}&msg=${encodeURIComponent(msg)}`;
    
    if(photoUrl) {
        generatedLink += `&img=${encodeURIComponent(photoUrl)}`;
    }

    const resultBox = document.getElementById('link-result-box');
    const linkInput = document.getElementById('generated-link-input');
    
    linkInput.value = generatedLink;
    resultBox.style.display = 'block';
}

// Function to copy link
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
