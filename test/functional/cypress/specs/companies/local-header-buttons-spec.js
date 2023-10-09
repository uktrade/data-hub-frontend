const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.dnbCorp.id
const exportProjectUrl = urls.exportPipeline.create(companyId)
const addInteractionUrl = urls.companies.interactions.create(companyId)
const referralsUrl = urls.companies.referrals.send(companyId)
const addRemoveFromListUrl = urls.companies.lists.addRemove(companyId)
const detailsUrl = urls.companies.detail(companyId)

describe('Local header buttons', () => {
  context('when the add export project button is clicked', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(companyId))
    })

    it('should have the add export project link', () => {
      cy.get('[data-test="header-add-export-project"]').should(
        'have.attr',
        'href',
        exportProjectUrl
      )
    })

    it('should click the add export project link', () => {
      cy.get('[data-test=header-add-export-project]').click()
      cy.location().should((loc) => {
        expect(loc.pathname + loc.search).to.eq(exportProjectUrl)
      })
    })
  })

  context('when the add interaction button is clicked', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(companyId))
    })
    it('should have the correct add interaction link', () => {
      cy.get('[data-test="header-add-interaction"]').should(
        'have.attr',
        'href',
        addInteractionUrl
      )
    })

    it('should click the add interaction button', () => {
      cy.get('[data-test="header-add-interaction"]').click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(addInteractionUrl)
      })
    })
  })

  context('when a company is in several company lists', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(companyId))
    })

    it('should display list items', () => {
      cy.get('[data-test="list-item-list-c-button"]').contains('List C')
      cy.get('[data-test="list-item-list-c-button"]').click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(addRemoveFromListUrl)
        expect(loc.search).contains(detailsUrl)
      })
      cy.go('back')
    })
  })

  context('when a company is not in any company lists', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/company-list?items__company_id=${companyId}`,
        {
          body: { count: 0, next: null, previous: null, results: [] },
        }
      ).as('apiRequest')
      cy.visit(urls.companies.activity.index(companyId))
    })

    it('should not display any list items', () => {
      cy.get('[data-test^="list-item"]').should('not.exist')
    })
  })

  context('when the referral button is clicked', () => {
    beforeEach(() => {
      cy.visit(urls.companies.activity.index(companyId))
    })

    it('should send a referral', () => {
      cy.get('[data-test="refer-company-button"]').contains(
        'Refer this company'
      )
      cy.get('[data-test="refer-company-button"]').click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(referralsUrl)
      })
      cy.go('back')
    })
  })
})
