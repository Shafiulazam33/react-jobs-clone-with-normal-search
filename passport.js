const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const Profile = require('./model/profile')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter("token")])
opts.secretOrKey = 'SECRET';
module.exports = passport => {
    passport.use(new JwtStrategy(opts, (payload, done) => {
        Profile.findOne({ _id: payload._id })
            .then(result => {

                if (!result) {
                    return done(null, false)
                } else {
                    return done(null, result)
                }
            })
            .catch(error => {
                return done(error)
            })
    }))
}