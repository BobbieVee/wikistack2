const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const db = require('./models');
const wikiRouter = require('./routes/wiki');

const app = express();
const port = process.env.PORT || 3000;
const noCache = process.env.NOCACHE || false;

app.use(morgan('combined'));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
console.log('noCache = ', noCache) 
nunjucks.configure('views', {noCache: noCache});

app.get('/', (req, res, next)=> {
	db.models.User.findAll()
	.then((users)=> {
		res.render("index");
	})
	.catch((err)=>{
		console.log('Error: ', err)
	});
});

app.use('/wiki', wikiRouter);

db.sync()
.then(()=> {
	console.log('Sync Successful');
	return db.seed()
})
.then(()=> {
	console.log('Seed Successful')
	app.listen(port, ()=> {
		console.log(`listening on port ${port}`)
	});
})
.catch((err)=> {
	console.log("Error: ", err);
});


