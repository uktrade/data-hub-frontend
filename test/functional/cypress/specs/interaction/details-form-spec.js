import { reduce, isEqual } from 'lodash'

import {
  assertErrorSummary,
  assertFieldError,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldSelect,
  testBreadcrumbs,
} from '../../support/assertions'
import { fillSelect } from '../../support/form-fillers'

const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../../test/selectors')
const interactionWithoutTheme = require('../../../../sandbox/fixtures/v3/interaction/interaction-without-theme')
const {
  assertFieldTextarea,
  assertFieldDate,
  assertFieldTypeahead,
  assertFormActions,
  assertFormFields,
  assertDetails,
} = require('../../support/assertions')

const {
  KINDS,
  THEMES,
} = require('../../../../../src/apps/interactions/constants')

const assertHeader = ({ element, text }) =>
  cy.wrap(element).should('have.text', text).and('match', 'h2')

const [TODAY_YEAR, TODAY_MONTH, TODAY_DAY] = new Date()
  .toISOString()
  .split('T')[0]
  .split('-')

const ELEMENT_SERVICE_HEADER = {
  text: 'Service',
  assert: assertHeader,
}

const ELEMENT_BUSINESS_INTELLIGENCE_INFO = {
  assert: ({ element }) =>
    cy
      .wrap(element)
      .contains(
        'Select business intelligence if your contact mentioned issues relating to DBT or government objectives.'
      ),
}

