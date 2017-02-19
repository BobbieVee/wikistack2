const router = require('express').Router();
const db = require('../models');
const Page = db.Page;
const methodOverride = require('method-override');


router.use(methodOverride("_method"));



router.get('/add', (req, res, next)=> {
	res.render('addpage');
});

router.get('/',(req, res, next)=> {
	Page.getPages()
	.then((pages)=> {
		console.log('pages = ', pages)
		res.render("index", {pages: pages});
	})
	.catch((err)=> {
		console.log('error: ', err)
	})
});

router.get('/:id', (req, res, next)=> {
	Page.getPages(req.params.id)
	.then((pages)=> {
		res.render('wikipage', {page: pages[0]})
	})
	.catch((err)=>{
		console.log("error: ", err)
	});
		
});

router.post('/',(req, res, next)=> {
	Page.createPage(req.body)
	.then((page)=> {
		res.redirect('/wiki/' + page.id);
	});
});

router.delete('/:id', (req, res, next)=> {
	console.log('param -', req.params.id)
})

module.exports = router;