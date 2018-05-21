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

const upload = multer({storage}).single('myImage');

//Init app
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req,res) => {
	upload(req, res, (err) => {
		if(err){
			res.render('index', {message: err})
		}else{
			console.log(req.file);
			res.send('test');
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server started on port ' + port));