document.addEventListener('DOMContentLoaded', () => {
    // Selects both .pantry-item and .pantry-item-admin classes
    document.querySelectorAll('.pantry-item, .pantry-item-admin').forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            confirmAndDeleteItem(itemId);
        });
    });
});

// Unified function to handle confirmation and deletion
function confirmAndDeleteItem(itemId) {
    const userConfirmed = confirm('Ensure this is the item you are meaning to select, then press confirm');
    
    if (userConfirmed) {
        console.log('Item confirmed:', itemId);
        // Proceed to delete the item
        fetch('/delete-pantry-item/' + itemId, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Item deleted:', data);
            // Optionally, remove the item from the DOM or refresh the page
            location.reload(); // Refresh the page to reflect changes
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        console.log('Item confirmation canceled:', itemId);
    }
}