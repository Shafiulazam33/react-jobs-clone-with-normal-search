const validator = require('validator')

const validate = user => {
    let error = {}

    if (!user.company_id) {
        error.company_id = 'Please Select A Company'
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