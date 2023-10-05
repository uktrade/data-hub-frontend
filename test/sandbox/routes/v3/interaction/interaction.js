import interactionJson from '../../../fixtures/v3/interaction/interaction.json' assert { type: 'json' }
import interactionWithDocumentLinkJson from '../../../fixtures/v3/interaction/interaction-with-document-link.json' assert { type: 'json' }
import interactionWithoutDocumentLinkJson from '../../../fixtures/v3/interaction/interaction-without-document-link.json' assert { type: 'json' }
import interactionsJson from '../../../fixtures/v3/interaction/interactions.json' assert { type: 'json' }
import no_interactionsJson from '../../../fixtures/v3/interaction/no_interactions.json' assert { type: 'json' }
import interactionByInvestmentProjectIdJson from '../../../fixtures/v3/interaction/interaction-by-investment-project-id.json' assert { type: 'json' }
import interactionByCompanyIdJson from '../../../fixtures/v3/interaction/interaction-by-company-id.json' assert { type: 'json' }
import interactionByContactIdJson from '../../../fixtures/v3/interaction/interaction-by-contact-id.json' assert { type: 'json' }
import interactionCancelledMeetingJson from '../../../fixtures/v3/interaction/interaction-cancelled-meeting.json' assert { type: 'json' }
import interactionCreateJson from '../../../fixtures/v3/interaction/interaction-create.json' assert { type: 'json' }
import interactionDraftFutureMeetingJson from '../../../fixtures/v3/interaction/interaction-draft-future-meeting.json' assert { type: 'json' }
import interactionDraftPastMeetingJson from '../../../fixtures/v3/interaction/interaction-draft-past-meeting.json' assert { type: 'json' }
import interactionValidationErrorJson from '../../../fixtures/v3/interaction/interaction-validation-error.json' assert { type: 'json' }
import interactionWithReferralJson from '../../../fixtures/v3/interaction/interaction-with-referral.json' assert { type: 'json' }
import interactionWithoutThemeJson from '../../../fixtures/v3/interaction/interaction-without-theme.js'

export const getInteractions = function (req, res) {
  if (req.query.contact_id) {
    return res.json(interactionByContactIdJson)
  }

  if (req.query.company_id === '346f78a5-1d23-4213-b4c2-bf48246a13c3') {
    return res.json(interactionByCompanyIdJson)
  }

  if (
    req.query.investment_project_id === '5d341b34-1fc8-4638-b4b1-a0922ebf401e'
  ) {
    return res.json(interactionByInvestmentProjectIdJson)
  }

  if (req.query.event_id === 'b93d4273-36fe-4008-ac40-fbc197910791') {
    return res.json(no_interactionsJson)
  }

  res.json(interactionsJson)
}

export const getInteractionById = function (req, res) {
  var interactions = {
    'ec4a46ef-6e50-4a5c-bba0-e311f0471312': interactionWithDocumentLinkJson,
    '0dcb3748-c097-4f20-b84f-0114bbb1a8e0': interactionWithoutDocumentLinkJson,
    '57a0b5ea-ad56-49c9-b70e-0542153ea673': interactionCancelledMeetingJson,
    '999c12ee-91db-4964-908e-0f18ce823096': interactionDraftFutureMeetingJson,
    '888c12ee-91db-4964-908e-0f18ce823096': interactionDraftPastMeetingJson,
    '65e984ad-1ad5-4d89-9b12-71cdff5f412d': interactionWithReferralJson,
    '65e984ad-1ad5-4d89-9b12-71cdff5f412c': interactionWithoutThemeJson,
  }

  var interactionResponse =
    interactions[req.params.interactionId] || interactionJson

  if (state.interaction) {
    var merged = _.merge({}, interactionResponse, {
      subject: state.interaction.subject,
    })
    delete state.interaction
    return res.json(merged)
  }

  return res.json(interactionResponse)
}

export const createInteraction = function (req, res) {
  if (_.isEqual(req.body.companies, ['4e6a4edb-55e3-4461-a88d-84d329ee7eb8'])) {
    return res.status(400).json(interactionValidationErrorJson)
  }

  if (req.body.subject) {
    state.interaction = {
      subject: req.body.subject,
    }
  }

  if (req.body.were_countries_discussed === 'true') {
    return res.status(201).json({
      ...interactionCreateJson,
      were_countries_discussed: true,
    })
  }

  res.status(201).json(interactionCreateJson)
}

export const archiveInteraction = function (req, res) {
  return getInteractionById(req, res)
}

export const patchInteraction = function (req, res) {
  return getInteractionById(req, res)
}
