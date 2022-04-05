const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const { response } = require('express');
const pool = require('../../config/db');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}



//funzione asincrona che ritorna profilo completo di nome utente, experience e education
async function getProfile(user_id) {
  try {
    
    const q_profile = await pool.query(
    'SELECT * FROM profile JOIN users ON profile.userid = users.uid WHERE profile.userid = $1',
    [user_id]
  );
  const profile = q_profile.rows[0];
  if (profile) {
    Object.assign(profile, {user: {name: profile.name, avatar: profile.avatar}});
    delete profile.name;
    delete profile.avatar;
    delete profile.password;
    delete profile.email;
    delete profile.uid;

    //trovo le experience
    const q_experience = await pool.query(
      'SELECT * FROM experience WHERE uid = $1',
      [user_id]
    );
    if (q_experience.rows.length > 0) {
      profile.experience = q_experience.rows;
    }
    else {
      profile.experience = [];
    }
    //trovo le education
    const q_education = await pool.query(
      'SELECT * FROM education WHERE uid = $1',
      [user_id]
    );
    if (q_education.rows.length > 0) {
      profile.education = q_education.rows;
    }
    else {
      profile.education = [];
    }

    return profile;

  }} catch (err) {
    console.error(err.message);
    return err}}



// @route GET api/profile/me
// @desc Get profilo utente attuale
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await getProfile(req.user.id);
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

    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (facebook) profileFields.facebook = facebook;
    if (instagram) profileFields.instagram = instagram;
    if (linkedin) profileFields.linkedin = linkedin;


    try {
      //let profile = await Profile.findOne({ user: req.user.id });
      let profile = await getProfile(req.user.id);
      if (profile) {
        //Update entry nel db
        let q_update = await pool.query(
          'UPDATE profile SET company = $1, website = $2, location = $3, bio = $4, status = $5, githubusername = $6, skills = $7, youtube = $8, facebook = $9, twitter = $10, instagram = $11, linkedin = $12 WHERE userid = $13',
          [
            profileFields.company,
            profileFields.website,
            profileFields.location,
            profileFields.bio,
            profileFields.status,
            profileFields.githubusername,
            profileFields.skills,
            profileFields.youtube,
            profileFields.facebook,
            profileFields.twitter,
            profileFields.instagram,
            profileFields.linkedin,
            profileFields.user,
            
          ]
        );
        if (q_update.rowCount = 0) {
          throw new Error('Errore aggiornamento profilo');
        }
        profile = await getProfile(req.user.id);
        return res.json(profile);
      } 
 
      //creo il profilo
      /* profile = new Profile(profileFields);
      await profile.save(); */
      let q_create = await pool.query(
        'INSERT INTO profile (userid, company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [
          profileFields.user,
          profileFields.company,
          profileFields.website,
          profileFields.location,
          profileFields.bio,
          profileFields.status,
          profileFields.githubusername,
          profileFields.skills,
          profileFields.youtube,
          profileFields.facebook,
          profileFields.twitter,
          profileFields.instagram,
          profileFields.linkedin,
          
        ]
      );
      if (q_create.rowCount = 0) {
        throw new Error('Errore aggiornamento profilo');
      }
      
      
      profile = await getProfile(req.user.id);
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
    //ottengo tutti i profili dal db facendo join tra users e profile 
    let q_profiles = await pool.query(
      'SELECT * FROM profile'
    );
    let profiles = q_profiles.rows;
    
    //inserisco i campi name e avatar in profiles.user
     await asyncForEach(profiles, async (profile) => {
      let q_user = await pool.query(
        'SELECT * FROM users WHERE uid = $1',
        [profile.userid]
      );
      profile.user = q_user.rows[0];
    /*   profile.user = {
        id: profile.uid,
        name: profile.name,
        avatar: profile.avatar,
      };
      delete profile.uid;
      delete profile.name;
      delete profile.avatar; */
      //trovo le experience
    const q_experience = await pool.query(
      'SELECT * FROM experience WHERE uid = $1',
      [profile.user.uid]
    );
    
    if (q_experience.rows.length > 0) {
      //profile.experience = q_experience.rows;
      Object.assign(profile, {experience: q_experience.rows });
    }else 
    {
      Object.assign(profile, {experience: [] });
      //profile.experience = [];
    }
    //trovo le education
    const q_education = await pool.query(
      'SELECT * FROM education WHERE uid = $1',
      [profile.user.uid]
    );
    if (q_education.rows.length > 0) {
      Object.assign(profile, {education: q_education.rows });
      //profile.education = q_education.rows;
    }else {
      Object.assign(profile, {education: [] });
    }
    
    });
    
    res.json(profiles); //TODO Sistemare educatio e profiles
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
   /*  const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']); */

    const profile = await getProfile(req.params.user_id);
    console.log(profile);
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
    // Cancello i post dell'utente
    //await Post.deleteMany({ user: req.user.id });
    await pool.query('DELETE FROM posts WHERE userid = $1', [req.user.id]);
    // Cancello il profilo dell'utente
    await pool.query('DELETE FROM profile WHERE userid = $1', [req.user.id]);
    // Cancello l'utente
    await pool.query('DELETE FROM users WHERE uid = $1', [req.user.id]);
    await pool.query('DELETE FROM education WHERE uid = $1', [req.user.id]);
    await pool.query('DELETE FROM experience WHERE uid = $1', [req.user.id]);

