const express = require('express');
const path = require('path');
const exphbs= require('express-handlebars');
const morgan = require('morgan');
const methodOverride=require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const passport = require('passport');
//Initializacion
app = express();
require('./config/passport');
//settings
app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
                defaultLayout:'main',
                layoutsDir:path.join(app.get('views'),'layouts'),
                partialsDir:path.join(app.get('views'),'partials'),
                extname:'.hbs',
                helpers:require('./helpers/auth')
            })
);
app.set('view engine','.hbs');
//Middleware
app.use(express.urlencoded({extended:false})) ;
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(session({
    secret:'papu',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Global variables

app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    //res.locals.user= req.user || null
     let user = null
    if(req.user){
        user =JSON.parse(JSON.stringify(req.user))
    } 
    res.locals.user = user 
    next();
});
//Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));
//Static files

app.use(express.static(path.join(__dirname,'public')));

module.exports=app;