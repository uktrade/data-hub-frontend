/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const { getFormattedAddress } = require('../lib/address')
const companyRepository = require('../repositorys/companyrepository')
const companyFormattingService = require('../services/companyformattingservice')
const { chDetailsLabels } = require('../labels/companylabels')

const router = express.Router()
const chDetailsDisplayOrderLong = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

function getDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const company = yield companyRepository.getCHCompany(req.session.token, req.params.id)
      res.locals.tab = 'details'
      res.locals.headingName = company.name
      res.locals.headingAddress = getFormattedAddress(company, 'registered')

      res.locals.chDetails = companyFormattingService.getDisplayCH(company)
      res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderLong
      res.locals.chDetailsLabels = chDetailsLabels
      res.locals.addUrl = `/company/add/ltd/${company.company_number}`

      res.render('company/details-ch')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

router.get('/company/ch/details/:id', getDetails)

module.exports = { router, getDetails }