/*     //Cancello il profilo
    await Profile.findOneAndRemove({ user: req.user.id });

    //cancello l'utente
    await User.findOneAndRemove({ _id: req.user.id }); */
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


    let nuovaExp = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description,
    };
    if (nuovaExp.to == null || nuovaExp.to == '') {
      nuovaExp.to = null;
    }
    
    try {
      //const profile = await Profile.findOne({ user: req.user.id });
      let profile = await getProfile(req.user.id);
      if (!profile) {
        return res.status(400).json({ msg: 'Profilo non trovato' });
      }
/*       profile.experience.unshift(nuovaExp);
      //unishift fa il push all'inizio dell'array
      await profile.save(); */
      
      await pool.query(
        'INSERT INTO experience (uid, title, company, location, from_date, to_date, current, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [req.user.id, nuovaExp.title, nuovaExp.company, nuovaExp.location, nuovaExp.from, nuovaExp.to, nuovaExp.current, nuovaExp.description]
      );


      profile = await getProfile(req.user.id);
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
    //const foundProfile = await Profile.findOne({ user: req.user.id });


  /*   foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save(); */

    //elimino esperienza dal db tramite eid
    await pool.query('DELETE FROM experience WHERE eid = $1', [req.params.exp_id]);
    const profile = await getProfile(req.user.id);

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
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

    if (nuovaEdu.to == null || nuovaEdu.to == '') {
      nuovaEdu.to = null;
    }
    try {
      //const profile = await Profile.findOne({ user: req.user.id });
      let profile = await getProfile(req.user.id);
      if (!profile) {
        return res.status(400).json({ msg: 'Profilo non trovato' });
      }
      //profile.education.unshift(nuovaEdu);
      //unishift fa il push all'inizio dell'array
      //await profile.save();


      //aggiungo educazione al db
      await pool.query(
        'INSERT INTO education (uid, school, degree, fieldofstudy, from_date, to_date, current, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [req.user.id, nuovaEdu.school, nuovaEdu.degree, nuovaEdu.fieldofstudy, nuovaEdu.from, nuovaEdu.to, nuovaEdu.current, nuovaEdu.description]
      );
      profile = await getProfile(req.user.id);
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
    /* const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    ); 
    await foundProfile.save();*/
    //elimino educazione dal db tramite eid
    await pool.query('DELETE FROM education WHERE eid = $1', [req.params.edu_id]);
    const profile = await getProfile(req.user.id);

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
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
        //console.log(response.body);
        return res.status(404).json({ msg: 'profilo github non trovato' });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
