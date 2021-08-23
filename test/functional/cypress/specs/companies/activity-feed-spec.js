const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

const assertTable = (selector, tableContents) => {
  tableContents.forEach((row, index) => {
    cy.get(`${selector} table tr:nth-child(${index + 1}) th`).should(
      'have.text',
      row.th
    )
  })
}

describe('Company activity feed', () => {
  context('when viewing Venus Ltd which has no activities', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.venusLtd.id))
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Activities - Venus Ltd - Companies - DIT Data Hub'
      )
    })

    it('should display the activity header', () => {
      cy.get(selectors.companyCollection().heading).should(
        'have.text',
        'Activities'
      )
    })

    it('should display "Add interaction" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .interaction.addButton(fixtures.company.venusLtd.id)
      ).should('have.text', 'Add interaction')
    })

    it('should display "Refer this company" button', () => {
      cy.get(
        selectors
          .companyCollection()
          .interaction.referButton(fixtures.company.venusLtd.id)
      ).should('have.text', 'Refer this company')
    })

    it('should not display the activity feed', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).should('not.exist')
    })

    it('should display the "There are no activities to show." message', () => {
      cy.get(selectors.companyActivity.activityFeed.noActivites).should(
        'be.visible'
      )
    })
  })

  context('when viewing activity feed for an archived company', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.archivedLtd.id))
    })

    it('should display the badge', () => {
      cy.get(companyLocalHeader.badge).first().should('have.text', 'Global HQ')
    })

    it('should display the One List tier', () => {
      const expected =
        'This is an account managed company (One List Tier A - Strategic Account)'
      cy.get(companyLocalHeader.description.paragraph(1)).should(
        'have.text',
        expected
      )
    })

    it('should display the Global Account Manager', () => {
      const expected = 'Global Account Manager: Travis Greene View core team'
      cy.get(companyLocalHeader.description.paragraph(2)).should(
        'have.text',
        expected
      )
    })

    it('should not display the "Add interaction" button', () => {
      cy.contains('Add interaction').should('not.exist')
    })

    it('should not display "Refer this company" button', () => {
      cy.contains('Refer this company').should('not.exist')
    })

    it('should display the activity feed', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).should(
        'be.visible'
      )
    })

    it('should not display the "There are no activities to show." message', () => {
      cy.get(selectors.companyActivity.activityFeed.noActivites).should(
        'not.exist'
      )
    })
  })

  context('when company has a DUNS number (is matched)', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.dnbCorp.id))
    })

    it('should not display the prompt for company matching', () => {
      cy.contains(
        'Business details on this company record have not been verified and could be wrong.'
      ).should('not.exist')
    })
  })

  context('when company does NOT have a DUNS number (is NOT matched)', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.lambdaPlc.id))
    })

    it('should display the prompt for company matching', () => {
      cy.contains(
        'Business details on this company record have not been verified and could be wrong.'
      )
        .parent()
        .next()
        .should('match', 'details')
        .should(
          'have.text',
          'Why verify?Using verified business details from a trusted third-party supplier' +
            ' means we can keep certain information up to date automatically. This' +
            ' helps reduce duplicate records, provide a shared view of complex' +
            ' companies and make it more likely we can link other data sources' +
            ' together.Verification can often be done in just 4 clicks.'
        )
        .next()
        .should('have.text', 'Verify business details')
        .should(
          'have.attr',
          'href',
          urls.companies.match.index(fixtures.company.lambdaPlc.id)
        )
    })

    it('should have the Analytics id', () => {
      cy.get('#ga-company-details-matching-prompt').should('exist')
    })

    it('should not display the pending D&B investigation message', () => {
      cy.get(selectors.companyActivity.pendingDnbInvestigationMessage).should(
        'not.exist'
      )
    })
  })

  context('when company is pending D&B investigation', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.investigationLimited.id)
      )
    })

    it('should not display the prompt for company matching', () => {
      cy.contains(
        'There might be wrong information on this company page because' +
          " it doesn't get updated automatically."
      ).should('not.exist')
    })

    it('should display the pending D&B investigation message', () => {
      cy.get(selectors.companyActivity.pendingDnbInvestigationMessage).should(
        'be.visible'
      )
    })
  })

  context('when viewing an export enquiry in the activity feed', () => {
    before(() => {
      cy.visit(
        urls.companies.activity.index(fixtures.company.externalActivitiesLtd.id)
      )
      cy.get('[data-test="activity-feed"] select').select('externalActivity')
      cy.get(selectors.companyActivity.activityFeed.item(1)).as('exportEnquiry')
    })
    it('should display an export enquiry with truncated comment', () => {
      const exportEnquiry = [
        {
          th: 'Comment',
          td: 'We export fish products to South Korea. In 2011 we were issued an approved exporter authorisation number by HMRC to be able to export to South Korea. Does this number still stand for exporting to South Korea in 2021 or do we need a new number? Lorem... Read More',
        },
        {
          th: 'Name',
          td: 'Gary James',
        },
        {
          th: 'Position',
          td: 'Director',
        },
        {
          th: 'Email',
          td: 'gary.james@fish.com',
        },
      ]
      cy.get('@exportEnquiry').find('h3').should('have.text', 'Great.gov.uk')
      cy.get('@exportEnquiry')
        .find('ul')
        .should('have.text', '10 Nov 2020GREAT.GOV.UK')
      cy.get('@exportEnquiry')
        .find('details summary')
        .should(
          'have.text',
          'View key details for this enquiry on great.gov.uk, sent on 10 Nov 2020'
        )
        .click()
      assertTable(selectors.companyActivity.activityFeed.item(1), exportEnquiry)
    })
    it('should be able to read the full comment', () => {
      cy.get(selectors.companyActivity.activityFeed.item(1)).as('exportEnquiry')
      cy.get('@exportEnquiry').find('table tr:nth-child(1) td button').click()
      cy.get('@exportEnquiry')
        .find('table tr:nth-child(1) td')
        .should(
          'have.text',
          'We export fish products to South Korea. In 2011 we were issued an approved exporter authorisation number by HMRC to be able to export to South Korea. Does this number still stand for exporting to South Korea in 2021 or do we need a new number? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Show Less'
        )
    })
  })

  context('when viewing a Maxemail campaign in the Activity Feed', () => {
    before(() => {
      const companyId = fixtures.company.externalActivitiesLtd.id
      const url = urls.companies.activity.index(companyId)

      cy.visit(url)
        .get('[data-test="activity-feed"] select')
        .select('externalActivity')
    })

    it('should show campaign heading, email subject and date', () => {
      cy.get(selectors.companyActivity.activityFeed.item(2)).as(
        'maxemailCampaign'
      )

      cy.get('@maxemailCampaign')
        .find('h3')
        .eq(0)
        .should('have.text', 'Email Campaign')

      cy.get('@maxemailCampaign')
        .find('h3')
        .eq(1)
        .should('have.text', 'British Business Network Update - December 2020')

      cy.get('@maxemailCampaign')
        .find('ul')
        .first()
        .should('have.text', '15 Dec 2020')
    })

    it('should summarize the details of the campaign', () => {
      cy.get(selectors.companyActivity.activityFeed.item(2)).as(
        'maxemailCampaign'
      )

      cy.get('@maxemailCampaign')
        .find('details summary')
        .should(
          'have.text',
          'View details of this campaign British Business Network Update - December 2020'
        )
        .click()

      assertTable(selectors.companyActivity.activityFeed.item(2), [
        {
          th: 'Senders name',
          td: 'Susannah Howen',
        },
        {
          th: 'Senders email',
          td: 'anz.newsletter@email.trade.gov.uk',
        },
        {
          th: 'Content',
          td: 'All the latest updates from around the BBN',
        },
      ])
    })

    it('should show a list of campaign email recipients', () => {
      cy.get(selectors.companyActivity.activityFeed.item(2)).as(
        'maxemailCampaign'
      )

      cy.get('@maxemailCampaign')
        .find('table tbody tr')
        .last()
        .find('th')
        .should('have.text', 'Recipients')

      const recipients = [
        {
          text: 'Max Speed',
          href: '/contacts/9136dd49-df67-4b2b-b241-6b64a662f1af/details',
        },
        {
          text: 'Max Weight',
          href: '/contacts/236f8b6c-afac-4fba-a8eb-5739aa14823a/details',
        },
        {
          text: 'Max Height',
          href: '/contacts/335369fc-b010-4730-97aa-10e66315b821/details',
        },
      ]

      recipients.forEach((recipient, index) => {
        cy.get('@maxemailCampaign')
          .find('a')
          .eq(index)
          .should('have.text', recipient.text)
          .and('have.attr', 'href', recipient.href)
      })
    })
  })
})
