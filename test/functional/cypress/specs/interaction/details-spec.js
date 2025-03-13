const fixtures = require('../../fixtures')
const largeCapitalOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const selectors = require('../../../../selectors')
const {
  assertSummaryTable,
  assertBreadcrumbs,
  assertFieldRadios,
  assertErrorSummary,
  assertFieldDate,
  assertFlashMessage,
  assertLinkWithText,
} = require('../../support/assertions')
const {
  interactions,
  companies,
  investments,
  contacts,
  events,
  tasks,
} = require('../../../../../src/lib/urls')

const {
  interaction: { withReferral: interactionWithReferral },
} = fixtures

const companyObject = {
  href: companies.overview.index(fixtures.company.venusLtd.id),
  name: fixtures.company.venusLtd.name,
}

const contactObjectTheodore = {
  href: contacts.details('71906039-858e-47ba-8016-f3c80da69ace'),
  name: 'Theodore Schaden|6e4b048d-5bb5-4868-9455-aa712f4ceffd',
}

describe('Interaction details', () => {
  context('Past draft interaction', () => {
    const params = {}

    beforeEach(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.draftPastMeeting.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )
    })

    assertInteractionBreadcrumbs()
    assertHeader(fixtures.interaction.draftPastMeeting.subject)

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': contactObjectTheodore,
          'Date of interaction': '20 May 2019',
          'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
        },
      })
    })

    it('should render the "Complete interaction" button', () => {
      cy.get('[data-test=complete-interaction-button]')
        .should('be.visible')
        .should('have.text', 'Complete interaction')
        .should(
          'have.attr',
          'href',
          companies.interactions.edit(params.companyId, params.interactionId)
        )
    })

    assertEditButtonNotVisible()
    assertCannotCompleteTextNotVisible()
    assertAddFollowUpTaskVisible(fixtures.interaction.draftPastMeeting.id)

    context('when cancelling the interaction', () => {
      it('should render the archive container', () => {
        cy.get('[data-test=archive-interaction-container]').should('exist')
        cy.get('[data-test=archive-button')
          .should('be.visible')
          .should('have.text', 'Cancel')
        cy.get('[data-test=archive-header]')
          .should('be.visible')
          .should('have.text', 'Cancel interaction')
        cy.get('[data-test=archive-hint]')
          .should('be.visible')
          .should(
            'have.text',
            'Cancel this interaction if the meeting did not happen'
          )
        cy.get('[data-test=field-archived_reason]').should('not.exist')
      })

      it('should render the archive reasons', () => {
        cy.get('[data-test="archive-button"]').click()
        cy.get('[data-test=field-archived_reason]')
          .should('exist')
          .then((element) => {
            assertFieldRadios({
              element,
              label: 'Cancellation reason',
              optionsCount: 3,
            })
          })
      })

      it('should not submit if no reason is selected', () => {
        cy.get('[data-test="archive-button"]').click()
        cy.get('[data-test=submit-button]').click()
        assertErrorSummary(['You must select a reason'])
      })

      it('should render the date field when reschedule is selected', () => {
        cy.get('[data-test="archive-button"]').click()
        cy.get('[data-test=archived-reason-meeting-was-rescheduled]').click()
        cy.get('[data-test="field-date"]')
          .should('exist')
          .then((element) => {
            assertFieldDate({
              element,
              label: 'When will the meeting take place?',
              hint: 'This will change the date of the interaction rather than cancelling it.',
              value: { day: '', month: '', year: '' },
            })
          })
      })

      it('should not submit if reschedule is selected and no date is entered', () => {
        cy.get('[data-test="archive-button"]').click()
        cy.get('[data-test=archived-reason-meeting-was-rescheduled]').click()
        cy.get('[data-test=submit-button]').click()
        assertErrorSummary(['You must enter a valid date'])
      })

      it('should submit the form if a reason is seleted', () => {
        cy.get('[data-test="archive-button"]').click()
        cy.get('[data-test=archived-reason-client-cancelled]').click()
        cy.get('[data-test=submit-button]').click()
        assertFlashMessage('The interaction has been updated')
      })
    })
  })

  context('Future draft interaction', () => {
    const params = {}

    beforeEach(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.draftFutureMeeting.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )
    })

    assertInteractionBreadcrumbs()
    assertHeader(fixtures.interaction.draftFutureMeeting.subject)

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': contactObjectTheodore,
          'Date of interaction': '20 May 2030',
          'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
        },
      })
    })

    assertCompleteButtonNotVisible()
    assertEditButtonNotVisible()
    assertAddFollowUpTaskVisible(fixtures.interaction.draftFutureMeeting.id)

    it('should render the "Why can I not complete this interaction?" details summary', () => {
      cy.get('[data-test=cannot-complete-interaction]').should('be.visible')
    })
  })

  context('Cancelled interaction', () => {
    const params = {}

    beforeEach(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.cancelledMeeting.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )
    })

    assertInteractionBreadcrumbs()
    assertHeader(fixtures.interaction.cancelledMeeting.subject)

    it('should render the archive panel', () => {
      cy.get('[data-test=archive-panel]').should('exist')
      cy.get('[data-test=archive-message]')
        .should('be.visible')
        .should(
          'have.text',
          'This interaction was cancelled on 12 Jun 2019 by Lee Wilson.'
        )
      cy.get('[data-test=archive-reason]')
        .should('be.visible')
        .should('have.text', 'Reason: Client cancelled')
      cy.get('[data-test=unarchive-link]').should('not.exist')
    })

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': {
            href: contacts.details('e2eee6cd-acf6-454a-a4a8-f6c8fa604fde'),
            name: 'Tyson Morar',
          },
          'Date of interaction': '11 June 2019',
          'Adviser(s)': 'Brendan Smith, Digital Data Hub - Live Service',
        },
      })
    })

    assertCompleteButtonNotVisible()
    assertEditButtonNotVisible()
    assertCannotCompleteTextNotVisible()
    assertAddFollowUpTaskVisible(fixtures.interaction.cancelledMeeting.id)
  })

  context('Complete service delivery', () => {
    const params = {}

    beforeEach(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.withLink.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )
    })

    assertInteractionBreadcrumbs('Service delivery')

    assertHeader(fixtures.interaction.withLink.subject)

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': {
            href: contacts.details('9b1138ab-ec7b-497f-b8c3-27fed21694ef'),
            name: 'Johnny Cakeman',
          },
          Service: 'Events - UK based',
          Notes: 'This is a dummy service delivery for testing',
          'Date of service delivery': '5 September 2017',
          Event: {
            href: events.details('bda12a57-433c-4a0c-a7ce-5ebd080e09e8'),
            name: 'Grand exhibition',
          },
        },
      })
    })

    assertCompleteButtonNotVisible()
    assertAddFollowUpTaskVisible(fixtures.interaction.withLink.id)

    it('should render the "Edit interaction" button', () => {
      cy.get('[data-test=edit-interaction-button]')
        .should('be.visible')
        .should('have.text', 'Edit service delivery')
    })

    assertCannotCompleteTextNotVisible()
  })

  context('Interaction for a stova event', () => {
    const params = {}

    beforeEach(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.withStovaEvent.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )
    })

    it('should have a stova url for stova events', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': {
            href: contacts.details('9b1138ab-ec7b-497f-b8c3-27fed21694ef'),
            name: 'Johnny Cakeman',
          },
          Service: 'Events - UK based',
          Notes: 'This is a dummy service delivery for testing',
          'Date of service delivery': '5 September 2017',
          Event: {
            href: events.stova.details('22cf10ad-0af6-487b-b7a2-325a8830a009'),
            name: 'Stova Grand exhibition',
          },
        },
      })
    })
  })
  context('Complete investment project interaction', () => {
    const params = {}

    beforeEach(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.withNoLink.id

      cy.visit(
        `/companies/${params.companyId}/interactions/${params.interactionId}`
      )
    })

    assertInteractionBreadcrumbs()
    assertHeader(fixtures.interaction.withNoLink.subject)

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': {
            href: contacts.details(fixtures.contact.deanCox.id),
            name: fixtures.contact.deanCox.name,
          },
          Service: 'UKEF - EFA Advice',
          Notes: 'This is a dummy interaction for testing',
          'Date of interaction': '5 June 2017',
          'Investment project': {
            href: investments.projects.details(
              fixtures.investment.newHotelFdi.id
            ),
            name: fixtures.investment.newHotelFdi.name,
          },
          'Communication channel': 'Email/Website',
        },
      })
    })

    assertCompleteButtonNotVisible()
    assertAddFollowUpTaskVisible(fixtures.interaction.withNoLink.id)

    it('should render the "Edit interaction" button', () => {
      cy.get('[data-test=edit-interaction-button]')
        .should('be.visible')
        .should('have.text', 'Edit interaction')
    })

    assertCannotCompleteTextNotVisible()
  })

  context('When an interaction is created from a referral', () => {
    it('should display the linked referral on the interaction detail page', () => {
      cy.visit(interactions.detail(interactionWithReferral.id))

      assertSummaryTable({
        dataTest: 'interaction-referral-table',
        heading: 'This interaction is linked to a referral',
        showEditLink: false,
        content: {
          Subject: interactionWithReferral.company_referral.subject,
          'Sent on': '14 Feb 2020',
          By: interactionWithReferral.company_referral.created_by.name,
          To: interactionWithReferral.company_referral.recipient.name,
        },
      })
    })

    it('should take you to the referral details page when you click on the subject', () => {
      cy.visit(interactions.detail(interactionWithReferral.id))
      cy.contains(interactionWithReferral.company_referral.subject).click()
      cy.url().should(
        'contain',
        companies.referrals.details(
          interactionWithReferral.companies[0].id,
          interactionWithReferral.company_referral.id
        )
      )
    })
  })
  context(
    'An interaction with investment theme and large capital opportunity',
    () => {
      beforeEach(() => {
        cy.visit(
          interactions.detail(fixtures.interaction.withInvestmentTheme.id)
        )
      })
      it('should render the details', () => {
        assertSummaryTable({
          dataTest: 'interaction-details-table',
          heading: null,
          showEditLink: false,
          content: {
            Company: companyObject,
            'Contact(s)': {
              href: contacts.details('952232d2-1d25-4c3a-bcac-2f3a30a94da9'),
              name: 'Dean Cox',
            },
            Service: 'Investment advice and information',
            Notes: 'This is a dummy interaction for testing',
            'Date of interaction': '5 June 2017',
            'Adviser(s)': 'DBT Staff, Digital Data Hub - Live Service',
            'Communication channel': 'Email/Website',
            'Related large capital opportunity': {
              href: investments.opportunities.details(
                largeCapitalOpportunity.id
              ),
              name: largeCapitalOpportunity.name,
            },
          },
        })
      })
    }
  )
  context('Interaction with export countries', () => {
    beforeEach(() => {
      cy.visit(interactions.detail(fixtures.interaction.withExportCountries.id))
    })

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': contactObjectTheodore,
          Service: 'Export win',
          'Date of interaction': '7 October 2022',
          'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
          'Communication channel': 'Letter/Fax',
          'Countries currently exporting to':
            'Afghanistan, Albania, Belgium, Belize, Benin, Bermuda, Bhutan',
          'Future countries of interest':
            'Taiwan, Tajikistan, Tanzania, Thailand, The Bahamas, The Gambia, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Turks and Caicos Islands, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom',
          'Countries not interested in':
            'United States, United States Virgin Islands, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe',
          'Helped remove an export barrier': 'Yes',
          'Export barrier category': 'Other',
          'Export barrier - other': 'My export barrier notes...',
        },
      })
    })
  })

  context('Interaction with business intelligence and UKTP fields', () => {
    beforeEach(() => {
      cy.visit(interactions.detail(fixtures.interaction.withBusIntel.id))
    })

    it('should render the details', () => {
      assertSummaryTable({
        dataTest: 'interaction-details-table',
        heading: null,
        showEditLink: false,
        content: {
          Company: companyObject,
          'Contact(s)': contactObjectTheodore,
          Service: 'UK Tradeshow Programme (UKTP) – exhibitor',
          'Service status': 'Completed',
          'Grant offered': '£1',
          'Net receipt': '£2',
          'Date of service delivery': '22 April 2022',
          'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
          Event: 'No',
          'Business intelligence':
            'Any comments the company made to you on areas such as issues impacting them or feedback on government policy. This information will be visible to other Data Hub users, the Business Intelligence Unit and may also be shared within DBT.',
          'Named trade agreement(s)':
            'EU-UK Trade Co-operation Agreement, Free Trade Agreements: Gulf Cooperation Council (GCC), Test agreement, UK-Iceland, Liechtenstein and Norway Free Trade Agreement, UK-Singapore Digital Economy Agreement',
          'Helped remove an export barrier': 'No',
        },
      })
    })
  })
})

function assertInteractionBreadcrumbs(kind = 'Interaction') {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: companies.index(),
      [kind]: null,
    })
  })
}

function assertHeader(heading) {
  it('should render the heading', () => {
    cy.get(selectors.localHeader().heading).should('have.text', heading)
  })
}

function assertCompleteButtonNotVisible() {
  it('should not render the "Complete interaction" button', () => {
    cy.get('[data-test=complete-interaction-button]').should('not.exist')
  })
}

function assertEditButtonNotVisible() {
  it('should not render the "Edit interaction" button', () => {
    cy.get('[data-test=edit-interaction-button]').should('not.exist')
  })
}

function assertCannotCompleteTextNotVisible() {
  it('should not render the "Why can I not complete this interaction?" details summary', () => {
    cy.get('[data-test=cannot-complete-interaction]').should('not.exist')
  })
}

function assertAddFollowUpTaskVisible(interactionId) {
  it('should render an Add follow up task button with expected url', () => {
    assertLinkWithText(
      'add-follow-up-task-button',
      tasks.createInteraction(interactionId),
      'Add follow up task'
    )
  })
}
