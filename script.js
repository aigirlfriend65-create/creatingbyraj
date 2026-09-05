// Read Name and Photo from URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const customName = urlParams.get('name');
const customPhoto = urlParams.get('photo');

const wishSection = document.getElementById('wish-section');
const createSection = document.getElementById('create-section');
const birthdayName = document.getElementById('birthday-name');
const birthdayPhoto = document.getElementById('birthday-photo');

if (customName && customPhoto) {
    birthdayName.innerText = decodeURIComponent(customName);
    birthdayPhoto.src = decodeURIComponent(customPhoto);
}

// Form Submission to Generate Custom Link
document.getElementById('wish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('input-name').value;
    const photo = document.getElementById('input-photo').value;
    
    const currentUrl = window.location.origin + window.location.pathname;
    const finalLink = `${currentUrl}?name=${encodeURIComponent(name)}&photo=${encodeURIComponent(photo)}`;
    
    document.getElementById('final-link').value = finalLink;
    document.getElementById('generated-link-box').classList.remove('hidden');
});

// Copy Link Button
document.getElementById('copy-btn').addEventListener('click', function() {
    const linkInput = document.getElementById('final-link');
    linkInput.select();
    document.execCommand('copy');
    alert('Link copied to clipboard! Now you can share it with your friend.');
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

// Create 3D Floating Particles
const geometry = new THREE.BufferGeometry();
const count = 800;
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 12;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.035, color: 0xff007f });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 3;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
