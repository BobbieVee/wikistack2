const router = require('express').Router();
const db = require('../models');
const User = db.User;


router.get('/', (req, res, next)=> {
	User.getUsers()
	.then((users)=> {
		res.render('users', {users: users});
	})
	.catch((err)=> {
		console.log(err)
	});
});

router.get('/:id',(req, res, next)=> {
	User.getUsers(req.params.id)
	.then((users)=> {
		res.render('user', {user: users[0]});
	})
	.catch((err)=> {
		console.log(err)
	});
});


module.exports =  router;
