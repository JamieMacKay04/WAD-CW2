// main.js

// Function to handle the confirmation of a pantry item
function confirmItem(itemId) {
    const userConfirmed = confirm('Would you like to confirm this item?');
    
    if (userConfirmed) {
        console.log('Item confirmed:', itemId);
        // TODO: Perform your action here, such as sending a confirmation to the server
        // You could send an AJAX request to the server to mark the item as confirmed
    } else {
        console.log('Item confirmation canceled:', itemId);
    }
}

// Wait for the DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    // Attach click event listener to each pantry item
    document.querySelectorAll('.pantry-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            confirmItem(itemId);
        });
    });
});

function confirmItem(itemId) {
    const userConfirmed = confirm('Would you like to confirm this item?');
    
    if (userConfirmed) {
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
    }
}
