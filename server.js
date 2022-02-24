var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var User = require('./userModule');


var server = express();
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true }))
server.use(express.json());
server.use(express.static('Assets'));

server.get('/', function(req, res) {
    res.render("index")

});

server.post('/addUser', (req, res) => {

    var form = new formidable.IncomingForm();
    var fullName, userName, email, image, cv;

    form.parse(req, function(err, fields, files) {
        if (fields) {
            fullName = fields.fullName;
            userName = fields.userName;
            email = fields.email;
        }

        if (files) {

            var Image = getFileInfo(files.photo, '\\Assets\\uploads\\images\\');
            var CV = getFileInfo(files.cv, '\\Assets\\uploads\\cv\\');

            fs.rename(Image.oldPath, Image.newPath, () => {});
            fs.rename(CV.oldPath, CV.newPath, () => {});
        }
        User.create({
            FullName: fullName,
            userName: userName,
            email: email,
            image: Image.name,
            cv: CV.name
        });
        res.redirect('/showUsers');
    });

});

// server.get('/showUsers', (request, res) => {
//     User.find((err, data) => {
//         if (err) console.log(err);
//         else res.render("users", { Users: data });
//     });

// });


function getFileInfo(file, destination) {
    var extention = file.originalFilename.split(".").pop();
    var fileName = Date.now() + "-" + (Math.random() * 1e20) + "." + extention;
    var oldPath = file.filepath;
    var newPath = __dirname + destination + fileName;

    return {
        extention: extention,
        name: fileName,
        oldPath: oldPath,
        newPath: newPath
    }
}



server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');