const ELEMENT_SERVICE_STATUS = {
  label: 'Service status (optional)',
}
const ELEMENT_SERVICE_GRANT_OFFERED = {
  label: 'Grant offered (optional)',
}
const ELEMENT_SERVICE_NET_RECEIPT = {
  label: 'Net receipt (optional)',
}
const ELEMENT_RELATED_TRADE_AGREEMENT = {
  legend: 'Does this interaction relate to a named trade agreement? (optional)',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_TRADE_AGREEMENTS = {
  legend: 'Related named trade agreement(s)',
  placeholder: '-- Select named trade agreement --',
}
const ELEMENT_RELATED_OPPORTUNITY = {
  legend:
    'Does this interaction relate to a large capital opportunity? (optional)',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_OPPORTUNITY = {
  legend: 'Related large capital opportunity',
  placeholder: '-- Search opportunities --',
}
const ELEMENT_SERVICE = {
  emptyOption: '-- Select service --',
  assert: assertFieldSelect,
}
const ELEMENT_PARTICIPANTS_HEADER = {
  text: 'Participants',
  assert: assertHeader,
}
const ELEMENT_CONTACT = {
  label: 'Contacts',
  placeholder: 'Select contact',
  assert: assertFieldTypeahead,
}
const ELEMENT_ADD_CONTACT_LINK = {
  assert: ({ element }) => cy.wrap(element).contains('add a new contact'),
}
const ELEMENT_CONTACT_INFO_DETAILS = {
  summary: 'Information needed to add a new contact',
  content:
    'You need:full namejob titleemail' +
    ' addressphone numberwork address if different to the company address',
  assert: assertDetails,
}
const ELEMENT_ADVISER = {
  label: 'Adviser(s)',
  value: 'DBT Staff',
  assert: assertFieldTypeahead,
}
const ELEMENT_DETAILS_HEADER = {
  text: 'Details',
  assert: assertHeader,
}
const ELEMENT_DATE = {
  label: 'Date of interaction',
  value: {
    day: TODAY_DAY,
    month: TODAY_MONTH,
    year: TODAY_YEAR,
  },
  assert: assertFieldDate,
}
const ELEMENT_COMMUNICATION_CHANNEL = {
  label: 'Communication channel',
  placeholder: '-- Select communication channel --',
  assert: assertFieldTypeahead,
}
const ELEMENT_SUMMARY = {
  label: 'Summary',
  assert: assertFieldInput,
}
const ELEMENT_NOTES = {
  label: 'Notes (optional)',
  hint: 'Add details of the interaction, such as how the meeting came about and location. Issues relating to DBT or government objectives should be added to the business intelligence section.',
  assert: assertFieldTextarea,
}
// The radios on this page have been refactored to use legends instead of labels, as part of the Accessibility work.
const ELEMENT_FEEDBACK_POLICY = {
  legend: 'Did the contact provide business intelligence?',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}

const ELEMENT_EXPORT_BARRIER = {
  legend: 'Did the interaction help remove an export barrier? (optional)',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}

const ELEMENT_EXPORT_BARRIER_HOW = {
  legend: 'Tell us how the interaction helped remove an export barrier',
}
const ELEMENT_POLICY_FEEDBACK_NOTES = {
  label: 'Business intelligence',
}
const ELEMENT_COUNTRIES = {
  legend: 'Were any countries discussed? (optional)',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_COUNTRIES_CURRENTLY_EXPORTING = {
  label: 'Countries currently exporting to',
}
const ELEMENT_COUNTRIES_FUTURE_INTEREST = {
  label: 'Future countries of interest',
}
const ELEMENT_COUNTRIES_NOT_INTERESTED = {
  label: 'Countries not interested in',
}
const ELEMENT_IS_EVENT = {
  legend: 'Is this an event?',
  assert: assertFieldRadiosWithLegend,
  optionsCount: 2,
}
const ELEMENT_STEP2_BUTTONS = {
  buttons: ['Add interaction', 'Back'],
  assert: assertFormActions,
}

const COMMON_REQUEST_BODY = {
  contacts: ['9b1138ab-ec7b-497f-b8c3-27fed21694ef'],
  dit_participants: [{ adviser: '7d19d407-9aec-4d06-b190-d3f404627f21' }],
  date: `${TODAY_YEAR}-${TODAY_MONTH}-${TODAY_DAY}`,
  subject: 'Some summary',
  notes: 'Some notes',
  was_policy_feedback_provided: 'yes',
  policy_areas: [],
  policy_feedback_notes: 'Some policy feedback notes',
  companies: ['0f5216e0-849f-11e6-ae22-56b6b6499611'],
  service_answers: {},
  status: 'complete',
}

const RELATED_TRADE_AGREEMENTs_REQUEST_BODY = {
  has_related_trade_agreements: 'yes',
  related_trade_agreements: [
    '50370070-71f9-4ada-ae2c-cd0a737ba5e2',
    '09787712-0d94-4137-a5f3-3f9131e681f0',
  ],
}

function fillCommonFields({
  service,
  subservice = null,
  contact = 'Johnny Cakeman',
}) {
  fillSelect('[data-test=field-service]', service)
  if (subservice) {
    fillSelect('[data-test=field-service_2nd_level]', subservice)
  }

  if (contact) {
    cy.contains(ELEMENT_CONTACT.label)
      .parent()
      .next()
      .selectTypeaheadOption(contact)
      .should('contain', contact)
  }

  cy.contains(ELEMENT_SUMMARY.label)
    .parent()
    .next()
    .find('input')
    .type('Some summary')

  cy.contains(ELEMENT_NOTES.label)
    .parent()
    .next()
    .next()
    .find('textarea')
    .type('Some notes')

  cy.contains(ELEMENT_FEEDBACK_POLICY.legend).next().find('input').check('yes')

  cy.contains(ELEMENT_POLICY_FEEDBACK_NOTES.label)
    .parent()
    .next()
    .next()
    .find('textarea')
    .type('Some policy feedback notes')
}

function fillExportCountriesFields() {
  cy.contains(ELEMENT_COUNTRIES.legend).next().find('input').check('yes')

  cy.contains(ELEMENT_COUNTRIES_CURRENTLY_EXPORTING.label)
    .parent()
    .parent()
    .selectTypeaheadOption('Iceland')
    .parent()
    .should('contain', 'Iceland')

  cy.contains(ELEMENT_COUNTRIES_FUTURE_INTEREST.label)
    .parent()
    .parent()
    .selectTypeaheadOption('Austria')
    .parent()
    .should('contain', 'Austria')

  cy.contains(ELEMENT_COUNTRIES_NOT_INTERESTED.label)
    .parent()
    .parent()
    .selectTypeaheadOption('Germany')
    .parent()
    .should('contain', 'Germany')
}

function fillExportBarrierFields() {
  cy.contains(ELEMENT_EXPORT_BARRIER.legend).next().find('input').check('yes')

  cy.contains(ELEMENT_EXPORT_BARRIER_HOW.legend)
    .next()
    .next()
    .contains('Other')
    .click()

  cy.contains(
    'What happened in the interaction to help remove an export barrier?'
  )
    .parent()
    .next()
    .find('textarea')
    .type('My export barrier notes')
}

function fillRelatedTradeAgreementFields() {
  cy.contains(ELEMENT_RELATED_TRADE_AGREEMENT.legend)
    .next()
    .find('input')
    .check('yes')

  cy.contains(ELEMENT_TRADE_AGREEMENTS.legend)
    .parent()
    .parent()
    .selectTypeaheadOption('UK-Australia Mutual Recognition Agreement')
    .parent()
    .should('contain', 'UK-Australia Mutual Recognition Agreement')

  cy.contains(ELEMENT_TRADE_AGREEMENTS.legend)
    .parent()
    .parent()
    .selectTypeaheadOption('UK-Mexico Trade Continuity Agreement')
    .parent()
    .should('contain', 'UK-Mexico Trade Continuity Agreement')
}

function submitForm(kind, theme, values) {
  cy.get('#interaction-details-form').within(() => {
    fillCommonFields(values)

    if (theme === THEMES.EXPORT) {
      fillExportBarrierFields()
    }

    if (theme !== THEMES.INVESTMENT) {
      fillRelatedTradeAgreementFields()
      fillExportCountriesFields()
    }

    if (kind === KINDS.INTERACTION) {
      cy.contains(ELEMENT_COMMUNICATION_CHANNEL.label)
        .parent()
        .next()
        .selectTypeaheadOption('Telephone')
        .find('input')
        .should('have.attr', 'value', 'Telephone')
    } else if (kind === KINDS.SERVICE_DELIVERY) {
      cy.contains(ELEMENT_SERVICE_STATUS.label)
        .parent()
        .next()
        .find('select')
        .select('Completed')

      cy.contains(ELEMENT_SERVICE_GRANT_OFFERED.label)
        .parent()
        .next()
        .find('input')
        .type('123')

      cy.contains(ELEMENT_SERVICE_NET_RECEIPT.label)
        .parent()
        .next()
        .find('input')
        .type('456')

      cy.contains(ELEMENT_IS_EVENT.legend).next().find('input').check('yes')

      cy.get('#event')
        .parent()
        .selectTypeaheadOption('Sort event')
        .parent()
        .find('input')
        .should('have.attr', 'value', 'Sort Event')
    }

    if (theme == THEMES.INVESTMENT) {
      cy.contains(ELEMENT_RELATED_OPPORTUNITY.legend)
        .next()
        .find('input')
        .check('yes')
      cy.contains(ELEMENT_OPPORTUNITY.legend)
        .parent()
        .next()
        .selectTypeaheadOption('A modified opportunity')
        .find('input')
        .should('have.attr', 'value', 'A modified opportunity')
    }

    clickAddInteraction()
  })
}

function clickAddInteraction() {
  cy.contains('button', 'Add interaction').click()
}

function spyOnRequest(url = '/api-proxy/v4/interaction') {
  cy.intercept('POST', url).as('interactionHttpRequest')
}

function objectDiff(a, b) {
  return reduce(
    a,
    (result, value, key) =>
      isEqual(value, b[key]) ? result : result.concat(key),
    []
  )
}

function assertRequestBody(expectedBody, callback) {
  cy.wait('@interactionHttpRequest').then((xhr) => {
    cy.log(
      'Request body fields that differ',
      objectDiff(xhr.request.body, expectedBody)
    )

    if (expectedBody.theme != THEMES.INVESTMENT) {
      expect(xhr.request.body.has_related_trade_agreements).to.equal(
        expectedBody.has_related_trade_agreements
      )
      expect(xhr.request.body.related_trade_agreements).to.deep.equal(
        expectedBody.related_trade_agreements
      )
      expect(xhr.request.body).to.deep.equal(expectedBody)
    }

    callback(xhr)
  })
}

const selectInteractionType = (theme, kind) => {
  cy.contains('label', theme).click()
  kind && cy.contains('label', kind).click()
  cy.contains('button', 'Continue').click()
}

const company = fixtures.company.venusLtd

describe('Export theme - standard interaction', () => {
  context('when viewing the form', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      ['Add interaction']: null,
    })
  })

  context('when giving user guidance about trade agreement options', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))
    })

    it('should permanently show a description about when to select trade agreement', () => {
      cy.get('div [data-test="trade-agreement-guide"]').should(
        'contain',
        `Select 'trade agreement' if your interaction deals with a named trade agreement.For more information see recording trade agreement activity (opens in new tab).`
      )
    })

    it('should always have a see more guidance link', () => {
      cy.get('div [data-test="trade-agreement-guide"]>a')
        .should('contain', 'recording trade agreement activity')
        .should(
          'have.attr',
          'href',
          'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/'
        )
    })
  })

  context('when creating an export interaction', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A standard interaction').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADD_CONTACT_LINK,
        ELEMENT_CONTACT_INFO_DETAILS,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_SUMMARY,
        ELEMENT_NOTES,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_EXPORT_BARRIER,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should only show non-archived contacts in the contacts field', () => {
      cy.contains(ELEMENT_PARTICIPANTS_HEADER.text)
        .next()
        .click()
        .find('[data-test="typeahead-menu-option"]')
        .should('have.length', 1)
        .eq(0)
        .should('have.text', 'Johnny Cakeman')
    })

    const export_standard_theme_error_messages = [
      'Select a service',
      'Select at least one contact',
      'Select a communication channel',
      'Enter a summary',
      'Select if the contact provided business intelligence',
    ]

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(export_standard_theme_error_messages)
    })

    it('should validate the second tier service form field', () => {
      fillSelect('[data-test=field-service]', 'DBT export service or funding')
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(export_standard_theme_error_messages)
    })

    it('should save the interaction', () => {
      submitForm(KINDS.INTERACTION, THEMES.EXPORT, {
        service: 'DBT export service or funding',
        subservice: 'UK Tradeshow Programme (UKTP) – exhibitor',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          ...RELATED_TRADE_AGREEMENTs_REQUEST_BODY,
          theme: 'export',
          service: '380bba2b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          kind: 'interaction',
          event: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
          helped_remove_export_barrier: true,
          export_barrier_types: ['8ef83315-2b0f-4d5e-98da-a16f8b2217a6'], // Other
          export_barrier_notes: 'My export barrier notes',
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })

    it('should not persist form fields after navigating back', () => {
      cy.url().should('include', '?step=interaction_details')
      cy.contains(ELEMENT_SUMMARY.label)
        .parent()
        .next()
        .find('input')
        .type('Persisting summary')
      cy.go('back')
      cy.url().should('include', '?step=interaction_type')
      cy.contains('button', 'Continue').click()
      cy.url().should('include', '?step=interaction_details')
      cy.contains(ELEMENT_SUMMARY.label)
        .parent()
        .next()
        .find('input')
        .should('have.attr', 'value', '')
    })
  })
})

