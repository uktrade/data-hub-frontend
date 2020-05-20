var interaction = require('../../../fixtures/v3/interaction/interaction.json')
var interactionWithDocumentLink = require('../../../fixtures/v3/interaction/interaction-with-document-link.json')
var interactionWithoutDocumentLink = require('../../../fixtures/v3/interaction/interaction-without-document-link.json')
var interactions = require('../../../fixtures/v3/interaction/interactions.json')
var interactionByInvestmentProjectId = require('../../../fixtures/v3/interaction/interaction-by-investment-project-id.json')
var interactionByCompanyId = require('../../../fixtures/v3/interaction/interaction-by-company-id.json')
var interactionByContactId = require('../../../fixtures/v3/interaction/interaction-by-contact-id.json')
var interactionCancelledMeeting = require('../../../fixtures/v3/interaction/interaction-cancelled-meeting.json')
var interactionCreate = require('../../../fixtures/v3/interaction/interaction-create.json')
var interactionDraftFutureMeeting = require('../../../fixtures/v3/interaction/interaction-draft-future-meeting.json')
var interactionDraftPastMeeting = require('../../../fixtures/v3/interaction/interaction-draft-past-meeting.json')
var interactionValidationError = require('../../../fixtures/v3/interaction/interaction-validation-error.json')
var interactionWithReferral = require('../../../fixtures/v3/interaction/interaction-with-referral.json')
var interactionWithoutTheme = require('../../../fixtures/v3/interaction/interaction-without-theme')

var getInteractions = function(req, res) {
  if (req.query.contact_id) {
    return res.json(interactionByContactId)
  }

  if (req.query.company_id === '346f78a5-1d23-4213-b4c2-bf48246a13c3') {
    return res.json(interactionByCompanyId)
  }

  if (
    req.query.investment_project_id === '5d341b34-1fc8-4638-b4b1-a0922ebf401e'
  ) {
    return res.json(interactionByInvestmentProjectId)
  }

  res.json(interactions)
}

var getInteractionById = function(req, res) {
  var interactions = {
    'ec4a46ef-6e50-4a5c-bba0-e311f0471312': interactionWithDocumentLink,
    '0dcb3748-c097-4f20-b84f-0114bbb1a8e0': interactionWithoutDocumentLink,
    '57a0b5ea-ad56-49c9-b70e-0542153ea673': interactionCancelledMeeting,
    '999c12ee-91db-4964-908e-0f18ce823096': interactionDraftFutureMeeting,
    '888c12ee-91db-4964-908e-0f18ce823096': interactionDraftPastMeeting,
    '65e984ad-1ad5-4d89-9b12-71cdff5f412d': interactionWithReferral,
    '65e984ad-1ad5-4d89-9b12-71cdff5f412c': interactionWithoutTheme,
  }

  var interactionResponse =
    interactions[req.params.interactionId] || interaction

  if (state.interaction) {
    var merged = _.merge({}, interactionResponse, {
      subject: state.interaction.subject,
    })
    delete state.interaction
    return res.json(merged)
  }

  return res.json(interactionResponse)
}

var createInteraction = function(req, res) {
  if (req.body.company === '4e6a4edb-55e3-4461-a88d-84d329ee7eb8') {
    return res.json(400, interactionValidationError)
  }

  if (req.body.subject) {
    state.interaction = {
      subject: req.body.subject,
    }
  }

  if (req.body.were_countries_discussed == 'true') {
    var newInteraction = JSON.parse(JSON.stringify(interactionCreate))
    newInteraction.were_countries_discussed = true
    return res.json(newInteraction)
  }

  res.json(201, interactionCreate)
}

var archiveInteraction = function(req, res) {
  return getInteractionById(req, res)
}

var patchInteraction = function(req, res) {
  return getInteractionById(req, res)
}

exports.getInteractions = getInteractions
exports.getInteractionById = getInteractionById
exports.createInteraction = createInteraction
exports.archiveInteraction = archiveInteraction
exports.patchInteraction = patchInteraction
