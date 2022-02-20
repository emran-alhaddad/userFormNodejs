var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var User = require('./userModule');


var server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(path.resolve(__dirname, 'Assets')));

server.get('/', function(request, res) {
    res.sendFile(__dirname + "/index.html")
});


server.post('/addUser', function(request, response) {

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

        var imageOldpath = files[0].filetoupload.filepath;
        var imageNewName = Date.now() + files.filetoupload.originalFilename;
        var imageNewpath = __dirname + '/assets/images/' + imageNewName;

        var cvOldpath = files[1].filetoupload.filepath;
        var cvNewName = Date.now() + files.filetoupload.originalFilename;
        var cvNewpath = __dirname + '/assets/cv/' + cvNewName;

        fs.rename(imageOldpath, imageNewpath);
        fs.rename(cvOldpath, cvNewpath);

        User.create({
                FullName: fields.fullName,
                userName: fields.userName,
                email: fields.email,
                image: imageNewpath,
                cv: cvNewpath
            },
            function(err) {
                if (err) return handleError(err);
                response.redirect('/showUsers');
            });
    });



});

server.get('/showUsers', (request, res) => {
    dbConn.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).sendFile(__dirname + "/users.html"); //.json(feedbacks);
        });
    });
});



server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');