const express = require ('express');
const app = express ();
const router = require ('./router');


app.use (express.json())
app.use(router);




app.listen (3000 , () =>{
    console.log('Rodando na porta 3000')
})