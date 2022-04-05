const express = require('express');
//const connectDB = require('./config/db');
const path = require('path');
const pool = require('./config/db');
const app = express(); // serve per far andare il server

//mi connnetto al server
 async function connectDB() {
  try {
    await pool.query('SELECT NOW()');
    console.log('DB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
} 
connectDB();


//Inizializzo il middleware
//app.use(express.json({ xtended: false }));
app.use(express.json());

//Creo una risposta ad una get sulla porta 5000
//app.get('/', (req, res) => res.send('API partita'));

// Definisco i percorsi delle API
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

//Per heroku
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));

module.exports = app;
