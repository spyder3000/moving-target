/* note:  to automatically restart server as we're updating, use >nodemon src/app.js from cmd prompt */

// express found at expressjs.com (includes documentation & API reference);  makes it easy to create webservers 
const path = require('path');   // core node module (nodejs.org);  do not need to install via npm i xxx on cmd prompt 
const express = require('express');   // express is a function (as opposed to an object);  see expressjs.com 
const hbs = require('hbs'); 
const bodyParser = require("body-parser"); 
const Game = require('./utils/game'); 
const Guess = require('./utils/guess'); 

// console.log(__filename);  // path to current file

const app = express();   // creates a new express application 
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended:true
}));
const port = process.env.PORT || 3000;     // e.g. process environment var from heroku;  if running locally, will default to 3000

// DEfine paths for Express config;  __dirname is path to current directory;  path.join to go up one level & into public dir;  
const publicDirectoryPath = path.join(__dirname, '../public');  // this line will match to public files first (e.g. index.html) prior to app.get stmts below  
const viewsPath = path.join(__dirname, '../templates/views');  // express defaults to 'views' folder;  this modifies that to 'templates/views' instead 
const partialsPath = path.join(__dirname, '../templates/partials'); 

var currGame = {}; 
// Setup handlebars engine & views location 
app.set('view engine', 'hbs');     // e.g. set up a view engine (handlebar) for Express 
app.set('views', viewsPath);   // express default is 'views' folder for .hbs content;  this overrides that  
hbs.registerPartials(partialsPath);  

// Setup static directory;  app.use to customize our server;  
app.use(express.static(publicDirectoryPath))    

// app.get lets us configure what the server should do when user enters a url -- e.g. call will return HTML or JSON
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather', 
        name: 'Oreo'
    });    // allows us to render one of our views (one of the handlebar templates) 
})

/* app.get('/begin88', (req, res) => {
    // e.g. req.url = /results?diff=04&hotcold=false&mine=false 
    const myURL2 = new URL('https://example.org' + req.url);
    console.log(myURL2.searchParams.get('diff'));

    var diffLevelCheat = myURL2.searchParams.get('diff'); 
    var hotcoldCheat = (myURL2.searchParams.get('hotcold') == 'true') ? true : false; 
    var mine =  (myURL2.searchParams.get('mine') == 'true') ? true : false; 
    if (!diffLevelCheat) diffLevelCheat = '04'; 
    if (!hotcoldCheat) hotcoldCheat = false; 
    if (!mine) mine = false; 

    currGame = new Game(diffLevelCheat, hotcoldCheat, mine);  

    res.render('results', {
        currGame
    })
}) */

app.post('/begin', (req, res) => {
    // console.log('POST /begin'); 
    // console.log(req.body); 

    var data = {}; 
    data.challengeLevel = (req.body.challengeCheatNum) ? parseInt(req.body.challengeCheatNum) : 0; 
    if (data.challengeLevel > 0) getCheatVals(data); 
    else {
        data.diffLevelCheat = (req.body.diffLevel) ? req.body.diffLevel : '04'; 
        data.hotcoldCheat = (req.body.hotColdCheat) ? true : false; 
        data.totMinesCheat = (req.body.minefieldCheatNum) ? parseInt(req.body.minefieldCheatNum) : 0; 
        data.addMinesCheat = (req.body.addMinesCheat) ? parseInt(req.body.addMinesCheat) : 0; 
        data.hotColdOutageCheat = (req.body.hotColdOutageCheat) ? true : false; 
        data.complexMovesCheat = (req.body.complexMovesCheat) ? true : false; 
        data.delayHotColdCheat = (req.body.delayHotColdCheatNum) ? parseInt(req.body.delayHotColdCheatNum) : 0; 
        data.sizePuzzleModsCheat = (req.body.sizePuzzleModCheat) ? parseInt(req.body.sizePuzzleModCheat) : 0; 
        data.stopDupsModCheat = (req.body.stopDupsModCheat) ? parseInt(req.body.stopDupsModCheat) : 0;
        data.challenge = 'Custom';  
    }

    // console.log('data = ' + data); 
    currGame = new Game(data);  
//b    console.log('currGame = ' + JSON.stringify(currGame)); 

    res.render('results', {
        currGame
    })
})

app.post('/guess', (req, res) => {
    console.log('POST /results'); 
    // console.log(req.body); 
    currGame.error = null; 
    // console.log(isNormalInteger(req.body.userGuess)); 
    // console.log(currGame.totNumbers);
    // console.log('ddd = ' + currGame.removers.removedNums); 
    // console.log('ddd2 = ' + req.body.userGuess); 
    // console.log('ddd3 = ' + currGame.removers.removedNums.indexOf(req.body.userGuess)); 
    // console.log('dd4 typeof guess = ' + typeof req.body.userGuess); 
    // console.log('dd5 typeof guess = ' + typeof currGame.removers.removedNums[0]); 

    console.log('dd5 totNumbers = ' + currGame.totNumbers); 
    console.log('dd5 tfirstNum = ' + currGame.firstNumber); 

    if (!req.body.userGuess || !isNormalInteger(req.body.userGuess) || req.body.userGuess <= 0 
        || req.body.userGuess > currGame.totNumbers || req.body.userGuess < currGame.firstNumber
        || currGame.removers.removedNums.indexOf(parseInt(req.body.userGuess)) >= 0
        ) {
            // console.log('ddd = ' + currGame.removers.removedNums); 
            // console.log('ddd2 = ' + req.body.userGuess); 
            // console.log('ddd3 = ' + currGame.removers.removedNums.indexOf(req.body.userGuess)); 
        currGame.error = 'Invalid value entered.  Try again.'; 
        res.render('results', {
            currGame 
        })
        return; 
    }

//    console.log('currGame = ' + JSON.stringify(currGame));
    currGame.processGuess(parseInt(req.body.userGuess)); 
    // console.log('currGame = ' + JSON.stringify(currGame));
 //   currGame.checkMove(); 
    
 //   var tmpGuess = new Guess(req.body.userGuess, currGame);  
    // add to gameArray, the results of the next guess;  
    res.render('results', {
        currGame 
    })
})

