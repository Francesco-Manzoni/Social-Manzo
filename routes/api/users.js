const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator/check'); //https://express-validator.github.io/docs/

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //bad request
    }
    res.send('User route');
  }
);

module.exports = router;
