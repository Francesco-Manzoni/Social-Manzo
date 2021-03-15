const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const { response } = require('express');

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

// @route PUT api/profile/experience
// @desc  Aggiungi esperienze ad untente
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Titolo obbligatorio').not().isEmpty(),
      check('company', 'Azienda obbligatoria').not().isEmpty(),
      check('from', 'Data di inizio obbligatoria').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const nuovaExp = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).json({ msg: 'Profilo non trovato' });
      }
      profile.experience.unshift(nuovaExp);
      //unishift fa il push all'inizio dell'array

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc  Elimina esperienza dal profilo
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: 'Profilo non trovato' });
    }

    //ottengo id da rimuovere
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json({ profile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//-------------EDUCATION---------
// @route PUT api/profile/education
// @desc  Aggiungi educazione ad untente
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'scuola obbligatorio').not().isEmpty(),
      check('degree', 'Titolo obbligatorio').not().isEmpty(),
      check('fieldofstudy', 'Campo di studio obbligatorio').not().isEmpty(),
      check('from', 'Data di inizio obbligatoria').not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const nuovaEdu = {
      school: school,
      degree: degree,
      fieldofstudy: fieldofstudy,
      from: from,
      to: to,
      current: current,
      description: description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(400).json({ msg: 'Profilo non trovato' });
      }
      profile.education.unshift(nuovaEdu);
      //unishift fa il push all'inizio dell'array

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc  Elimina education dal profilo
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({ msg: 'Profilo non trovato' });
    }

    //ottengo id da rimuovere
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json({ profile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//GitHub api----------

// @route GET api/profile/github/:username
// @desc ottengo le repos di un utente github
// @access Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id${config.get(
        'githubClientid'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'prfilo github non trovato' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
