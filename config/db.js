/* // In questo file facciò la connessione al DB usando mongoose

const mongoose = require('mongoose');

const config = require('config');

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connesso');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Fa fallire il processo e termina l'applicazione
  }
};

module.exports = connectDB;
 */


// Language: javascript
// Creo connessione con db postgres
// Path: config\db.js

const { Pool } = require('pg');

const credentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'social',
  password: '1234567890',
  port: 5432,
}

/* async function connectDB() {
  try {
    const pool = new Pool(credentials);
    await pool.query('SELECT NOW()');
    console.log('DB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
} */
const pool = new Pool(credentials);


module.exports = pool;