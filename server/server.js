const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('../config/config');

const app = express();



// parse application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(require('./routes/usuario'));


// conexion  a mongoDB

mongoose.connect( process.env.URLDB ,  { useNewUrlParser: true, useCreateIndex: true } )
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
