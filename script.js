// URL Parameters থেকে নাম, ছবি ও মেসেজ রিড করা
const urlParams = new URLSearchParams(window.location.search);
const customName = urlParams.get('name');
const customPhoto = urlParams.get('photo');
const customMsg = urlParams.get('msg');

const birthdayName = document.getElementById('birthday-name');
const birthdayPhoto = document.getElementById('birthday-photo');
const wishMessageElement = document.getElementById('wish-message');

const defaultMessage = "May your day be filled with endless joy, beautiful moments, and all the success in the world. Wishing you a fantastic and glorious year ahead!";

if (customName) {
    birthdayName.innerText = decodeURIComponent(customName);
}

if (customPhoto) {
    birthdayPhoto.src = decodeURIComponent(customPhoto);
}

const finalMessageToType = customMsg ? decodeURIComponent(customMsg) : defaultMessage;

// Gift Box Click Open Logic (2 Seconds Animation Effect)
document.getElementById('open-gift-btn').addEventListener('click', function() {
    const giftOverlay = document.getElementById('gift-overlay');
    const mainContent = document.getElementById('main-content');
    
    // গিফট বক্স খোলার অ্যানিমেশন ইফেক্ট
    giftOverlay.style.transform = 'scale(1.5)';
    giftOverlay.style.opacity = '0';
    
    setTimeout(() => {
        giftOverlay.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // অটো কনফেটি ও পটকা ইফেক্ট
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 }
        });

        // টাইপিং ইফেক্ট শুরু হবে
        typeWriter();
    }, 500);
});

// Typewriter Effect Function
let i = 0;
function typeWriter() {
    if (i < finalMessageToType.length) {
        wishMessageElement.innerHTML += finalMessageToType.charAt(i);
        i++;
        setTimeout(typeWriter, 35);
    }
}

// লোকাল ফাইলকে Base64-এ কনভার্ট করে লিংক তৈরি করার ফর্ম লজিক
document.getElementById('wish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('input-name').value;
    const msg = document.getElementById('input-custom-msg').value;
    const photoInput = document.getElementById('input-photo').files[0];

    if (photoInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Photo = event.target.result;
            
            const currentUrl = window.location.origin + window.location.pathname;
            const finalLink = `${currentUrl}?name=${encodeURIComponent(name)}&msg=${encodeURIComponent(msg)}&photo=${encodeURIComponent(base64Photo)}`;
            
            document.getElementById('final-link').value = finalLink;
            document.getElementById('generated-link-box').classList.remove('hidden');
        };
        reader.readAsDataURL(photoInput);
    }
});

// Copy Link Button with fallback
document.getElementById('copy-btn').addEventListener('click', async function() {
    const linkInput = document.getElementById('final-link');
    try {
        await navigator.clipboard.writeText(linkInput.value);
        alert('Link copied successfully! Now share it with your friend.');
    } catch (err) {
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            alert('Link copied successfully!');
        } catch (error) {
            alert('Failed to copy. Please select and copy manually.');
        }
    }
});

// Confetti & Fireworks Trigger Button
document.getElementById('celebrate-btn').addEventListener('click', function() {
    confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.6 }
    });
});

// Three.js 3D Background Effect (Floating Particles/Stars)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const count = 900;
const positions = new Float32Array(count * 3);

for(let j = 0; j < count * 3; j++) {
    positions[j] = (Math.random() - 0.5) * 15;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.04, color: 0xff007f });
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
