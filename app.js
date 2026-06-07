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
const auth = firebase.auth();
const db = firebase.firestore();

// =========================================
// 2. FORM SELECTION & VALIDATION LOGIC
// =========================================
const registerForm = document.getElementById('registrationForm');
const ageError = document.getElementById('ageError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.querySelector('.btn-submit');

registerForm.addEventListener('submit', (e) => {
    // Stop the page from refreshing automatically
    e.preventDefault();

    // Clear any previous error messages
    ageError.style.display = 'none';
    passwordError.style.display = 'none';

    // Grab all the user input values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const age = parseInt(document.getElementById('age').value);
    const phone = document.getElementById('phone').value;
    const track = document.getElementById('track').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // RULE 1: Age Gate (13 - 30)
    if (age < 13 || age > 30) {
        ageError.innerText = "You must be between 13 and 30 to apply.";
        ageError.style.display = 'block';
        return;
    }

    // RULE 2: Password Match Check
    if (password !== confirmPassword) {
        passwordError.innerText = "Passwords do not match!";
        passwordError.style.display = 'block';
        return;
    }

    // Change button text to show it's loading
    submitBtn.innerText = "Creating Account...";
    submitBtn.disabled = true;

    // =========================================
    // 3. CREATE ACCOUNT & SAVE TO DATABASE
    // =========================================
    
    // Step A: Create the secure login in Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Step B: Save profile data into Firestore Database
            // We use the unique 'user.uid' as the document ID to link Auth and DB
            return db.collection("applicants").doc(user.uid).set({
                name: fullName,
                email: email,
                age: age,
                phoneNumber: phone,
                chosenTrack: track,
                status: "Pending Review", // Default status for new students
                role: "student",
                registrationDate: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            // Step C: Success! Redirect to the Dashboard
            alert("Account created successfully! Welcome to YLC.");
            window.location.href = "dashboard.html"; 
        })
        .catch((error) => {
            // Step D: Handle Errors (like if the email is already used)
            console.error("Registration Error:", error);
            alert("Registration failed: " + error.message);
            
            // Reset button so they can try again
            submitBtn.innerText = "Register & Create Account";
            submitBtn.disabled = false;
        });
});
