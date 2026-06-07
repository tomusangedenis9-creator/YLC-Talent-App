// Ensure everything loads before running the scripts
document.addEventListener("DOMContentLoaded", function() {

    // 1. FILTERING TABS LOGIC
    const filterChips = document.querySelectorAll('.filter-chip');
    const feedCards = document.querySelectorAll('.feed-card');

    if(filterChips && feedCards) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active styling from all chips, add to the clicked one
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                // Get the track name we want to filter by
                const filterValue = chip.getAttribute('data-filter');

                // Hide/Show matching cards
                feedCards.forEach(card => {
                    const cardTrack = card.getAttribute('data-track');
                    if (filterValue === 'all' || filterValue === cardTrack) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. ADMIN CREATE POST LOGIC
    const postInput = document.getElementById('adminPostInput');
    const feedContainer = document.getElementById('feedContainer');

    if(postInput && feedContainer) {
        postInput.addEventListener('keypress', function(e) {
            // When Admin presses Enter key and input is not empty
            if (e.key === 'Enter' && this.value.trim() !== '') {
                const text = this.value.trim();
                
                // Build a basic Admin Announcement Card
                const newPostHTML = `
                <div class="feed-card" data-track="all" style="border: 2px solid #7c3aed;">
                    <div class="card-header">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=1e293b&color=fff" class="card-avatar" alt="Admin">
                        <div class="card-meta">
                            <h4>Admin Announcement</h4>
                            <p>Just now</p>
                        </div>
                        <div class="track-badge" style="background: #ef4444; color: white;">
                            <span class="material-symbols-outlined">campaign</span>
                            Announcement
                        </div>
                        <button class="icon-btn"><span class="material-symbols-outlined">more_vert</span></button>
                    </div>
                    <div class="post-text">${text}</div>
                    <div class="post-actions" style="border-bottom: none; padding-bottom: 0;">
                        <button class="action-btn" onclick="toggleLike(this)">
                            <span class="material-symbols-outlined">favorite</span>
                            <span class="like-count">0</span> Likes
                        </button>
                        <button class="action-btn" onclick="openComments()">
                            <span class="material-symbols-outlined">chat_bubble_outline</span>
                            0 Comments
                        </button>
                    </div>
                </div>`;

                // Inject it to the top of the feed instantly
                feedContainer.insertAdjacentHTML('afterbegin', newPostHTML);
                
                // Clear the input field
                this.value = '';
            }
        });
    }
});

// 3. LIKE BUTTON LOGIC (Global function so HTML can call it)
function toggleLike(btn) {
    const countSpan = btn.querySelector('.like-count');
    let currentLikes = parseInt(countSpan.innerText);

    if (btn.classList.contains('liked')) {
        // Unlike action
        btn.classList.remove('liked');
        countSpan.innerText = currentLikes - 1;
    } else {
        // Like action
        btn.classList.add('liked');
        countSpan.innerText = currentLikes + 1;
    }
}

// 4. PLACEHOLDER ALERTS FOR COMMENTS & SHARE
function openComments() {
    alert("This will open the full comment section to type a reply!");
}

function sharePost() {
    alert("Native device share menu will pop up here!");
}
// Hardcoded dictionary to manage separate mock databases for different post threads
let commentsDatabase = {
    "post-1": [
        { author: "Aisha N.", text: "This is so inspiring! Great job team! 👏", time: "1h ago", avatar: "https://ui-avatars.com/api/?name=Aisha+N&background=e2e8f0" },
        { author: "Musa K.", text: "Absolutely stunning work! Can't wait to see more.", time: "45m ago", avatar: "https://ui-avatars.com/api/?name=Musa+K&background=bfdbfe" }
    ],
    "post-2": [
        { author: "Brian M.", text: "Great work team! The designs look professional. 🚀", time: "2h ago", avatar: "https://ui-avatars.com/api/?name=Brian+M&background=dcfce3&color=166534" }
    ]
};

// Global tracker to remember which specific post is currently opened inside the sliding sheet
let currentActivePostId = null;

document.addEventListener("DOMContentLoaded", function() {

    // 1. TRACK FILTERING LOGIC
    const filterChips = document.querySelectorAll('.filter-chip');
    const feedCards = document.querySelectorAll('.feed-card');

    if(filterChips && feedCards) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const filterValue = chip.getAttribute('data-filter');

                feedCards.forEach(card => {
                    const cardTrack = card.getAttribute('data-track');
                    if (filterValue === 'all' || filterValue === cardTrack) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 2. ADMIN ANNOUNCEMENT GENERATOR
    const postInput = document.getElementById('adminPostInput');
    const feedContainer = document.getElementById('feedContainer');

    if(postInput && feedContainer) {
        postInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                const text = this.value.trim();
                const uniqueId = "post-" + Date.now(); // assign unique index for new post
                commentsDatabase[uniqueId] = []; // initialize blank comments array for this post
                
                const newPostHTML = `
                <div class="feed-card" data-track="all" style="border: 2px solid #7c3aed;">
                    <div class="card-header">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=1e293b&color=fff" class="card-avatar" alt="Admin">
                        <div class="card-meta">
                            <h4>Admin Announcement</h4>
                            <p>Just now</p>
                        </div>
                        <div class="track-badge" style="background: #ef4444; color: white;">
                            <span class="material-symbols-outlined">campaign</span>
                            Announcement
                        </div>
                    </div>
                    <div class="post-text">${text}</div>
                    <div class="post-actions" style="border-bottom: none; padding-bottom: 0;">
                        <button class="action-btn" onclick="toggleLike(this)">
                            <span class="material-symbols-outlined">favorite</span>
                            <span class="like-count">0</span> Likes
                        </button>
                        <button class="action-btn" onclick="openComments('${uniqueId}')">
                            <span class="material-symbols-outlined">chat_bubble_outline</span>
                            <span class="comment-count-badge">0</span> Comments
                        </button>
                    </div>
                </div>`;

                feedContainer.insertAdjacentHTML('afterbegin', newPostHTML);
                this.value = '';
            }
        });
    }

    // 3. EVENT HANDLER FOR COMMENT TRAY SEND KEY
    const userCommentInput = document.getElementById('userCommentInput');
    const submitCommentBtn = document.getElementById('submitCommentBtn');

    if(userCommentInput && submitCommentBtn) {
        // Trigger on clicking the send arrow
        submitCommentBtn.addEventListener('click', executeAddComment);
        // Trigger on hitting enter inside the drawer input
        userCommentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') executeAddComment();
        });
    }
});

