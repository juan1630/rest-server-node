const express = require('express');
let { verificaToken, verificaAdminRole } = require('../../config/middleware/autenticazion');
let Categorias = require('../models/categorias');

let app = express();

//========================================
// Muestra todas las categorias 
//========================================

app.get('/categoria', verificaToken,(req, res ) => {

    Categorias.find({})
    // se dice de que forma se va a ordenar
    .sort('descripcion')
    // el populate revisa que ids existen en el objeto 
    // en el primer argumento del populate especificamos la coleccion a la que hace referencia 
    // el segundo de los parametros especificamos los cmapos que queremos que que devuelva de la coleccion a la que se le hace la relacion
    .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            res.json({
                ok: true,
                categorias
            })
    

        });

});



//========================================
// Muestra una categoria por ID
//========================================

app.get('/categoria/:id', (req, res) => {

    // usar la funcion findById

    let id = req.params.id; 
    

    Categorias.findById( id,  (err, categoriaDB) => {


        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){


                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "No se encontro el id"
                    }
                })

        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })

    } );

});


//========================================
//      Crear una categoria nueva 
//========================================

app.post('/categoria', verificaToken ,(req, res)=> {
    
    let body = req.body;
    
    let categorias = new Categorias({
        descripcion:  body.descripcion,
        usuario: req.usuario._id
    });

    categorias.save( (err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });  

    }


    res.json({
        ok: true,
        categoria: categoriaDB  
    });


});

});



//========================================
//      Actualiza la categoria 
//========================================

app.put('/categoria/:id', (req, res) => {

    // usar la funcion findById
    
    let id = req.params.id; 
    let body = req.body;

    let desCategoria = body.categoria;

    Categorias.findByIdAndUpdate(id, desCategoria, {new : true, runValidators: true} ,(err, categoriaDB ) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });  

    }

    res.json({
        ok: true,
        categoria: categoriaDB  
    });

    });


});



//========================================
//      Borrado de la categoria 
//========================================

app.delete('/categoria/:id',[ verificaToken, verificaAdminRole  ],  (req, res) => {

    // usar la funcion findByIdAndRemove

    let id = req.params.id;
    

    Categorias.findByIdAndRemove(id,(err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err : {
                    message: "El id no existe"
                }
            });  

    }

        res.json({
            ok: true,
            message: "Categoria borrada"
        });


    });



});



module.exports = app;
