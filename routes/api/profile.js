const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

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

// @route POST api/profile
// @desc Crea o aggiorna profilo utente
// @access Private
router.post(
  '/',
  [
    auth,
    check('status', 'Status obbligatorio').not().isEmpty(),
    check('skills', 'skills obbligatorio').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Creo oggetto profilo
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      //trasformo la stringa in array
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //Creo oggetto social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update entry nel db
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //creo il profilo
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('Server error');
    }
  }
);

// @route GET api/profile
// @desc Ritorna tutti i profili
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server error');
  }
});

// @route GET api/profile/user/:user_id
// @desc GEt profilo da id utente
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profilo non trovato' });
    }
    res.json(profile);
  } catch (error) {
    console.log(error.message);
    //per evitare che dia server error se si mette un user_id che non è valido
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profilo non trovato' });
    }
    return res.status(500).send('Server error');
  }
});

// @route DELETE api/profile
// @desc Cancella profilo, utente e i posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // DA FARE - Cancello i post dell'utente

    //Cancello il profilo
    await Profile.findOneAndRemove({ user: req.user.id });

    //cancello l'utente
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'Utente eliminato' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
