const express = require("express")
const passport = require("passport")
const passportazure = require("passport-azure-ad")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const config = require("./config")
const server = express()

// server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())
server.use(session({ resave: true, saveUninitialized: true, secret: config.SESSION_SECRET }))
server.use(passport.initialize())
server.use(passport.session())

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.URL_FRONTEND)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

const OIDCStrategy = passportazure.OIDCStrategy

const users = []

passport.serializeUser((user, done) => {
  done(null, user.oid);
});

passport.deserializeUser((oid, done) => {
  findByOid (oid, function (err, user) {
    done(err, user);
  });
});

const findByOid = (oid, cb) => {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.oid === oid) {
      return cb(null, user)
    }
  }
  return cb(null, null)
}

passport.use(new OIDCStrategy(config.AZURE, (iss, sub, profile, accessToken, refreshToken, done) => {
  if (!profile.oid) return done(new Error('No oid found'), null)

  process.nextTick(() => {
    findByOid(profile.oid, (err, user) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        users.push(profile)
        return done(null, profile)
      }
      return done(null, user);
    })
  })
}))

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}

server.get('/islogin', (req, res, next) => {
  res.send(req.isAuthenticated())
  next()
})

server.get('/login', (req, res, next) => {
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/fail' })(req, res, next)
}, (req, res) => {
  res.redirect('/')
})

server.post('/signin', (req, res, next) => {
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/fail' })(req, res, next)
}, (req, res) => {
  console.log('Datos de azure recibidos correctamente')
  res.redirect(config.URL_FRONTEND)
})

server.get('/account', ensureAuthenticated, (req, res) => {
  res.send(req.user)
})

server.get('/logout', (req, res) => {
  req.session.destroy(err => {
    console.log(err)
    req.logOut()
    res.redirect(config.destroySessionUrl)
  })
})

server.listen(4000, () => console.log("Server running port 4000"))
