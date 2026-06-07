// =========================================
// 1. FIREBASE CONFIGURATION
// =========================================
const firebaseConfig = {
  apiKey: "AIzaSyCx4apmVQDOqH1bO7XqDkCOqVk7ElcWHVA",
  authDomain: "ylc-talent-app.firebaseapp.com",
  projectId: "ylc-talent-app",
  storageBucket: "ylc-talent-app.firebasestorage.app",
  messagingSenderId: "209480215567",
  appId: "1:209480215567:web:f04d6bf8da0355a2da877a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// =========================================
// 2. FRONTEND SECURITY PASSWORD GATE
// =========================================
const MASTER_PASSWORD = "ylcadmin2026"; // You can change this secret password anytime!

const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('adminPassword');
const authScreen = document.getElementById('adminAuthScreen');
const dashboard = document.getElementById('adminDashboard');
const loginError = document.getElementById('loginError');

loginBtn.addEventListener('click', () => {
    if (passwordInput.value === MASTER_PASSWORD) {
        // Hide password wall and display the workspace dashboard
        authScreen.style.display = 'none';
        dashboard.style.display = 'block';
        
        // Fetch data from Firestore once authenticated
        fetchApplicants();
    } else {
        loginError.style.display = 'block';
        passwordInput.value = '';
    }
});

// Allow hitting "Enter" key on keyboard to log in too
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loginBtn.click();
});


// =========================================
// 3. FETCH DATA & DYNAMICALLY BUILD TABLE
// =========================================
function fetchApplicants() {
    const tableBody = document.getElementById('tableBody');
    const totalCountEl = document.getElementById('totalCount');

    // Order applicant stream records by registration date descending
    db.collection("applicants").orderBy("registrationDate", "desc")
    .onSnapshot((snapshot) => {
        // Clear old rows to prevent duplication on data updates
        tableBody.innerHTML = "";
        
        // Update total metrics count badge indicator
        totalCountEl.innerText = snapshot.size;

        if (snapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#999;">No applicants have registered yet.</td></tr>`;
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Format timestamps into clear dates
            let formattedDate = "N/A";
            if (data.registrationDate) {
                const dateObj = data.registrationDate.toDate();
                formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            // Create structural row markup
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight:500; color:var(--primary-blue);">${data.name || 'Anonymous'}</td>
                <td>${data.age || 'N/A'}</td>
                <td><a href="tel:${data.phoneNumber}" style="color:var(--primary-orange); text-decoration:none; font-weight:500;">${data.phoneNumber || 'N/A'}</a></td>
                <td><span style="background:#e0eaf5; padding:4px 10px; border-radius:12px; font-size:0.85rem; font-weight:500;">${data.chosenTrack || 'General'}</span></td>
                <td style="font-size:0.9rem; color:#666;">${formattedDate}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }, (error) => {
        console.error("Error listening to collection state loops: ", error);
    });
}
