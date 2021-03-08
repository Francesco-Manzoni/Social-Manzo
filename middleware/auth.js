const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Ottengo il token dall header
  const token = req.header('x-auth-token');

  //controllo se c'è il token
  if (!token) {
    return res.status(401).json({ msg: 'No token, autorizzazione negata' });
  }

  //Se c'è lo verifico
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token non valido' });
  }
};
