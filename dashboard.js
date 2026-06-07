const firebaseConfig = {
    apiKey: "AIzaSyCx4apmVQDOqH1bO7XqDkCOqVk7ElcWHVA",
    authDomain: "ylc-talent-app.firebaseapp.com",
    projectId: "ylc-talent-app",
    storageBucket: "ylc-talent-app.firebasestorage.app",
    messagingSenderId: "209480215567",
    appId: "1:209480215567:web:f04d6bf8da0355a2da877a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Styled asset illustrations mapping array mimicking design grid images
const creativeArtsResources = [
    { title: "Portfolio Guide", style: "gradient-orange", emoji: "🎨" },
    { title: "Video Editing", style: "gradient-dark", emoji: "🎬" },
    { title: "Illustration Pack", style: "gradient-blue", emoji: "🖌️" },
    { title: "Audio Production", style: "gradient-orange", emoji: "🎵" }
];

auth.onAuthStateChanged((user) => {
    if (user) {
        fetchUserPortalData(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

function fetchUserPortalData(uid) {
    db.collection("applicants").doc(uid).get()
    .then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            
            // Set basic naming labels
            document.getElementById('welcomeName').innerText = data.name || "Denis";
            
            // Set global header profile imagery syncs
            document.getElementById('userAvatar').src = data.avatarUrl || "https://via.placeholder.com/150";
            document.getElementById('topNavAvatar').src = data.avatarUrl || "https://via.placeholder.com/150";

            // Render Horizontal Progress Milestone Nodes Array
            renderHorizontalSteps(data.status || "Approved");

            // Render Premium Resource Items cards
            renderSquareResources();

            // Render Premium Community Stream layout
            renderPremiumFeed();
        }
    });
}

function renderHorizontalSteps(status) {
    const container = document.getElementById('stepsRowContainer');
    const steps = [
        { label: "Account Created", done: true, num: "✓" },
        { label: "Profile Completed", done: true, num: "✓" },
        { label: "Application Submitted", done: true, num: "✓" },
        { label: "Application Approved", done: (status === "Approved"), num: "✓" },
        { label: "Join Community", done: false, num: "5" },
        { label: "Download Learning Pack", done: false, num: "6" }
    ];

    container.innerHTML = "";
    steps.forEach(step => {
        const stepNode = document.createElement('div');
        stepNode.className = `timeline-step-node ${step.done ? 'active-node' : ''}`;
        stepNode.innerHTML = `
            <div class="node-circle-indicator">${step.num}</div>
            <span class="node-label-caption">${step.label}</span>
        `;
        container.appendChild(stepNode);
    });
}

function renderSquareResources() {
    const container = document.getElementById('resourceWorkspaceContainer');
    container.innerHTML = "";

    creativeArtsResources.forEach(res => {
        const itemCard = document.createElement('div');
        itemCard.className = "premium-square-resource-card";
        itemCard.innerHTML = `
            <div class="resource-illustration-box ${res.style}">${res.emoji}</div>
            <p class="resource-card-title-label">${res.title}</p>
            <button class="btn-card-action-mini">View</button>
        `;
        container.appendChild(itemCard);
    });
}

function renderPremiumFeed() {
    const container = document.getElementById('communityFeedContainer');
    container.innerHTML = `
        <div class="premium-community-container">
            <div class="post-profile-row">
                <div class="mini-profile-avatar" style="display:flex;align-items:center;justify-content:center;background:#f3e8ff;font-size:1rem;">🎨</div>
                <div class="post-author-details">
                    <h4>Creative Arts Team</h4>
                    <span>Today at 9:30 AM</span>
                </div>
            </div>
            <p class="post-body-paragraph">Our Creative Arts students completed their first digital illustration challenge. Amazing work! 🎨✨</p>
            <div class="post-image-grid-box">
                <img class="feed-inline-img" src="https://via.placeholder.com/150/f472b6/ffffff?text=Art+1" alt="Grid Image">
                <img class="feed-inline-img" src="https://via.placeholder.com/150/7c3aed/ffffff?text=Art+2" alt="Grid Image">
            </div>
            <div class="post-footer-actions-row">
                <span>❤️ 24 Likes</span>
                <span>💬 8 Comments</span>
            </div>
        </div>
    `;
}

// Basic structural wireframe handler for session destruction logs
document.getElementById('trayProfileBtn').addEventListener('click', () => {
    if(confirm("Do you want to sign out of the system workspace portal?")) {
        auth.signOut().then(() => { window.location.href = "login.html"; });
    }
});
