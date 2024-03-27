/* eslint-disable prettier/prettier */
const express = require('express')

const router = express.Router()

router.get(
  [
    '/exportwins/review/:id',
    '/exportwins/review-win/thankyou',
  ],
  (req, res) => res.render('__export-wins-review/view')
)

module.exports = router
