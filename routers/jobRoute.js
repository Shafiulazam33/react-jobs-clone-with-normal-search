const router = require('express').Router()
const authenticate = require('../authenticate')

const { check, findJobs, findCompanyToEdit, findJobToEdit, findCompanies, postJobWithCompany, postJobWithExistedCompany, payforfeature, findFeaturedPost, featuredPostClose } = require('../controllers/jobController')

router.post('/jobs', findJobs)
router.post('/check', check)
router.put('/find-job-edit', authenticate, findJobToEdit)
router.put('/find-company-edit', authenticate, findCompanyToEdit)
router.post('/companies', authenticate, findCompanies)
router.post('/post-job', authenticate, postJobWithExistedCompany)
router.post('/post-company-job', authenticate, postJobWithCompany)
router.put('/payFor-feature', authenticate, payforfeature)
router.get('/find-featured-post', authenticate, findFeaturedPost)
router.put('/featured-post-close', authenticate, featuredPostClose)

module.exports = router
