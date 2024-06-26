require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const session = require('express-session')

const connectDB = require('./server/config/db')
const { isActiveRoute } = require('./server/helpers/routeHelpers');
const mongoStore = require('connect-mongo')
const app = express()
const PORT = process.env.PORT || 5000

//connecting to DB
connectDB()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use(session({
    secret: 'jelou',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));

app.use(express.static('public'))

//templing engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.locals.isActiveRoute = isActiveRoute; 

//routing
app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

app.listen(PORT, ()=> { 
    console.log(`App listening on port ${PORT}`)
})