const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const pantryDB = new Datastore({ filename: './models/pantryItems.db', autoload: true });

router.get('/pantry-pantry', (req, res) => {
    // Fetch all items from the database
    pantryDB.find({}, (err, items) => {
        if (err) {
            console.error('Error fetching pantry items:', err);
            res.status(500).send("Internal Server Error");
        } else {
            // Render the pantry-pantry.mustache view, passing it the items
            res.render('pantry-pantry', {
                pageTitle: 'Pantry Overview',
                pantryItems: items  // 'pantryItems' will be an array of items from the database
            });
        }
    });
});

// pantryRoutes.js

router.delete('/delete-pantry-item/:id', (req, res) => {
    const itemId = req.params.id;

    pantryDB.remove({ _id: itemId }, {}, (err, numRemoved) => {
        if (err) {
            console.error('Error removing item:', err);
            res.status(500).send('Error removing item.');
        } else {
            console.log('Item removed:', itemId);
            res.json({ message: 'Item removed', itemId: itemId });
        }
    });
});


module.exports = router;
