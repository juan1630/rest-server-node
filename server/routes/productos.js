const express = require('express');
const {verificaToken} = require('../../config/middleware/autenticazion');
const Producto = require('../models/producto');

const app = express();

// =======================================
//      Obtener todos los productos 
// =======================================

app.get('/productos', verificaToken ,(req, res ) => {


    //traer todos los usuarios 
    // populate usuarios y su categoria 
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true })
    .skip(desde)
    .limit(5)
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec( (err, data) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if(!data ) {
            return res.status(400).json({
                ok: false,
                data
            })
        }


        return res.json({
            ok: true,
            data
        })

    });



});


// =======================================
//      Obtener un producto por ID
// =======================================


app.get('/productos/:id', verificaToken ,(req, res) => {

    let id = req.params.id;

    Producto.findById(id )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec(     (err, productDB) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    producto:  productDB
                });
            }
    
    
            if(!productDB){
    
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
    
            return res.json({
                ok: true,
                producto: productDB
            })
    
        });
    });



// =======================================
//          Buscar productos
// =======================================


app.get('/productos/buscar/:termino', verificaToken , (req, res) => { 

    let termino = req.params.termino;

    // i -> ignorar mayúsculas o minúsculas

    let regex = new RegExp(termino, 'i');


    Producto.find({nombre: regex})
    .populate('categoria', 'descripcion')
    .exec( (err, productDB) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                producto:  productDB
            });
        }


        res.json({
            ok: true,
            productDB
        })
    
    
    });

});


// =======================================
//          Crear un producto
// =======================================


app.post('/productos', verificaToken ,(req, res ) => {

    //grabar el usuario 
    // grabar la categoria del producto

    let body = req.body;

    // Producto

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save( (err, productDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productDB){

            return res.status(400).json({
                ok: false,
                err :{
                    message: "El producto no se pudo insertar"
                }
            })

        }

        return res.status(201).json({
            ok : true,
            producto: productDB
        });

    });

 });
    


// =======================================
//      Actualizar el producto
// =======================================
    // requiere el id del producto 


    app.put('/productos/:id', verificaToken,(req, res ) => {

        let id = req.params.id;
        let body = req.body;


        Producto.findById(id,(err, productDB ) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productDB ){

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No se pudo actualizar"
                    }
                })
            }

            productDB.nombre = body.nombre;
            productDB.precioUni = body.precioUni;
            productDB.categoria = body.categoria;
            productDB.disponible = body.disponible;
            productDB.descripcion = body.descripcion;


            productDB.save( (err, productUpdate) =>{


                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
    
                if(!productUpdate ){
    
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "No se pudo actualizar"
                        }
                    })
                }


                res.json({
                    ok: true,
                    producto: productUpdate
                });

            });

        });


    });


// =======================================
//          Eliminar un producto
// =======================================


app.delete('/productos/:id',verificaToken ,(req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, {new : true, runValidators: true} ,(err, productDB ) => { 

        if(err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }


        if(!productDB){

            return res.status(400).json({
                ok: false,
                error: {
                    message: "El ID no existe"
                }
            })
        }


        res.json({
            ok: true,
            message: 'Producto ha sido borrado',
            producto: productDB
        });


     } );
        
});

// cambiar el estado del producto a falso



module.exports = app;