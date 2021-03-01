const express = require('express');
const app = express()  // serve per far andare il server 

//Creo una risposta ad una get sulla porta 5000
app.get('/', (req, res) => res.send('API partita'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))