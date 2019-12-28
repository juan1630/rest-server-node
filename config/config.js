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


//=================================
//     Vencimineto del token
//=================================

// 60 * 60 * 24 * 30


process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 


//=================================
//      SEED de autenticacion
//=================================


process.env.SEED = process.env.SEED ||'este-es-el-seed-de-desarrollo';


process.env.URLDB = urlDB;






//=================================
//       Google client ID
//=================================



process.env.CLIENT_ID = process.env.CLIENT_ID || '293146874790-7jdm2115ctvnf5576jaob3ebeu1dneqh.apps.googleusercontent.com'; 