// --- LOADING MODULES
var express = require('express'),
    body_parser = require('body-parser'),
    mongoose = require('mongoose');

// --- INSTANTIATE THE APP
var app = express();

// --- MONGOOSE SETUP
mongoose.connect(process.env.CONNECTION);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

// --- STATIC MIDDLEWARE
app.use(express.static(__dirname + '/experiment'));
app.use('/jsPsych', express.static(__dirname + "/jsPsych"));

// --- BODY PARSING MIDDLEWARE
app.use(body_parser.json()); // to support JSON-encoded bodies

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/experiment');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', function(request, response) {
    response.render('ArmedBandit_20Apr18.html');
});

app.post('/experiment-data', function(request, response){
    Entry.create({
        "data":request.body
    });
    response.end();
})

// --- START THE SERVER
var server = app.listen(process.env.PORT, function(){
    console.log("Listening on port %d", server.address().port);
});

