const Sequelize = require('sequelize');


const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('user', {
	name: {type: Sequelize.STRING, allowNull: false},
	email: {type:Sequelize.STRING,
		validate: {isEmail: true}, 
		allowNull: false
	}
},
{
	classMethods: {
		getUsers: function(id){
			const where = (id)?{id: id}:{};
			return User.findAll({
				include: [
					Page
				],
				where: where
			});
		}
	}
}
);

const Page = db.define('page', {
	title: {type: Sequelize.STRING, allowNull: false},
	urlTitle: {type: Sequelize.STRING, allowNull: false},
	content: {type: Sequelize.TEXT, allowNull: false},
	status: {
		type: Sequelize.ENUM('open', 'closed'),
		defaultValue: 'open'
	},
	date: {
		type: Sequelize.DATE, defaultValue: Sequelize.NOW
	}
}, 
{
	getterMethods: {
		route: function(){
			return "/wiki/" + this.urlTitle;
		}
	},
	classMethods: {
		getPages: (id)=>{
			let where = (id)?{"id": id}:{};
			return Page.findAll({
				include: [
					User
				],
				where: where
			});
		},
		createPage: (input)=> {
			return User.findOrCreate({where: {name: input.name, email: input.email}})
			.then((user)=> {
				return Page.create({
					userId: user[0].id,
					title: input.title,
					content: input.content
				});
			})
			.then((page)=>{
				return page;
			})
			.catch((err)=> {
				console.log('err = ', err);
			})
		}
	},
	hooks: {
		beforeValidate: function(page) {
			if (page.title){
					page.urlTitle = page.title.replace(/\s+/gi, '_').replace(/\W/g, '')
				} else {
					page.urlTitle = Math.random().toString(36).substring(2,7);
				}
		}
	}
});	

Page.belongsTo(User);
User.hasMany(Page);

const createPage = (input)=> {
	User.findOrCreate({where: {name: input.name, email: input.email}})
	.then((user)=> {
		return Page.create({
			userId: user[0].id,
			title: input.title,
			urlTitle: input.urltitle,
			content: input.content
		});
	})
	.then((page)=>{
		return page;
	})
	.catch((err)=> {
		console.log('err = ', err);
	})
};

const sync = ()=> {
	return db.sync({force: true, logging: false});
};

const seed = ()=> {
	const users = [
		{
			name: 'Bobby', 
			email: 'robert.vandermark@gmail.com'
		}, {
			name: 'Sally Long-Tall', 
			email: "RockAndRoll@music.com"
		}
	];
	const pages = [
		{
			title: 'Point of No Return',
			urlTitle: 'point_of_no_return',
			content: 'Ask not...',
			userId: 1
		}, 
		{
			title: 'Southern Man',
			urlTitle: 'southern_man',
			content: 'Keep your head',
			userId: 2
		},  
		{
			title: 'CarnEvil 9',
			urlTitle: 'carnevil_9',
			content: 'Welcome back my friends',
			userId: 2
		}
	];
	const userPromises = users.map((user)=> {
		return User.create(user);
	});
	const pagePromises = pages.map((user)=> {
		return Page.create(user);
	});

	Promise.all(userPromises)
	.catch((err)=> {
		console.log('Error = ', err);
	});
	Promise.all(pagePromises)
	.catch((err)=> {
		console.log('Error = ', err);
	});
};


module.exports = {
	sync,
	seed,
	createPage,
	Page,
	User
};