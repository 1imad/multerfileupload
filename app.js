const express = require('express'),
	  multer = require('multer'),
	  ejs = require('ejs'),
	  path = require('path');

//Set storage engine!

const storage = multer.diskStorage({ // notice you are calling the multer.diskStorage() method here, not multer()
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
    }
});

//Init Upload.

const upload = multer({storage: storage,
	limits: {fileSize: 1000000},
	fileFilter: function(req, file, cb){
		checkFileType(file, cb);
	}
}).single('myImage');

//Check file Type

function checkFileType(file, cb){
	//Allow ext
	const filetypes = /jpeg|jpg|png|gif/;
	//check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	//check mime
	const mimetype = filetypes.test(file.mimetype);
	 if(mimetype && extname){
	 	return cb(null, true);
	 }else{
	 	cb('Error: Images Only!' );
	 }
}

//Init app
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req,res) => {
	upload(req, res, (err) => {
		if(err){
			res.render('index', {msg: err})
		}else{
			if(req.file == undefined){
				res.render('index', {msg: 'Error: No File Selected!'})
			}else{
				res.render('index', {
					msg: 'File Uploaded!', 
					file: 'uploads/' + req.file.filename
				});
			}
		}
	});
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server started on port ' + port));