describe('Export theme - service delivery', () => {
  context('when creating a service delivery', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A service you have provided').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADD_CONTACT_LINK,
        ELEMENT_CONTACT_INFO_DETAILS,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_IS_EVENT,
        ELEMENT_SUMMARY,
        ELEMENT_NOTES,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_EXPORT_BARRIER,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    const export_service_delivery_theme_error_messages = [
      'Select a service',
      'Select at least one contact',
      'Select if this was an event',
      'Enter a summary',
      'Select if the contact provided business intelligence',
    ]

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(export_service_delivery_theme_error_messages)
    })

    it('should validate the second tier service form field', () => {
      fillSelect('[data-test=field-service]', 'DBT export service or funding')
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(export_service_delivery_theme_error_messages)
    })

    it('should save the service delivery', () => {
      submitForm(KINDS.SERVICE_DELIVERY, THEMES.EXPORT, {
        service: 'DBT export service or funding',
        subservice: 'UK Tradeshow Programme (UKTP) – exhibitor',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          ...RELATED_TRADE_AGREEMENTs_REQUEST_BODY,
          theme: 'export',
          service: '380bba2b-3499-e211-a939-e4115bead28a',
          is_event: 'yes',
          were_countries_discussed: 'yes',
          service_delivery_status: '47329c18-6095-e211-a939-e4115bead28a',
          grant_amount_offered: '123',
          net_company_receipt: '456',
          event: '0010f189-9331-4916-818a-231bf2f4882b',
          kind: 'service_delivery',
          communication_channel: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
          helped_remove_export_barrier: true,
          export_barrier_types: ['8ef83315-2b0f-4d5e-98da-a16f8b2217a6'], // Other
          export_barrier_notes: 'My export barrier notes',
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })
  })
})

