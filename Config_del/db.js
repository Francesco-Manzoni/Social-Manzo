// In questo file facciò la connessione al DB usando mongoose

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
