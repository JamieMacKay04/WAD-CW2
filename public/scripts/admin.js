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
