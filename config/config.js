// PUERTO

process.env.PORT = process.env.PORT || 3000;



//=================================
//          Entorno
//=================================


process.env.NODE = process.env.NODE || 'dev';


//=================================
//          Data Base 
//=================================


let urlDB;

// if( process.env.NODE === 'dev' ) {
     urlDB =  'mongodb://localhost:27017/cafe';
// }else {
    // este es el entorno de produccion de la db
//   urlDB =  'mongodb:mongodb+srv://juanito:eltodasmias-16@cluster0-3lxr1.mongodb.net/cafe';
// }


process.env.URLDB = urlDB;

