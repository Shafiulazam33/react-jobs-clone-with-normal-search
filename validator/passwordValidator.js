const validator = require('validator')

const validate = user => {
    let error = {}

    if (!user.currentPassword) {
        error.currentPassword = 'Please Provide a Password'
    } else if (user.currentPassword.length < 6) {
        error.currentPassword = 'Password Must be Greater or Equal 6 Character'
    }
    if (!user.newPassword) {
        error.newPassword = 'Please Provide a Password'
    } else if (user.newPassword.length < 6) {
        error.newPassword = 'Password Must be Greater or Equal 6 Character'
    }

    if (!user.confirmPassword) {
        error.confirmPassword = 'Please Provide Confirmation Password'
    } else if (user.newPassword !== user.confirmPassword) {
        error.confirmPassword = `Password Doesn't Match`
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate