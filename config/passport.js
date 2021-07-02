const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // init passport
  app.use(passport.initialize())
  app.use(passport.session())

  // setting LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {

    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '這個 Email 還沒註冊!' })
        }

        if (user.password !== password) {
          return done(null, false, { message: '帳號或密碼錯誤!' })
        }

        return done(null, user)
      })
      .catch(err => done(err, null))
  }))

  // 序列化、反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}