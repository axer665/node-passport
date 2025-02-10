const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const logger = require('./middleware/logger');
const error404 = require('./middleware/error-404');
const session = require('./middleware/session');

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME;
const PasswordDB = process.env.DB_PASSWORD;
const NameDB = process.env.DB_NAME || 'library';

const UserAtlasDB = process.env.DB_ATLAS_USERNAME;
const PasswordAtlasDB = process.env.DB_ATLAS_PASSWORD;
const NameAtlasDB = process.env.DB_ATLAS_NAME || 'app_database';

const HostDb = /*process.env.DB_HOST ||*/ 'mongodb://mongodb/';
const userRepository = require('./repositories');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const booksApiRouter = require('./routes/api/books');
const userRouter = require('./routes/user');
const userApiRouter = require('./routes/api/user');

const authOptions = {
    usernameField: 'userName',
    passwordField: 'password',
    passReqToCallback: false,
}

function verify (username, password, done) {
    userRepository.users.findByUserName(username, (err, user) => {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }

        if (!userRepository.users.verifyPassword(user, password)) { return done(null, false) }

        return done(null, user);
    })
}

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(authOptions, verify));

// Конфигурирование Passport для сохранения пользователя в сессии
// passport.serializeUser((user, cb) => {
//     cb(null, user.id);
// })

// passport.deserializeUser( (id, cb) => {
//     cb(null, user);
//     db.users.findById(id,  (err, user) => {
//         if (err) { return cb(err) };
//         cb(null, user);
//     })
// })

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

const app = express()

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(session());
app.set("view engine", "ejs");
app.set("views","src/views");

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(logger);

app.use(express.static(__dirname + '/../public'));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/api/user', userApiRouter);
app.use('/api/books', booksApiRouter);
app.use(error404);

async function start() {
    try {
         // Это если хотим пользоваться сервисом Atlas
         //const UrlDB = `mongodb+srv://${UserAtlasDB}:${PasswordAtlasDB}@cluster0.ctq8h.mongodb.net/${NameAtlasDB}?retryWrites=true&w=majority`;
         //await mongoose.connect(UrlDB);

         await mongoose.connect(HostDb, {
             user: UserDB,
             pass: PasswordDB,
             dbName: NameDB,
             useNewUrlParser: true,
             useUnifiedTopology: true
         });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Express app is listening at http://localhost:${PORT}`)
        });
    } catch (e) {
        console.log(e);
    }
}

start();