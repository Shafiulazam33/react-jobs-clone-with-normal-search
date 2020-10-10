const router = require('express').Router()
const { login, register, emailVerification, haveEmail, passwordReset, updateEmail, updatePassword, updateCompany, updateJob } = require('../controllers/profileController')
const authenticate = require('../authenticate')
router.post('/login', login)
router.post('/register', register)
router.get('/email-verification', authenticate, emailVerification)
router.put('/password-reset', authenticate, passwordReset)
router.post('/have-email', haveEmail)
router.put('/update-email', authenticate, updateEmail)
router.put('/update-password', authenticate, updatePassword)
router.put('/update-company', authenticate, updateCompany)
router.put('/update-job', authenticate, updateJob)

module.exports = router