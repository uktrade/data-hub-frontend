/* eslint new-cap: 0 */
const express = require('express')
const Q = require('q')
const { getFormattedAddress } = require('../lib/address')
const companyRepository = require('../repos/company.repo')
const companyFormattingService = require('../services/company-formatting.service')
const { chDetailsLabels } = require('../labels/company-labels')

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
      res.locals.title = [company.name, 'Companies']

      res.render('company/details-ch')
    } catch (error) {
      next(error)
    }
  })
}

router.get('/company/view/ch/:id', getDetails)

module.exports = { router, getDetails }
