document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event
            const itemId = this.closest('.card').dataset.itemId;
            if (confirm(`Are you sure you want to delete item ${itemId}?`)) {
                // Perform delete operation
                console.log(`Delete item ${itemId}`);
            }
        });
    });

    app.get('/admin-pantry', (req, res) => {
        // First, check if the session exists and a user is logged in
        if (req.session && req.session.email) {
            UserDAO.lookup(req.session.email, (err, user) => {
                if (err) {
                    console.error('Error fetching user:', err);
                    return res.status(500).send("Internal Server Error");
                }
                if (!user) {
                    console.error('User not found');
                    return res.redirect('/'); // Redirect to login if user not found
                }
    
                // Check if the user is an admin
                if (user.type !== 'Admin') {
                    console.error('Access denied: User is not an admin');
                    return res.status(403).send("Access Denied");
                }
    
                // Fetch all items from the database
                pantryDB.find({}, (err, items) => {
                    if (err) {
                        console.error('Error fetching pantry items:', err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        // Render the admin-pantry.mustache view, passing it the items
                        res.render('admin-pantry', {
                            pageTitle: 'Admin Pantry Overview',
                            pantryItems: items  // 'pantryItems' will be an array of items from the database
                        });
                    }
                });
            });
        } else {
            console.log("No user session found, redirecting to login.");
            res.redirect('/');
        }
    });
    

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event
            const userId = this.closest('.card').dataset.userId;
            // Open an edit modal or redirect to an edit page
            console.log(`Edit user ${userId}`);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const userCards = document.querySelectorAll('.user-card');
    
    userCards.forEach(card => {
        card.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            deleteUserById(userId);
        });
    });
});

function deleteUserById(userId) {
    fetch(`/admin-users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // User deleted successfully, you can update the UI or show a message if needed
            console.log('User deleted successfully');
        } else {
            // Handle error response
            console.error('Failed to delete user');
        }
    })
    .catch(error => console.error('Error deleting user:', error));
}
