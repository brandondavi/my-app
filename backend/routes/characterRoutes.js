const express = require('express');
const router = express.Router();

const { getCharacter, createCharacter, deleteCharacter, getAllCharacters, getAllMyCharacters, likeCharacter, getAvailableTags} = require('../controllers/characterController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createCharacter);
router.post('/like', protect, likeCharacter);
router.get('/me', protect, getAllMyCharacters);
router.get('/tags', getAvailableTags);
router.get('/', protect, getAllCharacters);
router.get('/:id', protect, getCharacter);
router.delete('/:id/delete', protect, deleteCharacter);

module.exports = router;