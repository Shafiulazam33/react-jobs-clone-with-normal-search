const validator = require('validator')

const validate = user => {
    let error = {}

    if (!user.company_name) {
        error.company_name = 'Please Provide Company Name'
    }
    if (!user.website) {
        error.website = 'Please Provide Website'
    } else if (!validator.isURL(user.website)) {
        error.website = 'Not A Website URL'
    }
    if (!user.logo_url) {
        error.logo_url = 'Please Provide Url Of Logo'
    } else if (!validator.isURL(user.logo_url)) {
        error.logo_url = 'Not A Url Of Logo'
    }
    if (!user.short_description) {
        error.short_description = 'Please Provide Short Description'
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate