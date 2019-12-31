const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();


app.use( fileUpload({ useTempFiles: true }) );
// carga los archivos en req.files



app.put('/upload/:tipo/:id', (req, res ) => {


    let tipo = req.params.tipo;
    let id = req.params.id;

    // Extensiones permitidas 
    let extencionesValida = ['png', 'jpg', 'gif', 'jpeg'];


    if(!req.files){
        return res.status(400).json({
            ok: false,
            err:{
                message: "No se ha seleccionda nigun archivo"
            }
        })
    }

    let archivo = req.files.archivo;
    // este nombre debe de llevar el input del que vamos a enviar el archivo

    let tiposValidos = ['productos', 'usuarios'];
    
    if( tiposValidos.indexOf(tipo ) < 0 ){

        return res.status(400).json({
            ok: false,
            err:{
                message: 'Los tipos validos son'+ tiposValidos,
                tipos: tiposValidos
            }
        })
    }


        // validar las extenciones 
    let nombreCortado = archivo.name.split('.');
    
    let extension = nombreCortado[ nombreCortado.length -1 ];

    // cambiar el nombre del archivo

    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    // obtenemos un nombre que no se va a repetir 


    archivo.mv( `uploads/${tipo}/${ nombreArchivo }`, (err)=>{

        
        if(extencionesValida.indexOf(extension) < 0 ) {     
            return res.status(400)
            .json({     
                ok: false,
                message: `Las extesiones validas son ${extencionesValida.join(', ')}`,
                extension
            })
        }

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // la imagen ya se cargo

        if( tipo === 'usuarios' ){
            imagenUsuario(id, res ,nombreArchivo);
        }else if( tipo === 'productos' ){
            // para la imagen del producto
            imagenProducto(id, nombreArchivo, res);

        }

    })
});


//==================================================
//  Funciones para actualizar la imagen
//==================================================


function imagenUsuario( id, res, nombreArchivo ){
    // manda por referencia el res, es un objeto
    Usuario.findById(id, (err, userDB) =>{

        if(err){
            borrarImagen('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        borrarImagen('usuarios', userDB.img);

        if( !userDB ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "El usuario no existe"
                }
            });
        }

        userDB.img = nombreArchivo;
        // en este punto ya se cambio el valor de la propiedad img
        
        userDB.save( (err, userSaved) => {
            // guardamos la imagen 
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                usuario: userSaved,
                img: nombreArchivo                
            });

        });


    });
}


function imagenProducto(id, imageUpdate, res) {

    Producto.findById(id, (err, productDB) => {

        if(err){
            
            borrarImagen('productos', imageUpdate);
            
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if(!productDB){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        productDB.img = imageUpdate;

        productDB.save( (err, productUpdated) => {

            if(err){
                borrarImagen('productos', imageUpdate);
    
               return res.json({
                   ok: false,
                   err
               })

            }

            return res.json({
                ok: true,
                producto: productUpdated
            })
                

        });

    }); 
    
}


function borrarImagen( tipo, nombreImagen ) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`) ;
    
    // esta imagen regresa un true si existe la imagen y un false, si no se encuentra 
   
    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen);
    }
    
}


module.exports = app;
