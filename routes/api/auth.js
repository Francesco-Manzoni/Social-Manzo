const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator'); //https://express-validator.github.io/docs/
const pool = require('../../config/db');

// @route GET api/auth
// @desc test route
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    //const user = await User.findById(req.user.id).select('-password'); //ottengo l'utente partendo dall'id che viene passato nella richiesta eccetto la password
    const user = await pool.query('SELECT * FROM users WHERE uid = $1', [req.user.id]);
    delete user.rows[0].password;
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/auth
// @desc Autenticazione utente + ottengo JWT token
// @access Public
router.post(
  '/',
  [
    check('email', 'Inserire una mail valida').isEmail(),
    check('password', 'Inserire una password valida').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //bad request
    }

    const { email, password } = req.body;
    try {
      //Controllo se l'utente esiste
      const user_query = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      const user = user_query.rows[0];
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email o password errati' }] });
      }
      //Controllo la password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email o password errati' }] });
      }

      //Return jsonwebtoken  (nel frontend voglio che l'utente venga loggato subito con il token)
      // https://github.com/auth0/node-jsonwebtoken

      const payload = {
        user: {
          id: user.uid,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 }, //dovrebbe essere un ora quindi 3600, metto di più per debuggare meglio
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //ritorna il token nella POST, con JWT posso vedere il contenuto https://jwt.io/#debugger-io
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
