const { reduce, isEqual } = require('lodash')

import {
  assertFieldInput,
  assertFieldRadios,
  testBreadcrumbs,
} from '../../support/assertions'

const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const {
  assertFieldTextarea,
  assertFieldDate,
  assertFieldTypeahead,
  assertFormActions,
  assertFormFields,
} = require('../../support/assertions')

const {
  KINDS,
  THEMES,
} = require('../../../../../src/apps/interactions/constants')

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
  value: 'DIT Staff',
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

function fillCommonFields({ service, contact = 'Johnny Cakeman' }) {
  cy.contains('Service')
    .next()
    .selectTypeaheadOption(service)

  if (contact) {
    cy.contains(ELEMENT_CONTACT.label)
      .next()
      .next()
      .selectTypeaheadOption(contact)
  }

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
    .next()
    .contains(
      'These notes will be visible to other Data Hub users and may be shared within the department. Please:'
    )
    .next()
    .find('li')
    .contains('summarise relevant information - don’t copy and paste')
    .next()
    .contains('use relevant keywords and accurate tags')
    .parent('ul')
    .next()
    .contains('Read more guidance here')
    .and(
      'have.attr',
      'href',
      'https://data-services-help.trade.gov.uk/data-hub/updates/announcements/what-makes-good-policy-feedback/'
    )
    .parent('span')
    .next()
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

function submitForm(kind, theme, values) {
  cy.get('#interaction-details-form').within(() => {
    fillCommonFields(values)

    if (theme !== THEMES.INVESTMENT) {
      fillExportCountriesFields()
    }

    if (kind === KINDS.INTERACTION) {
      cy.contains(ELEMENT_COMMUNICATION_CHANNEL.label)
        .next()
        .selectTypeaheadOption('Telephone')
    } else if (kind === KINDS.SERVICE_DELIVERY) {
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
    }

    cy.contains('Add interaction').click()
  })
}

function spyOnRequest(url = '/api-proxy/v3/interaction') {
  cy.server()
  cy.route('POST', url).as('interactionHttpRequest')
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
    // eslint-disable-next-line no-console
    console.log(
      'Request body fields that differ',
      objectDiff(xhr.requestBody, expectedBody)
    )

    expect(xhr.requestBody).to.deep.equal(expectedBody)

    callback(xhr)
  })
}

const company = fixtures.company.venusLtd

describe('Interaction theme', () => {
  context('when viewing the form', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))
    })

    testBreadcrumbs({
      Home: urls.dashboard(),
      Companies: urls.companies.index(),
      [`Add interaction for ${company.name}`]: null,
    })
  })

  context('when creating an interaction', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A standard interaction').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form div'), [
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
      submitForm(KINDS.INTERACTION, THEMES.EXPORT, {
        service:
          'A Specific DIT Export Service or Funding : Tradeshow Access Programme (TAP)',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
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
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.responseBody.id)
          )
        }
      )
    })
  })
})

describe('Service delivery theme', () => {
  context('when creating a service delivery', () => {
    beforeEach(() => {
      spyOnRequest()
      cy.visit(urls.companies.interactions.create(company.id))

      cy.contains('label', 'Export').click()
      cy.contains('label', 'A service that you have provided').click()
      cy.contains('button', 'Continue').click()
    })

    it('should render all form fields', () => {
      assertFormFields(cy.get('#interaction-details-form form div'), [
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

    it('should save the service delivery', () => {
      submitForm(KINDS.SERVICE_DELIVERY, THEMES.EXPORT, {
        service:
          'A Specific DIT Export Service or Funding : Tradeshow Access Programme (TAP)',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
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
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.responseBody.id)
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
      assertFormFields(cy.get('#interaction-details-form form div'), [
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
      submitForm(KINDS.INTERACTION, THEMES.INVESTMENT, {
        service: 'Investment - Service',
      })

      assertRequestBody(
        {
          ...COMMON_REQUEST_BODY,
          theme: 'investment',
          service: '0596b92b-3499-e211-a939-e4115bead28a',
          communication_channel: '72c226d7-5d95-e211-a939-e4115bead28a',
          kind: 'interaction',
          service_answers: {},
          event: null,
          export_countries: [],
        },
        (xhr) => {
          cy.location('pathname').should(
            'eq',
            urls.companies.interactions.detail(company.id, xhr.responseBody.id)
          )
        }
      )
    })
  })
})

describe('Contact loop', () => {
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
})

describe('Adding an interaction from a referral', () => {
  const referral = fixtures.referrals.referalDetails

  it('should be able to create interaction from referral', () => {
    spyOnRequest(`/api-proxy/v4/company-referral/${referral.id}/complete`)

    cy.visit(urls.companies.referrals.details(referral.company.id, referral.id))

    cy.contains('Accept referral').click()
    cy.contains('Export').click()
    cy.contains('A standard interaction').click()
    cy.contains('Continue').click()

    submitForm(KINDS.INTERACTION, THEMES.EXPORT, {
      service: 'Referral to UKEF',
      contact: null,
    })

    assertRequestBody(
      {
        ...COMMON_REQUEST_BODY,
        company: {
          id: referral.company.id,
        },
        contacts: [referral.contact.id], // Was prepopulated
        theme: 'export',
        service: '43dd37db-325f-4cd4-9418-a62ab9c53dda',
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
      },
      (xhr) => {
        cy.location('pathname').should(
          'eq',
          urls.companies.referrals.interactions.detail(
            referral.company.id,
            referral.id,
            xhr.responseBody.id
          )
        )
      }
    )
  })
})
