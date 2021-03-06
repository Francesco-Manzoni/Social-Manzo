const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator'); //https://express-validator.github.io/docs/

//richiamo il modello dell'utente
const User = require('../../models/User');
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
      let user = await User.findOne({ email });
      if (user) {
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

      //Creo una nuova instanza dell'utente (non è ancora salvato)
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Cripto la password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //salvo l'utente nel DB
      await user.save();
      //Return jsonwebtoken  (nel frontend voglio che l'utente venga loggato subito con il token)
      res.send('Utente registrato');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