// LIKE TOGGLE FUNCTION
function toggleLike(btn) {
    const countSpan = btn.querySelector('.like-count');
    let currentLikes = parseInt(countSpan.innerText);
    if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        countSpan.innerText = currentLikes - 1;
    } else {
        btn.classList.add('liked');
        countSpan.innerText = currentLikes + 1;
    }
}

// 4. TIKTOK-STYLE COMMENT SLIDE SHEET CONTROLLERS
function openComments(postId) {
    // If no postId provided natively (e.g. static HTML cards), fall back to defaults
    if (!postId) {
        // Find out if it's the first or second card to fake the assignment safely
        currentActivePostId = "post-1"; 
    } else {
        currentActivePostId = postId;
    }

    const overlay = document.getElementById('commentDrawerOverlay');
    const drawer = document.getElementById('commentDrawer');
    
    // Render existing comments from database array
    renderDrawerComments();

    // Fire CSS Open animations
    overlay.classList.add('open');
    drawer.classList.add('open');
}

function closeComments() {
    document.getElementById('commentDrawerOverlay').classList.remove('open');
    document.getElementById('commentDrawer').classList.remove('open');
}

function renderDrawerComments() {
    const commentsList = document.getElementById('drawerCommentsList');
    const countBadge = document.getElementById('drawerCommentCount');
    
    const activeComments = commentsDatabase[currentActivePostId] || [];
    countBadge.innerText = activeComments.length;
    
    // Clear the tray clean
    commentsList.innerHTML = '';

    if (activeComments.length === 0) {
        commentsList.innerHTML = `<p style="text-align:center; color:#94a3b8; font-size:0.85rem; margin-top:40px;">Be the first to leave a comment on this work!</p>`;
        return;
    }

    // Loop data inside dynamic items
    activeComments.forEach(cmt => {
        const itemHTML = `
        <div class="comment-box">
            <img src="${cmt.avatar}" class="comment-avatar" alt="User">
            <div class="comment-content">
                <div class="comment-author">${cmt.author}</div>
                <div class="comment-text">${cmt.text}</div>
                <div class="comment-footer">
                    <span>${cmt.time}</span>
                    <span class="reply-btn">Reply</span>
                </div>
            </div>
        </div>`;
        commentsList.insertAdjacentHTML('beforeend', itemHTML);
    });
}

function executeAddComment() {
    const inputField = document.getElementById('userCommentInput');
    const text = inputField.value.trim();

    if (text !== "" && currentActivePostId !== null) {
        // Construct new raw data dictionary item
        const newComment = {
            author: "Admin Account",
            text: text,
            time: "Just now",
            avatar: "https://ui-avatars.com/api/?name=Admin&background=1e293b&color=fff"
        };

        // Save directly to running runtime database
        if (!commentsDatabase[currentActivePostId]) {
            commentsDatabase[currentActivePostId] = [];
        }
        commentsDatabase[currentActivePostId].push(newComment);

        // Re-render layout instantly
        renderDrawerComments();
        
        // Clear input element
        inputField.value = '';
        inputField.blur(); // dismiss mobile keyboard viewport
    }
}

function sharePost() {
    alert("Native device share menu will pop up here!");
}
