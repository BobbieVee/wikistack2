const router = require('express').Router();
const db = require('../models');
const Page = db.models.Page;

router.get('/add', (req, res, next)=> {
	res.render('addpage')
});

router.get('/',(req, res, next)=> {
	Page.getPages()
	.then((pages)=> {
		res.render("index", {pages: pages});
	});
});

router.post('/',(req, res, next)=> {
	db.createPage(req.body);
	res.json(req.body);
})

module.exports = router;