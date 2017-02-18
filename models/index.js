const Sequelize = require('sequelize');


const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('user', {
	name: {type: Sequelize.STRING, allowNull: false},
	email: {type:Sequelize.STRING,
		validate: {isEmail: true}, 
		allowNull: false
	}
});

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
		getPages: ()=>{
			return Page.findAll({
				include: User
			});
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
		console.log('page = ', page);
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
			content: 'Ask not...'
		}, 
		{
			title: 'Southern Man',
			urlTitle: 'southern_man',
			content: 'Keep your head'
		},  
		{
			title: 'CarnEvil 9',
			urlTitle: 'carnevil_9',
			content: 'Welcome back my friends'
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
	models:{
		Page,
		User
	}
};