describe('Investment theme', () => {
  context('when creating an interaction regarding investment', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Investment').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_SERVICE,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADD_CONTACT_LINK,
        ELEMENT_CONTACT_INFO_DETAILS,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_SUMMARY,
        ELEMENT_NOTES,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_RELATED_OPPORTUNITY,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    const investment_theme_error_messages = [
      'Select a service',
      'Select at least one contact',
      'Select a communication channel',
      'Enter a summary',
      'Select if the contact provided business intelligence',
    ]

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(investment_theme_error_messages)
    })

    it('should validate the second tier service form field', () => {
      fillSelect('[data-test=field-service]', 'Enquiry received')
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(investment_theme_error_messages)
    })

    it('should save the interaction', () => {
      submitForm(KINDS.INTERACTION, THEMES.INVESTMENT, {
        service: 'Enquiry received',
        subservice: 'General investment enquiry',
      })
      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          theme: 'investment',
          service: '3a0bba2b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          kind: 'interaction',
          large_capital_opportunity: 'a84f8405-c419-40a6-84c8-642b7c3209b2',
          event: null,
          export_countries: [],
          helped_remove_export_barrier: false,
          export_barrier_types: [],
          export_barrier_notes: '',
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })
  })
  context('with a related large capital opportunity', () => {
    context('when creating an interaction', () => {
      before(() => {
        cy.visit(urls.companies.interactions.create(company.id))
        cy.contains('label', 'Investment').click()
        cy.contains('button', 'Continue').click()
      })
      it('should give an error if selected yes there is a related opportunity but no opportunity selected', () => {
        cy.contains(ELEMENT_RELATED_OPPORTUNITY.legend)
          .next()
          .find('input')
          .check('yes')
        cy.contains('button', 'Add interaction').click()
        cy.contains('h2', 'There is a problem')
          .next()
          .should('contain', 'Select a related large capital opportunity')
      })
    })
    context('when editing an interaction', () => {
      before(() => {
        cy.visit(
          urls.interactions.edit(fixtures.interaction.withInvestmentTheme.id)
        )
        cy.intercept(
          'PATCH',
          `/api-proxy/v4/interaction/${fixtures.interaction.withInvestmentTheme.id}`
        ).as('apiRequest')
      })
      it('should remove the opportunity from the interaction if user selects no related opportunity', () => {
        cy.contains(ELEMENT_RELATED_OPPORTUNITY.legend)
          .next()
          .find('input')
          .check('no')
        cy.contains('button', 'Save interaction').click()
        cy.wait('@apiRequest').then(({ request }) => {
          expect(request.body.large_capital_opportunity).to.equal(null)
        })
      })
    })
  })
})

