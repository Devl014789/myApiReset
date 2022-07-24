//import
let express = require('express');
let bodyParser = require('body-parser')
let apiRouter = require('./apiRouter').router;

//server 
let server = express();

//config bodyparser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
//config routes
server.get('/', (req, res) => {
 res.setHeader('Content-type', 'application/json');
 res.status(200).send('bonjour a tous');

});

server.use('/apidev/', apiRouter)

//activation server
server.listen(8080, () => {
    console.log('server en marche')
});