// '*' match anything else that hasn't matched so far;  node starts at public directory check and works through app.get until it gets here  
app.get('*', (req, res) => {
//    res.send('my 404 page'); 
    res.render('404', {
        title: '404 Page', 
        errorMsg: 'Page not found.'
    })
})

// To start the server up;  access this via localhost:3000 URL  
app.listen(port, () => {    // port 3000 is default development port;  live HTML port is typically 80
    console.log('Server started on port '+port); 
});  

function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

function getCheatVals(data) {
    data.hotcoldCheat = true; 
    data.totMinesCheat = 30; 
    data.addMinesCheat = 0; 
    data.hotColdOutageCheat = false; 
    data.complexMovesCheat = false; 
    data.delayHotColdCheat = 0; 
    data.sizePuzzleModsCheat = 0; 
    data.stopDupsModCheat =  0;

    /* diffLevelCheat translate:   (copied from index.hbs)
        "01" -- Target moves every 3 to 10 turns
        "02" -- Target moves every 2 to 7 turns
        "03" -- Target moves every 2 to 5 turns 
        "04" -- Target moves every 1 to 4 turns 
        "05" -- Target moves every 1 to 3 turns
        "06" -- Target moves every 1 to 2 turns
        "07" -- Target moves every turn
    */

    /* note:  change data here & in public/js/index.js */

    switch(data.challengeLevel) {
        case 1: 
            data.diffLevelCheat = '02'; 
            data.totMinesCheat = 0; 
            data.challenge = 'Beginner';
            break; 
        case 2: 
            data.diffLevelCheat = '04'; 
            data.challenge = 'Easy 1';
            break; 
        case 3: 
            data.diffLevelCheat = '03'; 
            data.totMinesCheat = 30; 
            data.addMinesCheat = 3; 
            data.challenge = 'Easy 2';
            break; 
        case 4: 
            data.diffLevelCheat = '05'; 
            data.totMinesCheat = 60; 
            data.challenge = 'Medium 1';
            break; 
        case 5: 
            data.diffLevelCheat = '05'; 
            data.totMinesCheat = 30; 
            data.addMinesCheat = 3; 
            data.hotColdOutageCheat = true; 
            data.challenge = 'Medium 2';
            break; 
        case 6: 
            data.diffLevelCheat = '04'; 
            data.totMinesCheat = 30; 
            data.addMinesCheat = 3; 
            data.hotColdOutageCheat = true; 
            data.complexMovesCheat = true; 
            data.challenge = 'Difficult 1';
            break; 
        case 7: 
            data.diffLevelCheat = '06'; 
            data.totMinesCheat = 90; 
            data.complexMovesCheat = false; 
            data.delayHotColdCheat = 1; 
            data.challenge = 'Difficult 2';
            break; 
        case 8: 
            data.diffLevelCheat = '05'; 
            data.totMinesCheat = 60; 
            data.addMinesCheat = 3; 
            data.hotColdOutageCheat = true; 
            data.sizePuzzleModsCheat = 100;
            data.challenge = 'Difficult 3';
            break; 
        case 9: 
            data.diffLevelCheat = '07'; 
            data.totMinesCheat = 30; 
            data.addMinesCheat = 1; 
            data.hotColdOutageCheat = false; 
            data.complexMovesCheat = false; 
            data.delayHotColdCheat = 2; 
            data.stopDupsModCheat =  0;
            data.challenge = 'Advanced 1';
            break; 
        case 10: 
            data.diffLevelCheat = '06'; 
            data.totMinesCheat = 60; 
            data.addMinesCheat = 3; 
            data.hotColdOutageCheat = true; 
            data.complexMovesCheat = false; 
            data.delayHotColdCheat = 1; 
            data.stopDupsModCheat =  10;
            data.challenge = 'Advanced 2';
            break; 
        case 11: 
            data.diffLevelCheat = '06'; 
            data.totMinesCheat = 90; 
            data.addMinesCheat = 3; 
            data.hotColdOutageCheat = true; 
            data.complexMovesCheat = true; 
            data.delayHotColdCheat = 1; 
            data.sizePuzzleModsCheat = -100; 
            data.stopDupsModCheat =  10;
            data.challenge = 'Advanced 3';
            break;       
        case 12: 
            data.diffLevelCheat = '07'; 
            data.totMinesCheat = 120; 
            data.addMinesCheat = 1; 
            data.hotColdOutageCheat = true; 
            data.complexMovesCheat = true; 
            data.delayHotColdCheat = 2; 
            data.stopDupsModCheat =  1;
            data.challenge = 'Most Difficult';
            break;       
    }
}