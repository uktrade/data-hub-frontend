/* eslint new-cap: 0 */
const express = require('express')
const router = express.Router()

function myAccount (req, res) {
  res.render('myaccount/index', {
    title: 'Your account',
  })
}

router.get('/myaccount', myAccount)

module.exports = { router }
