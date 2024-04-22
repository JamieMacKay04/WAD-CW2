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

router.delete('/delete-pantry-item/:id', (req, res) => {
    const itemId = req.params.id;
    pantryDB.remove({ _id: itemId }, {}, (err, numRemoved) => {
      if (err) {
        console.error('Error removing item:', err);
        return res.status(500).send('Error removing item.');
      }
      if (numRemoved > 0) {
        console.log('Item removed:', itemId);
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ error: 'Item not found' });
      }
    });
  });
  
  module.exports = router;
module.exports = router;