describe('Trade Agreement theme', () => {
  context('when creating an interaction regarding trade agreements', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))
      cy.contains('label', 'Trade agreement').click()
      cy.contains('button', 'Continue').click()
    })
    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_SERVICE,
        ELEMENT_RELATED_TRADE_AGREEMENT,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADD_CONTACT_LINK,
        ELEMENT_CONTACT_INFO_DETAILS,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_SUMMARY,
        ELEMENT_NOTES,
        ELEMENT_BUSINESS_INTELLIGENCE_INFO,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    const trade_agreement_theme_error_messages = [
      'Select a service',
      'Select at least one contact',
      'Select a communication channel',
      'Enter a summary',
      'Select if the contact provided business intelligence',
    ]

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(trade_agreement_theme_error_messages)
    })

    it('should validate the second tier service form field', () => {
      fillSelect('[data-test=field-service]', 'Specific service')
      cy.contains('button', 'Add interaction').click()
      assertErrorSummary(trade_agreement_theme_error_messages)
    })

    it('should save the interaction for a specific service', () => {
      submitForm(KINDS.INTERACTION, THEMES.TRADE_AGREEMENT, {
        service: 'Specific service',
        subservice: 'Export Academy',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          ...RELATED_TRADE_AGREEMENTs_REQUEST_BODY,
          theme: 'trade_agreement',
          service: '440b7770-62d2-e325-df93-cd7b62818405',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          kind: 'interaction',
          event: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
          helped_remove_export_barrier: false,
          export_barrier_types: [],
          export_barrier_notes: '',
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })

    it('should save the interaction for trade agreements', () => {
      submitForm(KINDS.INTERACTION, THEMES.TRADE_AGREEMENT, {
        service: 'Trade agreement implementation activity',
        subservice: 'Civil society meetings',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          ...RELATED_TRADE_AGREEMENTs_REQUEST_BODY,
          theme: 'trade_agreement',
          service: '8d098d19-5988-4afd-8c0b-cc5652eccb26',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          kind: 'interaction',
          event: null,
          export_countries: [
            {
              country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
              status: 'currently_exporting',
            },
            {
              country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
              status: 'future_interest',
            },
            {
              country: '83756b9a-5d95-e211-a939-e4115bead28a',
              status: 'not_interested',
            },
          ],
          helped_remove_export_barrier: false,
          export_barrier_types: [],
          export_barrier_notes: '',
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.response.body.id)
          )
        }
      )
    })
  })
})

