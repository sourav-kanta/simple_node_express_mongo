var express = require('express');
var router = express.Router();

var status="{\"sucess\":\"true\",\"message\":\"Full speed ahead.\"}";
 
//multer object creation
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 
router.post('/', upload.single('file'),function(req, res) {
    if (req.file) {
        console.dir(req.file);
        return res.end(status);
      }
      res.end('Missing file');
  res.send("File upload sucessfully.");
});
 
module.exports = router;