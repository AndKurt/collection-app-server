const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./router/index');
const app = express();
const errorMiddleware = require('./middlewares/error-middleware');

// import Routes
//const authRoute = require('./router/auth');
//const userRoute = require('./router/user');
//const usersRoute = require('./router/users');

dotenv.config();

const PORT = process.env.PORT || 5000;

//Connect to BD
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log('Connect to BD')
);

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/', router);
app.use(errorMiddleware);

// import Middlewares
//app.use('/', authRoute);
//app.use('/', userRoute);
//app.use('/', usersRoute);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
