const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); //https://express-validator.github.io/docs/
//const {pool} = require("pg");
const pool = require('../../config/db');


const { use } = require('./auth');

// @route POST api/users
// @desc Registrazione utente
// @access Public
router.post(
  '/',
  [
    check('name', 'Il nome è obbligatorio').not().isEmpty(), // con not e isempty controllo che non sia vuoto il campo
    check('email', 'Inserire una mail valida').isEmail(),
    check('password', 'Inserire password di almeno 8 caratteri').isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //bad request
    }

    const { name, email, password } = req.body;
    try {
      //Controllo se l'utente esiste
      //let user = await User.findOne({ email }); //TODO
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      if (user.rows.length > 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Utente già esistente' }] });
      } 
      //ottengo user gravatar
      const avatar = gravatar.url(email, {
        s: '200', //default size
        r: 'pg',
        d: 'mm', //immagine di default
      });

    
      //Cripto la password
      const salt = await bcrypt.genSalt(10);

      const password_salt = await bcrypt.hash(password, salt); 

      //salvo l'utente nel DB
      //await user.save();
      const text = `INSERT INTO users (name, email, avatar, password) VALUES ($1, $2, $3, $4) RETURNING uid`;
      const values = [name, email, avatar, password_salt];
      const query = await pool.query(text, values);

      
      //Return jsonwebtoken  (nel frontend voglio che l'utente venga loggato subito con il token)
      // https://github.com/auth0/node-jsonwebtoken

       const payload = {
        user: {
          id: query.rows[0].uid,
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
