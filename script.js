// Read name or message from URL parameters
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('name')) {
    document.getElementById('display-name').innerText = urlParams.get('name');
}
if(urlParams.has('msg')) {
    document.getElementById('display-message').innerText = urlParams.get('msg');
}

// Function to open the gift box with smooth transition
function openGift() {
    const overlay = document.getElementById('gift-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 500); 
}

// Function to generate and copy the custom wish link
function generateWish() {
    const name = document.getElementById('input-name').value;
    const msg = document.getElementById('input-message').value;
    const photoInput = document.getElementById('input-photo');
    
    if(!name) {
        alert('Please enter your name!');
        return;
    }

    // Handle local image preview if selected
    if(photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-img').src = e.target.result;
        }
        reader.readAsDataURL(photoInput.files[0]);
    }

    // Generate sharing link
    const currentUrl = window.location.href.split('?')[0];
    const generatedLink = `${currentUrl}?name=${encodeURIComponent(name)}&msg=${encodeURIComponent(msg)}`;
    
    prompt("Your wish link has been generated! Copy it and share via WhatsApp:", generatedLink);
}
