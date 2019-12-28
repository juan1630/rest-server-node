const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('../config/config');

const app = express();

// parse application/json

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))

// Habilitar el directorio public 

app.use( express.static( path.resolve( __dirname , '../public') ));

app.use(require('./routes/index'));

// conexion  a mongoDB


mongoose.connect( process.env.URLDB ,  { useNewUrlParser: true, useCreateIndex: true })
.then ( ( resp) => {
    // console.log(resp);
    console.log('DB online');
 })

 .catch( err  => {
    console.log(err);
 });
// ,(err, resp) => {
//     if(err) throw err;
//     console.log(resp);
// }


app.listen( process.env.PORT , ()=> {
    console.log(`Escuchando en el puerto: `, process.env.PORT);
})