describe('Contact loop', () => {
  context('when a contact does not exist and user wants to add one', () => {
    beforeEach(() => {
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A standard interaction').click()
      cy.contains('button', 'Continue').click()
    })

    after(() => {
      window.sessionStorage.clear()
    })

    it('should redirect the user back to the interaction form after the contact is added', () => {
      cy.contains(ELEMENT_SUMMARY.label)
        .parent()
        .next()
        .find('input')
        .type('Test if values is restored')

      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        `${urls.companies.interactions.create(
          company.id
        )}?step=interaction_details`
      )

      cy.contains('div', 'First name').find('input').type('John')
      cy.contains('div', 'Last name').find('input').type('Doe')
      cy.contains('div', 'Job title').find('input').type('Full-stack dev')
      cy.contains('fieldset', 'Is this person a primary contact?')
        .contains('label', 'Yes')
        .click()
      cy.contains('div', 'Phone number').find('input').type('123 567 789')
      cy.contains('div', 'Email').find('input').type('john@new.com')
      cy.contains(
        'fieldset',
        'Is this contact’s work address the same as the company address?'
      )
        .contains('label', 'Yes')
        .click()
      cy.contains('button', 'Add contact').click()

      cy.url().should('include', urls.companies.interactions.create(company.id))

      cy.contains(ELEMENT_SUMMARY.label)
        .parent()
        .next()
        .find('input')
        .should('have.attr', 'value', 'Test if values is restored')

      // We are not expecting John Doe here, because the mocked sandbox response
      // returns Json Russel
      cy.contains(`You have successfully added a new contact Json Russel`)
    })
  })
})

