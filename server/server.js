const express = require('express');
const bodyParser = require('body-parser');
require('../config/config');
const app = express();




app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());


// Peticones GET

app.get('/usuario', (req, res)=> {

    res.json('Get usuario');
});


// crea usuarios nuevos o nueva data
app.post( '/usuario', (req, res )=> {

    let body = req.body;


    if(body.nombre === undefined ){

        res.status(400).json({
            ok:false,
            message: 'El nombre es necesario'
        });

    }else{

        
    res.json({
        body
    });
    }


});


// put actualiza los registros


app.put( '/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json({
        id
    });
});


app.delete('/usuario', (req, res) => {
    res.json('DELETE usuario');
});


app.listen( process.env.PORT , ()=> {
    console.log(`Escuchando en el puerto: `, process.env.PORT);
})
