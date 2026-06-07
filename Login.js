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

// Initialize Firebase Instance
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// =========================================
// 2. LOGIN HANDLING LOGIC
// =========================================
const loginForm = document.getElementById('loginForm');
const submitBtn = document.querySelector('.btn-submit');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page reload

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Change button layout state to indicate loading
        submitBtn.innerText = "Verifying Credentials...";
        submitBtn.disabled = true;

        // Fire request down Firebase Auth authentication pipeline
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Success! Redirect directly into the portal ecosystem
                alert("Login successful! Redirecting to your dashboard...");
                window.location.href = "dashboard.html";
            })
            .catch((error) => {
                // Handle wrong password, account doesn't exist, etc.
                console.error("Login System Fault Encountered:", error);
                alert("Login Failed: " + error.message);
                
                // Re-enable button for another attempt
                submitBtn.innerText = "Sign In";
                submitBtn.disabled = false;
            });
    });
}
