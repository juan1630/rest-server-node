const express = require('express');
const bcrypt =  require('bcryptjs');
const  _ = require('underscore');
const Usuario = require('../models/usuario');
const {verificaToken, verificaAdminRole} = require('../../config/middleware/autenticazion');

const app = express();



// Peticones GET

app.get('/usuario', verificaToken  ,(req, res)=> {


    // return res.json({
    //     usuario : req.usuario,
    //     nombre: req.nombre,
    //     emial: req.email

    // });

    // podemos extraer las propiedades de forma independiente 


    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;


    desde = Number(desde);
    limite = Number(limite);


    let getForState = {
        state: true
    }
    // skip salta los registros 
    Usuario.find(getForState, 'nombre email role img state')
            .skip(desde)
            .limit(limite)
            .exec( (err, users) => {

                if(err){

                    return res.status(400).json({
                         ok: false,
                         err
                     });
                 }

                 Usuario.count({}, (err, conteo) => {

                    if(err){

                        return res.status(400).json({
                             ok: false,
                             err
                         });
                     }

                    
                 res.json({
                    ok: true,
                    users,
                    conteo
                });

                 });

            });

});


// crea usuarios nuevos o nueva data
app.post( '/usuario', [verificaToken, verificaAdminRole] , (req, res )=> {

    
    let body = req.body;
    
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password:  bcrypt.hashSync(body.password, 10),
        role: body.role,
        img: body.img
    });
     
        usuario.save( (err, usuarioDB) => {

            if(err){

               return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // usuarioDB.password = null;
          return res.json({
                ok: true,
                usuario: usuarioDB
            })

        });

});


// put actualiza los registros


app.put( '/usuario/:id', [verificaToken, verificaAdminRole] ,(req, res) => {

    // obtenemos el id desde la uri
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role','state']);
        
    // ejecuta las validaciones del schema
    Usuario.findByIdAndUpdate(id, body, {new : true, runValidators: true}, (err, userDB) => {

        if(err){

            return res.status(400).json({
                 ok: false,
                 err
             });
         }


         res.json({
             ok: true,
             usuario: userDB
         });


    });

});


app.delete('/usuario/:id', verificaToken ,(req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        state: false
    }

    
    Usuario.findByIdAndUpdate(id,  cambiaEstado , {new: true} ,(err, userUpdated) => {

        if(err){

            return res.status(400).json({
                 ok: false,
                 err
             });
         }

         if( !userUpdated ){

            return res.status(400).json({
                ok: false,
                error:{
                    message: "Usuario no encontrado"
                }
            })
         }


         return res.json({
             ok: true,
             user: userUpdated
         })

    })

    // Usuario.findByIdAndRemove(id, (err, deleted) => {

    //     if(err){

    //         return res.status(400).json({
    //              ok: false,
    //              err
    //          });

    //      }

    //      if(deleted === null) {

    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: "Usuario no encontrado"
    //             }
                
    //         });
    //     }
        
    //     res.json({
    //        ok: true,
    //        usuario: deleted
    //    });
        
    // });



});



module.exports = app;