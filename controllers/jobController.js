const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Profile = require('../model/profile')
const Company = require('../model/company')
const Jobpost = require('../model/jobpost')
console.log(" ..........................", process.env.SECRET_KEY)
const stripe = require('stripe')(process.env.SECRET_KEY)
const jobPostValidator = require('../validator/jobPostvalidator')
const jobPostCompanyValidator = require('../validator/jobPostCompanyvalidator')
const { serverError, resourceError } = require('../utils/error')
module.exports = {
    check(req, res) {
        let { a, b, company_id, location, job_title, remote, job_type, salary, experience, apply_link, tags, description, featured } = req.body;

        let jobpost = new Jobpost({
            company: company_id, job_title, location, remote, job_type, salary, experience, apply_link, tags, description, featured
        })
        jobpost.save()
            .then(postt => {
                res.status(200).json({
                    jobpostt: postt
                })

            })
            .catch(error => serverError(res, error))
    },
    findJobs2(req, res) {
        let { searchword } = req.body
        console.log(searchword)
        Jobpost.find({ "location": { $regex: searchword, $options: 'i' } })
            .sort({ 'featured.isfeatured': -1, createdAt: -1 })
            .populate('company')
            .exec()
            .then(jobs => {
                if (!jobs) {
                    resourceError(res, error)
                }
                res.status(200).json({
                    jobs
                })

            })
            .catch(error => serverError(res, error))
    },
    findCompanyToEdit(req, res) {
        let { email } = req.user
        console.log(email)
        let { _id } = req.body
        Profile.findOne({ email }, 'companies')
            .exec()
            .then(prof => {
                if (!prof) {
                    resourceError(res, error)
                }
                let comp_id = prof.companies.find((value) => {
                    return (value._id == _id)
                });
                console.log(comp_id)
                if (!comp_id) {
                    resourceError(res, error)
                }
                Company.findOne({ _id: comp_id })
                    .exec()
                    .then(result => {
                        if (!result) {
                            resourceError(res, error)
                        }
                        res.status(200).json({
                            result
                        })
                    }).catch(error => serverError(res, error))
            }).catch(error => serverError(res, error))
    },
    findJobToEdit(req, res) {
        let { email } = req.user
        console.log(email)
        let { _id } = req.body
        Profile.find({ email }, 'companies')
            .exec()
            .then(jobs => {
                if (!jobs) {
                    resourceError(res, error)
                }
                console.log(jobs[0].companies)
                let ab = jobs[0].companies
                Company.find({
                    '_id': { $in: ab }
                })
                    .then(user => {
                        if (!user) {
                            resourceError(res, error)
                        }

                        Jobpost.find({
                            'company': { $in: ab }
                        })
                            .then(result => {
                                if (!result) {
                                    resourceError(res, error)
                                }
                                console.log(result)
                                let job = result.find((value) => {
                                    return (value._id == _id)
                                });
                                if (!job) {
                                    resourceError(res, error)
                                }
                                res.status(200).json({
                                    companies: user,
                                    jobposts: job
                                })

                            })
                            .catch(error => serverError(res, error))
                    })
                    .catch(error => serverError(res, error))
            }).catch(error => serverError(res, error))

    },
    findCompanies(req, res) {
        let { email } = req.user
        Profile.find({ email }, 'companies')
            .exec()
            .then(jobs => {
                if (!jobs) {
                    resourceError(res, error)
                }
                // console.log(jobs[0].companies)
                let ab = jobs[0].companies
                Company.find({
                    '_id': { $in: ab }
                })
                    .then(user => {
                        if (!user) {
                            resourceError(res, error)
                        }

                        Jobpost.find({
                            'company': { $in: ab }
                        })
                            .then(result => {
                                if (!result) {
                                    resourceError(res, error)
                                }
                                res.status(200).json({
                                    companies: user,
                                    jobposts: result
                                })

                            })
                            .catch(error => serverError(res, error))
                    })
                    .catch(error => serverError(res, error))
            }).catch(error => serverError(res, error))
    },
    postJobWithCompany(req, res) {
        let { company_name, website, logo_url, short_description, job_title, location, remote, job_type, salary, experience, apply_link, tags, description } = req.body
        let validate = jobPostCompanyValidator({ company_name, website, logo_url, short_description, job_title, location, remote, job_type, salary, experience, apply_link, tags, description })
        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }
        let company = new Company({
            profile: req.user._id, company_name, website, logo_url, short_description, jobposts: []
        })
        company.save()
            .then(comp => {
                Profile.findOneAndUpdate({ _id: req.user._id }, { $push: { companies: comp._id } }, { new: true })
                    .then(res => {

                    })
                    .catch(error => serverError(res, error))
                let jobpost = new Jobpost({
                    company: comp._id, job_title, location, remote, job_type, salary, experience, apply_link, tags, description, featured: { isfeatured: 0 }
                })
                jobpost.save()
                    .then(post => {
                        Company.findOneAndUpdate({ _id: comp._id }, { $push: { jobposts: post._id } }, { new: true })
                            .then(result => {
                                res.status(200).json({
                                    jobpost: post
                                })
                            })
                            .catch(error => serverError(res, error))

                    })
                    .catch(error => serverError(res, error))
            })
            .catch(error => serverError(res, error))
    },
    postJobWithExistedCompany(req, res) {
        let { company_id, job_title, location, remote, job_type, salary, experience, apply_link, tags, description, featured } = req.body;
        let validate = jobPostValidator({ company_id, job_title, location, remote, job_type, salary, experience, apply_link, tags, description })
        if (!validate.isValid) {
            return res.status(400).json(validate.error)
        }
        let jobpost = new Jobpost({
            company: company_id, job_title, location, remote, job_type, salary, experience, apply_link, tags, description, featured: { isfeatured: 0 }
        })
        jobpost.save()
            .then(post => {
                Company.findOneAndUpdate({ _id: company_id }, { $push: { jobposts: postt._id } }, { new: true })
                    .then(result => {
                        res.status(200).json({
                            jobpost: post
                        })
                            .catch(error => serverError(res, error))
                    })

            })
            .catch(error => serverError(res, error))
    },
    payforfeature(req, res) {
        stripe.charges.create({
            amount: 100 * 100,
            source: req.body.id,
            currency: 'usd',
            description: "job_id " + req.body.job_id
        }).then(function () {
            console.log('Charge Successful')
            res.json({ message: 'Successfully Featured Your Post' })
            const funcDate = (d) => {
                let datetime = d.getUTCDate() + "/"
                    + (d.getUTCMonth() + 1 + 1) + "/"
                    + d.getUTCFullYear() + " Time:"
                    + d.getUTCHours() + ":"
                    + d.getUTCMinutes() + ":"
                    + d.getUTCSeconds() + " GMT";
                return datetime;
            }
            let currentdate = new Date();
            let nextdate = Number(currentdate.getTime()) + 30 * 24 * 3600 * 1000
            nextdate = new Date(nextdate);
            console.log(funcDate(nextdate))
            Jobpost.findOneAndUpdate({ _id: req.body.job_id }, {
                $set: {
                    featured: {
                        isfeatured: 1,
                        featured_created_at: funcDate(currentdate),
                        featured_expired_at: funcDate(nextdate)
                    }
                }
            }, { new: true })
                .exec()
                .then(result => {
                    console.log(result)
                    res.status(200).json({
                        result
                    })
                }).catch(error => serverError(res, error))
        }).catch(function () {
            console.log('Charge Fail')
            res.status(500).end()
        })
    },
    findFeaturedPost(req, res) {
        if (req.user.isAdmin === false) {
            return res.status(400).json({ message: "Not An Admin" })
        }
        Jobpost.find({ 'featured.isfeatured': 1 })
            .populate({
                path: 'company',
                model: 'Company',
                populate: {
                    path: 'profile',
                    model: 'Profile'
                }
            })
            .exec()
            .then(jobs => {
                if (!jobs) {
                    resourceError(res, error)
                }
                res.status(200).json({
                    jobs
                })
            })
            .catch(error => serverError(res, error))
    },
    featuredPostClose(req, res) {
        let { _id } = req.body
        Jobpost.findOneAndUpdate({ _id }, {
            $set: {
                'featured.isfeatured': 0
            }
        }, { new: true })
            .exec()
            .then(result => {
                console.log(result)
                res.status(200).json({
                    result
                })
            }).catch(error => serverError(res, error))
    }
}




