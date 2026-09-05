// URL Parameters থেকে নাম ও ছবি রিড করা
const urlParams = new URLSearchParams(window.location.search);
const customName = urlParams.get('name');
const customPhoto = urlParams.get('photo');

const wishSection = document.getElementById('wish-section');
const createSection = document.getElementById('create-section');
const birthdayName = document.getElementById('birthday-name');
const birthdayPhoto = document.getElementById('birthday-photo');
const wishMessageElement = document.getElementById('wish-message');

const defaultMessage = "May your day be filled with lots of love, laughter, and happiness. Wishing you a fantastic and glorious year ahead!";

if (customName) {
    birthdayName.innerText = decodeURIComponent(customName);
}

if (customPhoto) {
    birthdayPhoto.src = decodeURIComponent(customPhoto);
}

// Typewriter Effect Function
let i = 0;
function typeWriter() {
    if (i < defaultMessage.length) {
        wishMessageElement.innerHTML += defaultMessage.charAt(i);
        i++;
        setTimeout(typeWriter, 40);
    }
}
window.onload = function() {
    typeWriter();
};

// লোকাল ফাইলকে Base64-এ কনভার্ট করে লিংক তৈরি করার ফর্ম লজিক
document.getElementById('wish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('input-name').value;
    const photoInput = document.getElementById('input-photo').files[0];

    if (photoInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Photo = event.target.result;
            
            const currentUrl = window.location.origin + window.location.pathname;
            const finalLink = `${currentUrl}?name=${encodeURIComponent(name)}&photo=${encodeURIComponent(base64Photo)}`;
            
            document.getElementById('final-link').value = finalLink;
            document.getElementById('generated-link-box').classList.remove('hidden');
        };
        reader.readAsDataURL(photoInput);
    }
});

// Modern & Secure Copy Link Function (Fixes copy fail issue)
document.getElementById('copy-btn').addEventListener('click', async function() {
    const linkInput = document.getElementById('final-link');
    
    try {
        await navigator.clipboard.writeText(linkInput.value);
        alert('Link copied successfully! Now you can share it.');
    } catch (err) {
        // Fallback method if Clipboard API is blocked
        linkInput.select();
        linkInput.setSelectionRange(0, 99999); // For mobile devices
        try {
            document.execCommand('copy');
            alert('Link copied successfully!');
        } catch (error) {
            alert('Failed to copy. Please select the text manually and copy.');
        }
    }
});

// Toggle to Create Section
document.getElementById('create-own-btn').addEventListener('click', function() {
    wishSection.classList.add('hidden');
    createSection.classList.remove('hidden');
});

// Back Button
document.getElementById('back-btn').addEventListener('click', function() {
    createSection.classList.add('hidden');
    wishSection.classList.remove('hidden');
});

// Confetti Animation Trigger
document.getElementById('celebrate-btn').addEventListener('click', function() {
    confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 }
    });
});

// Three.js 3D Background Effect
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const count = 800;
const positions = new Float32Array(count * 3);

for(let j = 0; j < count * 3; j++) {
    positions[j] = (Math.random() - 0.5) * 12;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.035, color: 0xff007f });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 3;

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
