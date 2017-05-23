/* eslint camelcase: 0 */
const express = require('express')
const Q = require('q')
const interactionLabels = require('../labels/interaction-labels')
const contactRepository = require('../repos/contact.repo')
const companyRepository = require('../repos/company.repo')
const metadataRepository = require('../repos/metadata.repo')
const advisorRepository = require('../repos/advisor.repo')
const interactionDataService = require('../services/interaction-data.service')
const interactionFormService = require('../services/interaction-form.service')
const { containsFormData } = require('../lib/controller-utils')
const router = express.Router()

function editDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const token = req.session.token
      const default_dit_advisor = req.session.user

      // Work out what to use for the form data
      // This can either be data recently posted, to be re-rendered with errors
      // or an interaction that the user wishes to edit
      // or a new interaction for a company or contact
      if (containsFormData(req)) {
        res.locals.formData = req.body
        res.locals.company = yield companyRepository.getDitCompany(token, req.body.company)
        res.locals.interaction_type = interactionDataService.getInteractionType(req.body.interaction_type)
      } else if (res.locals.interaction) {
        res.locals.formData = interactionFormService.getInteractionAsFormData(res.locals.interaction)
        res.locals.interaction_type = res.locals.interaction.interaction_type
        res.locals.company = res.locals.interaction.company
      } else if (req.query.company) {
        res.locals.interaction = yield interactionDataService.createBlankInteractionForCompany(token, default_dit_advisor, req.query.interaction_type, req.query.company)
        res.locals.formData = interactionFormService.getInteractionAsFormData(res.locals.interaction)
        res.locals.company = res.locals.interaction.company
        res.locals.interaction_type = res.locals.interaction.interaction_type
      } else if (req.query.contact) {
        res.locals.interaction = yield interactionDataService.createBlankInteractionForContact(token, default_dit_advisor, req.query.interaction_type, req.query.contact)
        res.locals.formData = interactionFormService.getInteractionAsFormData(res.locals.interaction)
        res.locals.company = res.locals.interaction.company
        res.locals.interaction_type = res.locals.interaction.interaction_type
      } else {
        return next('Unable to edit interaction')
      }

      if (req.query && req.query.company) {
        res.locals.backUrl = `/company-interactions/${req.query.company}`
      } else if (req.query && req.query.contact) {
        res.locals.backUrl = `/contact-interactions/${req.query.contact}`
      } else if (res.locals.interaction) {
        res.locals.backUrl = `/interaction/${res.locals.interaction.id}/details`
      }

      const companyContacts = yield contactRepository.getContactsForCompany(req.session.token, res.locals.formData.company)
      res.locals.contacts = companyContacts.map((contact) => {
        return {
          id: contact.id,
          name: `${contact.first_name} ${contact.last_name}`
        }
      })

      if (res.locals.formData.dit_advisor) {
        res.locals.dit_advisor = yield advisorRepository.getAdvisor(req.session.token, res.locals.formData.dit_advisor)
      } else {
        res.locals.dit_advisor = default_dit_advisor
      }

      res.locals.serviceOfferOptions = yield metadataRepository.getServiceOffers(token)
      res.locals.serviceProviderOptions = metadataRepository.teams
      res.locals.labels = interactionLabels

      res.render('interaction/interaction-edit')
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}

function postDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      const result = yield interactionFormService.saveInteractionForm(req.session.token, req.body)
      res.redirect(`/interaction/${result.id}/details`)
    } catch (errors) {
      if (errors.error) {
        if (errors.error.errors) {
          res.locals.errors = errors.error.errors
        } else {
          res.locals.errors = errors.error
        }
        editDetails(req, res, next)
      } else {
        next(errors)
      }
    }
  })
}

router.get(['/interaction/add/', '/interaction/:interactionId/edit', '/interaction/edit/'], editDetails)
router.post(['/interaction/add/', '/interaction/:interactionId/edit', '/interaction/edit/'], postDetails)

module.exports = { router, editDetails, postDetails }
