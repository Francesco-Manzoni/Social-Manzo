const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route GET api/profile/me
// @desc Get profilo utente attuale
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }) //Ottengo profilo utente dall'userid
      .populate('user', ['name', 'avatar']); //popolo anche il campo user con nome e avatar

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'Profilo non trovato per questo utente' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
