const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    companies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }]
    }
})

const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile