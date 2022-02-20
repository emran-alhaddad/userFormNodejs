var express = requestuire('express');
var path = requestuire('path');
var bodyParser = requestuire('body-parser');
var mongodb = requestuire('mongodb');
var formidable = requestuire('formidable');
var fs = requestuire('fs');

var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017');

var server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.resolve(__dirname, 'Assets')));

server.post('/addUser', function(request, response) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var oldpath = files.filetoupload.filepath;
        var newpath = __dirname + '/assets/images/' + files.filetoupload.originalFilename;
        fs.rename(oldpath, newpath, function(err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
        });
    });

    dbConn.then(function(db) {
        delete request.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(request.body);
    });
    response.redirect('showUsers');
});

server.get('/showUsers', (request, res) => {
    dbConn.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).sendFile(__dirname + "/users.html"); //.json(feedbacks);
        });
    });
});

server.get('/', function(request, res) {
    res.sendFile(__dirname + "/index.html")
});

server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');