describe('Adding an interaction from a referral', () => {
  const referral = fixtures.referrals.referalDetails

  it('should be able to create an interaction from referral', () => {
    spyOnRequest(`/api-proxy/v4/company-referral/${referral.id}/complete`)

    cy.visit(urls.companies.referrals.details(referral.company.id, referral.id))

    cy.contains(/^\s*Accept referral\s*$/).click()
    cy.contains(/^\s*Export\s*$/).click()
    cy.contains(/^\s*A standard interaction\s*$/).click()
    cy.contains(/^\s*Continue\s*$/).click()

    submitForm(KINDS.INTERACTION, THEMES.EXPORT, {
      service: 'DBT export service or funding',
      subservice: 'Export Academy',
      contact: null,
    })

    assertRequestBody(
      {
        ...COMMON_REQUEST_BODY,
        ...RELATED_TRADE_AGREEMENTs_REQUEST_BODY,
        companies: [referral.company.id],
        contacts: [referral.contact.id], // Was prepopulated
        theme: 'export',
        service: 'e64d7719-0bd9-65df-55a9-f08d328bc467',
        communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
        were_countries_discussed: 'yes',
        kind: 'interaction',
        event: null,
        export_countries: [
          {
            country: '6e6a9ab2-5d95-e211-a939-e4115bead28a',
            status: 'currently_exporting',
          },
          {
            country: 'a05f66a0-5d95-e211-a939-e4115bead28a',
            status: 'future_interest',
          },
          {
            country: '83756b9a-5d95-e211-a939-e4115bead28a',
            status: 'not_interested',
          },
        ],
        helped_remove_export_barrier: true,
        export_barrier_types: ['8ef83315-2b0f-4d5e-98da-a16f8b2217a6'], // Other
        export_barrier_notes: 'My export barrier notes',
      },
      (xhr) => {
        cy.location('pathname').should(
          'eq',
          urls.companies.referrals.interactions.detail(
            referral.company.id,
            referral.id,
            xhr.response.body.id
          )
        )
      }
    )
  })
})

describe('Adding an interaction from a contact', () => {
  const contact = fixtures.contact.deanCox

  it('should be able to create an interaction from a contact', () => {
    cy.visit(urls.contacts.details(contact.id))

    cy.contains(/^\s*Add interaction\s*$/).click()
    cy.contains(/^\s*Export\s*$/).click()
    cy.contains(/^\s*A standard interaction\s*$/).click()
    cy.contains(/^\s*Continue\s*$/).click()

    cy.contains('h1', 'Add interaction')
    cy.contains('button', 'Add interaction')
  })
})

describe('Adding an interaction from an investment project', () => {
  const investmentProject = fixtures.investment.newHotelFdi

  it('should be able to create an interaction from investment project', () => {
    cy.visit(urls.investments.projects.interactions.index(investmentProject.id))

    cy.contains('Add interaction').click()
    cy.contains('h1', 'Add interaction')
    cy.contains('button', 'Add interaction')
  })
})

describe('Filtering services based on theme & kind', () => {
  beforeEach(() => {
    cy.visit(urls.companies.interactions.create(fixtures.company.dnbCorp))
  })
  it('should show filtered services for Export => Interaction', () => {
    selectInteractionType('Export', 'A standard interaction')
    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account management',
        'DBT export service or funding',
        'Enquiry or referral',
        'Export advice and information',
        'Export introductions',
        'Export win',
      ].join('')
    )
  })

  it('should show filtered services for Export => Service delivery', () => {
    selectInteractionType('Export', 'A service you have provided')
    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account management',
        'DBT export service or funding',
        'Events',
        'Export win',
      ].join('')
    )
  })

  it('should show filtered services for Investment', () => {
    selectInteractionType('Investment')
    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account management',
        'Enquiry received',
        'IST service',
        'Investment advice and information',
        'Investment introductions',
      ].join('')
    )
  })

  it('should show filtered services for Trade Agreement', () => {
    selectInteractionType('Trade agreement')
    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account management',
        'Enquiry or referral',
        'Events',
        'Other advice and information',
        'Other introductions',
        'Specific service',
        'Trade agreement implementation activity',
      ].join('')
    )
  })

  it('should show filtered services for Other => Interaction', () => {
    selectInteractionType('Other', 'A standard interaction')
    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account management',
        'Enquiry or referral',
        'Other advice and information',
        'Other introductions',
        'Specific service',
      ].join('')
    )
  })

  it('should show filtered services for Other => Service delivery', () => {
    selectInteractionType('Other', 'A service you have provided')

    cy.get('#field-service').should(
      'have.text',
      [
        '-- Select service --',
        'Account management',
        'Events',
        'Specific service',
      ].join('')
    )
  })
})

