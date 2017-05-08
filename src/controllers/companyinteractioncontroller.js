/* eslint new-cap: 0 */
const express = require('express')
const Q = require('q')
const companyService = require('../services/companyservice')
const { getDisplayCompanyInteraction } = require('../services/interactionformattingservice')
const router = express.Router()

/**
 *
 *  HTTP Get call to get a list of interactions for a company
 *  Gets a list of interactions associated with a company
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
function getInteractions (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.tab = 'interactions'
      const company = res.locals.company = yield companyService.getInflatedDitCompany(req.session.token, req.params.id)
      companyService.getCommonTitlesAndlinks(company, res)

      res.locals.interactions = res.locals.company.interactions.map(interaction => getDisplayCompanyInteraction(interaction))

      // Only allow a link to add an interaction if the company has contacts
      if (company.id && company.contacts && company.contacts.length > 0) {
        res.locals.addInteractionUrl = `/interaction/add-step-1/?company=${company.id}`
      }

      if (!company.contacts || company.contacts.length === 0) {
        res.locals.addContact = `/contact/add?company=${res.locals.company.id}`
      }

      res.render('company/interactions')
    } catch (error) {
      next(error)
    }
  })
}

router.get('/company-interactions/:id', getInteractions)

module.exports = { getInteractions, router }
