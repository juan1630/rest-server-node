const jwt = require('jsonwebtoken');


//===============================
//       Verifica token 
//===============================



let verificaToken = (req, res, next )=> {

        // leemos los headers de la aplicacion

        let token = req.get('token');

        // res.json({
        //     token
        // });

        jwt.verify(token, process.env.SEED, (err, decode) => {

            if(err) {
                return res.status(401).json({
                    ok: false,
                    err : {
                        meesage: 'El token no es valido'
                    }
                });
            }

                    // payload del usuario
            req.usuario = decode.usuario;
            next();

        });

        // los middlewares hacen demasiadas validaciones 

};



//===============================
//      Verifica admin role 
//===============================

let verificaAdminRole = (req, res, next ) => {
    
    let usuario = req.usuario;

    if( usuario.role == 'ADMIN_ROLE' ){
            next();
    }else{

        return  res.json({
            ok: false,
            err:{
                message: 'El usuario no es admin'
            }
        })
    }

}




//==========================================
//      Verifica token img
//==========================================



let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err : {
                    meesage: 'El token no es valido'
                }
            });
        }

                // payload del usuario
        req.usuario = decode.usuario;
        next();

    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
};