describe('Editing an interaction without a theme', () => {
  it('should set a default theme (Other)', () => {
    cy.visit(urls.interactions.edit(interactionWithoutTheme.id))

    cy.get('#field-subject').then((element) =>
      assertFieldInput({
        element,
        label: 'Summary',
        value: interactionWithoutTheme.subject,
      })
    )

    cy.contains('button', 'Save interaction').click()
    cy.get('[data-test="status-message"]').should(
      'have.text',
      'Interaction updated'
    )
  })
})

describe('Editing an interaction related to were countries disscussed', () => {
  context('when editing interaction with countries discussed', () => {
    before(() => {
      cy.visit(
        urls.interactions.edit(fixtures.interaction.withExportCountries.id)
      )
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/interaction/${fixtures.interaction.withExportCountries.id}`
      ).as('apiRequest_1')
    })
    it('should changed values from were any countries discussed if user select from yes to no', () => {
      cy.contains(ELEMENT_COUNTRIES.legend).next().find('input').check('no')
      cy.contains('button', 'Save interaction').click()
      cy.wait('@apiRequest_1').then(({ request }) => {
        expect(request.body.were_countries_discussed).to.equal('no')
        expect(request.body.export_countries).to.deep.equal([])
      })
    })
  })

  context('when editing interaction with no countries discussed', () => {
    const exportCountries = [
      {
        country: '82756b9a-5d95-e211-a939-e4115bead28a',
        status: 'currently_exporting',
      },
      {
        country: '83756b9a-5d95-e211-a939-e4115bead28a',
        status: 'future_interest',
      },
      {
        country: 'a65f66a0-5d95-e211-a939-e4115bead28a',
        status: 'not_interested',
      },
    ]
    before(() => {
      cy.visit(
        urls.interactions.edit(fixtures.interaction.withoutExportCountries.id)
      )
      cy.intercept(
        'PATCH',
        `/api-proxy/v4/interaction/${fixtures.interaction.withoutExportCountries.id}`
      ).as('apiRequest_2')
    })
    it('should changed values of were any countries discussed and save related export countries', () => {
      cy.contains(ELEMENT_COUNTRIES.legend).next().find('input').check('yes')
      cy.get(selectors.interactionForm.countries.export).selectTypeaheadOption(
        'Fran'
      )
      cy.get(selectors.interactionForm.countries.future).selectTypeaheadOption(
        'Germ'
      )
      cy.get(
        selectors.interactionForm.countries.noInterest
      ).selectTypeaheadOption('Rus')
      cy.contains('button', 'Save interaction').click()
      cy.wait('@apiRequest_2').then(({ request }) => {
        expect(request.body.were_countries_discussed).to.equal('yes')
        expect(request.body.export_countries).to.deep.equal(exportCountries)
      })
    })
  })
})

describe('Interaction landing page error checking', () => {
  beforeEach(() => {
    cy.visit(urls.companies.interactions.create(company.id))
  })
  it('should display an error when no interaction types are selected', () => {
    cy.contains('button', 'Continue').click()

    assertFieldError(
      cy.get('[data-test="field-theme"]'),
      'Select interaction type'
    )
  })

  it('should display an error when no export interaction types are selected', () => {
    cy.contains('label', 'Export').click()
    cy.contains('button', 'Continue').click()

    assertFieldError(
      cy.get('[data-test="field-kind"]'),
      'Select interaction type'
    )
  })

  it('should display an error when no other interaction types are selected', () => {
    cy.contains('label', 'Other').click()
    cy.contains('button', 'Continue').click()

    assertFieldError(
      cy.get('[data-test="field-kind"]'),
      'Select interaction type'
    )
  })
})
