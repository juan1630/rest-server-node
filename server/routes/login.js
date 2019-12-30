const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client  } = require('google-auth-library');
const client  = new OAuth2Client(process.env.CLIENT_ID);

const Usuario  = require('../models/usuario');

const app = express();



app.post('/login', (req, resp)=> {

    let body = req.body;

        Usuario.findOne({ email: body.email } , (err, userDB ) => {

            if(err) {
                return resp.status(400).json({
                    ok: false,
                    err
                });
            }

            if(!userDB) {
                return resp.status(400).json({
                    ok: false,
                    err:{
                        message: "(Usuario) o contraseña incorrectos"
                    }
                })
            }

            if( ! bcrypt.compareSync(body.password, userDB.password ) ){
                return resp.status(400).json({
                    ok: false,
                    err:{
                        message: "Usuario o (contraseña) incorrectos"
                    }
                })
            }


            let token = jwt.sign({
                // aca va nuestro payload de nuestro token
                usuario: userDB
            }, process.env.SEED ,  { expiresIn: process.env.CADUCIDAD_TOKEN });
            // en este punto ya se creo el token y se grabo el payload

            resp.json({
                ok: true,
                usuario: userDB,
                token
            });


        });

});



// Configuraciones de Google

async function verify( token ) {
    
    const ticket = await client.verifyIdToken({

        idToken: token,
        audience: process.env.CLIENT_ID, 
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    // payload es la data del usuario 
    
    const payload = ticket.getPayload();

    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return  {
        nombre: payload.name,
        emial: payload.email,
        img: payload.picture,
        google: true
    }

  }


// app.post('/google', async (req, resp ) => {
    
        
//     let token = req.body.idtoken;
 
//     let userGoogle  = await verify(token)
            
//     .catch( e => {
                                
//             return resp.status(400).json({
//                 ok: false,
//                 err: e
//             });


//             });
         
//        Usuario.findOne({email: userGoogle.email}, ( err, userDB )=> {

        
//         if(err) {

//             return resp.status(500).json({
//                 ok: false,
//                 err
//             });

//         }

//             if( userDB ){

//                 if( userDB === false ){
//                     return resp.status(400).json({
//                         ok: false,
//                         err :{
//                             message: 'Se debe de autenticar con login normal'
//                         }
//                     });
    
//                 }else {
    
//                     // renovamos el token
    
//                     let token = jwt.sign({
//                         usuario: userDB
//                     }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN } )
    
    
//                     return resp.json({
//                         ok: true,
//                         usuario: userDB,
//                         token
//                     });
    
//                 }

//             } else {

//                 // si el usuario no existe en la DB

//                 let usuario = new Usuario();
                
//                 usuario.nombre = userGoogle.nombre;
//                 usuario.emial = userGoogle.email;
//                 usuario.img = userGoogle.picture;
//                 usuario.google = true;
//                 usuario.password = ':)';

//                  usuario.save( (err, usuarioDB) => {

                     
//                 if(err) {

//                     return resp.status(500).json({
//                         ok: false,
//                         err: err
//                     });

//                  }

//                  let token = jwt.sign({
//                     usuario: userDB
//                 }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN } );

//                 console.log('usuario guardado')
                
//                 return resp.json({
//                     ok: true,
//                     usuario: usuarioDB,
//                     token
//                 })

//                  });
                
//             }


//        } );

// });


module.exports = app;
