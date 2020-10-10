const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Profile = require('../model/profile')
const Company = require('../model/company')
const Jobpost = require('../model/Jobpost')
const registerValidator = require('../validator/registerValidator')
const loginValidator = require('../validator/loginValidator')
const emailValidator = require('../validator/emailValidator')
const companyValidator = require('../validator/companyValidator')
const passwordValidator = require('../validator/passwordValidator')
const jobPostValidator = require('../validator/jobPostvalidator')
const jobPostCompanyValidator = require('../validator/jobPostCompanyvalidator')
const { doemail } = require('../utils/doemail')
const { serverError, resourceError } = require('../utils/error')
module.exports = {
    login(req, res) {
        let { email, password } = req.body
        let validate = loginValidator({ email, password })
        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }

        Profile.findOne({ email })
            .then(user => {
                if (!user) {
                    return resourceError(res, 'User Not Found')
                }
                if (!user.emailConfirmed) {
                    return res.status(400).json({
                        confirm: "Please Confirm Your Email"
                    })
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return serverError(res, err)
                    }
                    if (!result) {
                        return resourceError(res, 'Password Doesn\'t Match')
                    }

                    let token = jwt.sign({
                        _id: user._id,
                        email: user.email,
                        isAdmin: user.isAdmin
                    }, 'SECRET', { expiresIn: '100h' })

                    res.status(200).json({
                        message: 'Login Successful',
                        token: `Bearer ${token}`
                    })

                })
            })
            .catch(error => serverError(res, error))
    },
    register(req, res) {
        let { email, password, confirmPassword } = req.body
        let validate = registerValidator({ email, password, confirmPassword })

        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        } else {
            Profile.findOne({ email })
                .then(user => {
                    if (user) {
                        return resourceError(res, 'Email Already Exist')
                    }

                    bcrypt.hash(password, 11, (err, hash) => {
                        if (err) {
                            return resourceError(res, 'Server Error Occurred')
                        }

                        let profile = new Profile({
                            email,
                            password: hash,
                            companies: [],
                        })
                        profile.save()
                            .then(user => {
                                let token = jwt.sign({
                                    _id: user._id,
                                    email: user.email,
                                    emailConfirmed: user.emailConfirmed,
                                    isAdmin: user.isAdmin
                                }, 'SECRET', { expiresIn: '100h' })
                                doemail(email, token)
                                doemail().catch(console.error);

                                res.status(201).json({
                                    message: 'User Created Successfully',
                                    user
                                })
                            })
                            .catch(error => serverError(res, error))
                    })
                })
                .catch(error => serverError(res, error))
        }

    },
    haveEmail(req, res) {
        Profile.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return resourceError(res, 'Email Not Found')
                }
                let token = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    emailConfirmed: user.emailConfirmed,
                    isAdmin: user.isAdmin
                }, 'SECRET', { expiresIn: '100h' })
                doemail(user.email, token, true)
                doemail().catch(console.error);
                res.status(200).json({
                    email: user.email
                })
            })
            .catch(error => serverError(res, error))
    },

    emailVerification(req, res) {
        Profile.findOneAndUpdate({ email: req.user.email }, { emailConfirmed: true }, { new: true })
            .then(user => {
                res.send("<p>Email is confirmed</p>")
            })
            .catch(error => serverError(res, error))
    },

    passwordReset(req, res) {
        let { email, newPassword } = req.body
        if (req.user.email === email) {
            bcrypt.hash(newPassword, 11, (err, hash) => {
                if (err) {
                    return resourceError(res, 'Server Error Occurred')
                }
                Profile.findOneAndUpdate({ _id: req.user._id }, { password: hash }, { new: true })
                    .then(user => {
                        res.status(200).json({
                            message: 'Password Resest Successfully'
                        })
                    })
                    .catch(error => serverError(res, error))
            })
        }
        else {
            return res.status(400).json({
                message: "failed"
            });
        }
    },
    updateEmail(req, res) {
        let { currentEmail, newEmail, confirmEmail } = req.body
        let validate = emailValidator({ currentEmail, newEmail, confirmEmail })

        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }
        Profile.findOneAndUpdate({ email: currentEmail }, { email: newEmail }, { new: true })
            .then(user => {
                let token = jwt.sign({
                    _id: user._id,

                    email: user.email,

                    companies: user.companies
                }, 'SECRET', { expiresIn: '100h' })
                doemail(user.email, token)
                res.status(200).json({
                    message: 'Updated Successfully',
                    transaction: user
                })
            })
            .catch(error => serverError(res, error))
    },

    updatePassword(req, res) {
        let { currentPassword, newPassword, confirmPassword } = req.body
        let validate = passwordValidator({ currentPassword, newPassword, confirmPassword })

        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }

        Profile.findOne({ email: req.user.email })
            // Use Populate for transaction
            .then(user => {
                console.log(user)
                if (!user) {
                    return resourceError(res, 'User Not Found')
                }
                bcrypt.compare(currentPassword, user.password, (err, result) => {
                    if (err) {
                        return serverError(res, err)
                    }
                    if (!result) {
                        return resourceError(res, 'Password Doesn\'t Match')
                    }
                    bcrypt.hash(newPassword, 11, (err, hash) => {
                        if (err) {
                            return resourceError(res, 'Server Error Occurred')
                        }
                        Profile.findOneAndUpdate({ email: req.user.email }, { password: hash }, { new: true })
                            .then(user => {
                                let token = jwt.sign({
                                    _id: user._id,

                                    email: user.email,

                                    companies: user.companies
                                }, 'SECRET', { expiresIn: '100h' })

                                res.status(200).json({
                                    message: 'Updated Successfully',
                                    transaction: user,
                                    token: `Bearer ${token}`
                                })
                            })
                            .catch(error => serverError(res, error))
                    })
                })
            })
            .catch(error => serverError(res, error))

        // Generate Token and Response Back
    },
    updateCompany(req, res) {
        let { _id, company_name, website, logo_url, short_description } = req.body
        let validate = companyValidator({ company_name, website, logo_url, short_description })

        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }
        Company.findOneAndUpdate({ _id }, { $set: { company_name, website, logo_url, short_description } }, { new: true })
            .exec()
            .then(result => {
                res.status(200).json({
                    result
                })
            }).catch(error => serverError(res, error))
    },
    updateJob(req, res) {
        let { _id, company, company_name, website, logo_url, short_description,
            job_title, location, remote, job_type, salary, experience,
            apply_link, tags, description, discard, islisted } = req.body
        console.log("ghjhvcvhjhgfghjkjhgv", islisted)
        if (islisted != null) {
            Jobpost.findOneAndUpdate({ _id }, {
                $set: { islisted }
            }, { new: true })
                .exec()
                .then(result => {
                    console.log("s")
                    res.status(200).json({
                        result
                    })
                }).catch(error => serverError(res, error))
        }
        if (!discard && discard != null) {
            let validate = jobPostValidator({ company_id: company, job_title, location, remote, job_type, salary, experience, apply_link, tags, description })
            if (!validate.isValid) {
                return res.status(400).json(validate.error)
            }
            Jobpost.findOneAndUpdate({ _id }, {
                $set: {
                    company, job_title, location, remote, job_type, salary, experience,
                    apply_link, tags, description, islisted
                }
            }, { new: true })
                .exec()
                .then(result => {
                    res.status(200).json({
                        result
                    })
                }).catch(error => serverError(res, error))
        }
        else if (discard != null) {
            let validate = jobPostCompanyValidator({ company_name, website, logo_url, short_description, job_title, location, remote, job_type, salary, experience, apply_link, tags, description })
            if (!validate.isValid) {
                return res.status(400).json(validate.error)
            }
            let company = new Company({
                profile: req.user._id, company_name, website, logo_url, short_description, jobposts: [_id]
            })
            company.save()
                .then(comp => {
                    Profile.findOneAndUpdate({ _id: req.user._id }, { $push: { companies: comp._id } }, { new: true })
                        .then(res => {

                        })
                        .catch(error => serverError(res, error))
                    Jobpost.findOneAndUpdate({ _id }, {
                        $set: {
                            company: comp._id, job_title, location, remote, job_type, salary, experience,
                            apply_link, tags, description
                        }
                    }, { new: true })
                        .exec()
                        .then(result => {

                            res.status(200).json({
                                result
                            })
                        }).catch(error => serverError(res, error))
                })

        }
    }
}








