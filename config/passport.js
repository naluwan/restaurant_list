const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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

        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email 或 密碼錯誤!' })
          }
          return done(null, user)
        })
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