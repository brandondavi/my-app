// `express` 
// 		a web framework for Node.js that simplifies the process of creating a server and handling routes.
// `cors` 
// 		a middleware that allows the server to accept requests from different origins, 
//    	necessary for frontend-backend communication in webapps
// `dotenv` 
// 		loads environment variables from a .env file into process.env

const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

// to connec to the mongoDB database, 
// we need to import the connectDB function from the config/db.js file. 
// This function will handle the connection to the database when the server starts.
const connectDB = require('./config/db');



const app = express();
connectDB();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
	res.send('Chat Backend is running!')
});


const PORT = process.env.PORT || 5000;

app.use('/api/characters', require('./routes/characterRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/conversation', require('./routes/conversationRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});