const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
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



module.exports = app;
