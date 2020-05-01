import {
  assertFieldInput,
  assertFieldRadios,
  testBreadcrumbs,
} from '../../support/assertions'

const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const { assertFieldTextarea } = require('../../support/assertions')
const { assertFieldDate } = require('../../support/assertions')
const { assertFieldTypeahead } = require('../../support/assertions')
const { assertFormActions } = require('../../support/assertions')
const { assertFormFields } = require('../../support/assertions')

const describeBreadcrumbs = (company) => {
  testBreadcrumbs({
    Home: urls.dashboard(),
    Companies: urls.companies.index(),
    [`Add interaction for ${company.name}`]: null,
  })
}

const assertHeader = ({ element, text }) =>
  cy
    .wrap(element)
    .should('have.text', text)
    .and('match', 'h2')

const [TODAY_YEAR, TODAY_MONTH, TODAY_DAY] = new Date()
  .toISOString()
  .split('T')[0]
  .split('-')

const ELEMENT_SERVICE_HEADER = {
  text: 'Service',
  assert: assertHeader,
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
const ELEMENT_SERVICE = {
  placeholder: '-- Select service --',
  assert: assertFieldTypeahead,
}
const ELEMENT_PARTICIPANTS_HEADER = {
  text: 'Participants',
  assert: assertHeader,
}
const ELEMENT_CONTACT = {
  label: 'Contact(s)',
  placeholder: '-- Select contact --',
  assert: assertFieldTypeahead,
}
const ELEMENT_ADVISER = {
  label: 'Adviser(s)',
  value: 'DIT Staff, UKTI Team East Midlands - International Trade Team',
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
const ELEMENT_NOTES_HEADER = {
  text: 'Notes',
  assert: assertHeader,
}
const ELEMENT_SUBJECT = {
  label: 'Subject',
  assert: assertFieldInput,
}
const ELEMENT_NOTES = {
  label: 'Notes (optional)',
  assert: assertFieldTextarea,
}
const ELEMENT_FEEDBACK_POLICY = {
  label: 'Did the contact give any feedback on government policy?',
  assert: assertFieldRadios,
  optionsCount: 2,
}
const ELEMENT_POLICY_ISSUE_TYPES = {
  label: 'Policy issue types',
}
const ELEMENT_POLICY_AREAS = {
  label: 'Policy area(s)',
}
const ELEMENT_POLICY_FEEDBACK_NOTES = {
  label: 'Policy feedback notes',
}
const ELEMENT_COUNTRIES = {
  label: 'Were any countries discussed?',
  assert: assertFieldRadios,
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
  label: 'Is this an event?',
  assert: assertFieldRadios,
  optionsCount: 2,
}
const ELEMENT_EVENT_SELECTION = {
  label: 'Event',
  placeholder: '-- Select event --',
  assert: assertFieldTypeahead,
}
const ELEMENT_STEP2_BUTTONS = {
  buttons: ['Add interaction', 'Back'],
  assert: assertFormActions,
}

const COMMON_REQUEST_BODY = {
  contacts: ['9b1138ab-ec7b-497f-b8c3-27fed21694ef'],
  advisers: [
    {
      label: 'DIT Staff, UKTI Team East Midlands - International Trade Team',
      value: '7d19d407-9aec-4d06-b190-d3f404627f21',
    },
  ],
  dit_participants: [{ adviser: '7d19d407-9aec-4d06-b190-d3f404627f21' }],
  date: `${TODAY_YEAR}-${TODAY_MONTH}-${TODAY_DAY}`,
  subject: 'Some subject',
  notes: 'Some notes',
  was_policy_feedback_provided: 'yes',
  policy_issue_types: ['688ac22e-89d4-4d1f-bf0b-013588bf63a7'],
  policy_areas: ['583c0bb6-d3c5-4e4b-8f25-e861c1e8d9c9'],
  policy_feedback_notes: 'Some policy feedback notes',
  company: { id: '0f5216e0-849f-11e6-ae22-56b6b6499611' },
  service_answers: {},
  status: 'complete',
}

function fillCommonFields(service) {
  cy.contains('Service')
    .next()
    .selectTypeaheadOption(service)

  cy.contains(ELEMENT_CONTACT.label)
    .next()
    .next()
    .selectTypeaheadOption('Johnny Cakeman')

  cy.contains(ELEMENT_SUBJECT.label)
    .next()
    .find('input')
    .type('Some subject')

  cy.contains(ELEMENT_NOTES.label)
    .next()
    .find('textarea')
    .type('Some notes')

  cy.contains(ELEMENT_FEEDBACK_POLICY.label)
    .next()
    .find('input')
    .check('yes')

  cy.contains(ELEMENT_POLICY_ISSUE_TYPES.label)
    .next()
    .contains('Domestic')
    .click()

  cy.contains(ELEMENT_POLICY_AREAS.label)
    .next()
    .selectTypeaheadOption('State Aid')

  cy.contains(ELEMENT_POLICY_FEEDBACK_NOTES.label)
    .parent()
    .find('textarea')
    .type('Some policy feedback notes')
}

function fillExportCountriesFields() {
  cy.contains(ELEMENT_COUNTRIES.label)
    .next()
    .find('input')
    .check('yes')

  cy.contains(ELEMENT_COUNTRIES_CURRENTLY_EXPORTING.label)
    .parent()
    .selectTypeaheadOption('Iceland')

  cy.contains(ELEMENT_COUNTRIES_FUTURE_INTEREST.label)
    .parent()
    .selectTypeaheadOption('Austria')

  cy.contains(ELEMENT_COUNTRIES_NOT_INTERESTED.label)
    .parent()
    .selectTypeaheadOption('Germany')
}

describe('Add interaction form', () => {
  const company = fixtures.company.venusLtd

  context('when a contact does not exists and user wants to add one', () => {
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
      cy.contains(ELEMENT_SUBJECT.label)
        .next()
        .find('input')
        .type('Test if values is restored')

      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.companies.interactions.create(company.id)
      )

      cy.contains('div', 'First name')
        .find('input')
        .type('John')
      cy.contains('div', 'Last name')
        .find('input')
        .type('Doe')
      cy.contains('div', 'Job title')
        .find('input')
        .type('Full-stack dev')
      cy.contains('fieldset', 'Is this person a primary contact?')
        .contains('label', 'Yes')
        .click()
      cy.contains('div', 'Telephone country code')
        .find('input')
        .type('+44')
      cy.contains('div', 'Telephone number')
        .find('input')
        .type('123 567 789')
      cy.contains('div', 'Email')
        .find('input')
        .type('john@example.com')
      cy.contains(
        'fieldset',
        'Is the contact’s address the same as the company address?'
      )
        .contains('label', 'Yes')
        .click()
      cy.contains('button', 'Add contact').click()

      cy.url().should('include', urls.companies.interactions.create(company.id))

      cy.contains(ELEMENT_SUBJECT.label)
        .next()
        .find('input')
        .should('have.attr', 'value', 'Test if values is restored')

      cy.get('.c-message--success').should(
        'contain',
        'You added Json Russel.You can now continue recording the interaction.'
      )
    })
  })

  context('when viewing the form', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/api-proxy/v3/interaction').as(
        'createInteractionRequest'
      )
      cy.visit(urls.companies.interactions.create(company.id))
    })

    describeBreadcrumbs(company)

    it('should render radios with interaction type on the first step', () => {
      assertFormFields(cy.get('#add-interaction-form form div'), [
        {
          label: 'What is this regarding?',
          assert: assertFieldRadios,
          optionsCount: 3,
        },
        {
          buttons: ['Continue'],
          assert: assertFormActions,
        },
      ])
    })
  })

  context('when creating an interaction', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/api-proxy/v3/interaction').as(
        'createInteractionRequest'
      )
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A standard interaction').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#add-interaction-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Select at least one contact',
            'Select a communication channel',
            'Enter a subject',
            'Answer if the contact gave any feedback on government policy',
            'Answer if any of the countries were discussed',
          ].join('')
        )
    })

    it('should save the interaction', () => {
      cy.get('#add-interaction-form').within(() => {
        fillCommonFields(
          'A Specific DIT Export Service or Funding : Tradeshow Access Programme (TAP)'
        )
        fillExportCountriesFields()

        cy.contains(ELEMENT_COMMUNICATION_CHANNEL.label)
          .next()
          .selectTypeaheadOption('Telephone')

        cy.contains('Add interaction').click()
      })

      cy.wait('@createInteractionRequest').then((xhr) => {
        expect(xhr.requestBody).to.deep.equal({
          ...COMMON_REQUEST_BODY,
          theme: 'export',
          service: '380bba2b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          were_countries_discussed: 'yes',
          currently_exporting: [
            { value: '6e6a9ab2-5d95-e211-a939-e4115bead28a', label: 'Iceland' },
          ],
          future_interest: [
            { value: 'a05f66a0-5d95-e211-a939-e4115bead28a', label: 'Austria' },
          ],
          not_interested: [
            { value: '83756b9a-5d95-e211-a939-e4115bead28a', label: 'Germany' },
          ],
          status: 'complete',
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
        })

        cy.location('pathname').should(
          'eq',
          urls.companies.interactions.detail(company.id, xhr.responseBody.id)
        )
      })
    })
  })

  context('when creating a service delivery', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/api-proxy/v3/interaction').as(
        'createInteractionRequest'
      )
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A service that you have provided').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#add-interaction-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_IS_EVENT,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_COUNTRIES,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Select at least one contact',
            'Answer if this was an event',
            'Enter a subject',
            'Answer if the contact gave any feedback on government policy',
            'Answer if any of the countries were discussed',
          ].join('')
        )
    })

    it('should save the interaction', () => {
      cy.get('#add-interaction-form').within(() => {
        fillCommonFields(
          'A Specific DIT Export Service or Funding : Tradeshow Access Programme (TAP)'
        )
        fillExportCountriesFields()

        cy.contains(ELEMENT_SERVICE_STATUS.label)
          .next()
          .find('select')
          .select('Completed')

        cy.contains(ELEMENT_SERVICE_GRANT_OFFERED.label)
          .next()
          .find('input')
          .type('123')

        cy.contains(ELEMENT_SERVICE_NET_RECEIPT.label)
          .next()
          .find('input')
          .type('456')

        cy.contains(ELEMENT_IS_EVENT.label)
          .next()
          .find('input')
          .check('yes')

        cy.contains(ELEMENT_EVENT_SELECTION.label)
          .next()
          .selectTypeaheadOption('Sort event')

        cy.contains('Add interaction').click()
      })

      cy.wait('@createInteractionRequest').then((xhr) => {
        expect(xhr.requestBody).to.deep.equal({
          ...COMMON_REQUEST_BODY,
          theme: 'export',
          service: '380bba2b-3499-e211-a939-e4115bead28a',
          is_event: 'yes',
          were_countries_discussed: 'yes',
          service_delivery_status: '47329c18-6095-e211-a939-e4115bead28a',
          grant_amount_offered: '123',
          currently_exporting: [
            { value: '6e6a9ab2-5d95-e211-a939-e4115bead28a', label: 'Iceland' },
          ],
          future_interest: [
            { value: 'a05f66a0-5d95-e211-a939-e4115bead28a', label: 'Austria' },
          ],
          not_interested: [
            { value: '83756b9a-5d95-e211-a939-e4115bead28a', label: 'Germany' },
          ],
          net_company_receipt: '456',
          event: '0010f189-9331-4916-818a-231bf2f4882b',
          status: 'complete',
          kind: 'service-delivery',
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
        })

        cy.location('pathname').should(
          'eq',
          urls.companies.interactions.detail(company.id, xhr.responseBody.id)
        )
      })
    })
  })

  context('when creating an interaction regarding investment', () => {
    beforeEach(() => {
      cy.server()
      cy.route('POST', '/api-proxy/v3/interaction').as(
        'createInteractionRequest'
      )
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Investment').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#add-interaction-form form div'), [
        ELEMENT_SERVICE_HEADER,
        ELEMENT_SERVICE,
        ELEMENT_PARTICIPANTS_HEADER,
        ELEMENT_CONTACT,
        ELEMENT_ADVISER,
        ELEMENT_DETAILS_HEADER,
        ELEMENT_DATE,
        ELEMENT_COMMUNICATION_CHANNEL,
        ELEMENT_NOTES_HEADER,
        ELEMENT_SUBJECT,
        ELEMENT_NOTES,
        ELEMENT_FEEDBACK_POLICY,
        ELEMENT_STEP2_BUTTONS,
      ])
    })

    it('should validate the form', () => {
      cy.contains('button', 'Add interaction').click()
      cy.contains('h2', 'There is a problem')
        .next()
        .should(
          'have.text',
          [
            'Select a service',
            'Select at least one contact',
            'Select a communication channel',
            'Enter a subject',
            'Answer if the contact gave any feedback on government policy',
          ].join('')
        )
    })

    it('should save the interaction', () => {
      cy.get('#add-interaction-form').within(() => {
        fillCommonFields('Investment - Service')

        cy.contains(ELEMENT_COMMUNICATION_CHANNEL.label)
          .next()
          .selectTypeaheadOption('Telephone')

        cy.contains('button', 'Add interaction').click()
      })

      cy.wait('@createInteractionRequest').then((xhr) => {
        expect(xhr.requestBody).to.deep.equal({
          ...COMMON_REQUEST_BODY,
          theme: 'investment',
          service: '0596b92b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          status: 'complete',
          kind: 'interaction',
          service_answers: {},
          event: null,
          export_countries: [],
        })

        cy.location('pathname').should(
          'eq',
          urls.companies.interactions.detail(company.id, xhr.responseBody.id)
        )
      })
    })
  })
})
