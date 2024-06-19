const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const auth = require('./middleware/auth');

const errorController = require('./controllers/error');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const newsRoutes = require('./routes/news');
const userdataRoutes = require('./routes/userdata');
const newsfeedbackRoutes = require('./routes/newsfeedback');
const postsfeedbackRoutes = require('./routes/postsfeedback');



// Allow all origins for development (you might want to restrict this in production)



const app = express();
app.use(cors());
const ports = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use((req,res,next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Custom-Header, Authorization');
	next();
});
app.use('/auth', authRoutes);
app.use('/post', postsRoutes);
app.use('/news', newsRoutes);
app.use('/userdata', userdataRoutes);
app.use('/newsfeedback', newsfeedbackRoutes);
app.use('/postsfeedback', postsfeedbackRoutes);

app.use(errorController.get404);
app.use(errorController.get500);
app.listen(ports, () => console.log(`Listening on port ${ports}`)); 