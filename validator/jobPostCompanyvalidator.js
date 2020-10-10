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
    if (!user.job_title) {
        error.job_title = 'Please Provide Job Title'
    }
    if (!user.location) {
        error.location = 'Please Provide Location'
    }
    if (!user.remote) {
        error.remote = 'Please Provide Remote'
    }
    if (!user.job_type) {
        error.job_type = 'Please Provide Job Type'
    }
    if (!user.salary) {
        error.salary = 'Please Provide Salary'
    }
    if (!user.experience) {
        error.experience = 'Please Provide Experience'
    }
    if (!user.apply_link) {
        error.apply_link = 'Please Provide Link Or Email'
    } else if (!validator.isURL(user.apply_link) && !validator.isEmail(user.apply_link)) {
        error.apply_link = 'Not A Url Or Email'
    }
    if (!user.tags) {
        error.tags = 'Please Provide Tags'
    }
    if (!user.description) {
        error.description = 'Please Provide Description'
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate