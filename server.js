/**
 * 
 * Hello!
 * I'm maxi, trying to create a local API.
 * Hm...
 * 
 */

/** require express -> app */
const express = require('express');
const app = express();
app.engine('html', require('ejs').renderFile); 
/** extra */
//nothing rn
/** config */
const port = process.env.PORT || 3000;

/** get -> main */
app.get('/', function (req, res) {
    res.send({
        token: generateToken(),
        test: 0
    });
    if (req) {
        console.log(req.query);
    }
});

/** get -> api/params */
app.get('/api/:id?', async function (req, res) {
    let id = req.params.id;
    if (!id) return res.status(404).sendFile('./public/html/error/apiError.html', {
        root: __dirname
    });
    else
        res.render(__dirname + '/public/html/success/success1.html', {
            name: id
        });
});

/** app listening on port */
app.listen(port, function () {
    console.log('Fish n Economy API is online on port ' + port);
});



/**
 * 
 * IMPORTANT FUNCTIONS
 * 
 */

function generateToken() {
    let randomString = '';
    for (let i = 0; i < 10; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }
    return randomString;
}