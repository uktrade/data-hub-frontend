const { NumberUtils } = require('data-hub-components')

const urls = require('../../../../../src/lib/urls')
const leads = require('../../../../sandbox/fixtures/v4/pipeline-item/leads.json')
const inProgress = require('../../../../sandbox/fixtures/v4/pipeline-item/in-progress.json')
const win = require('../../../../sandbox/fixtures/v4/pipeline-item/win.json')
const LIKELIHOOD_TO_SUCCEED = require('../../../../../src/client/components/Pipeline/constants')

function assertPipelineItem(
  index,
  { expectedDate, expectedWinDate },
  givenData
) {
  const result = givenData.results[index]
  if (!result) {
    throw Error('Given data is out of range')
  }
  cy.get('[data-auto-id="pipelineSubTabNav"]')
    .get(`ol > li:nth-child(${index + 1})`)
    .within(() => {
      cy.contains(result.name)
      cy.contains(result.company.name).should(
        'have.attr',
        'href',
        urls.companies.detail(result.company.id)
      )
      cy.contains(expectedDate)
      cy.contains('Edit').should(
        'have.attr',
        'href',
        urls.pipeline.edit(result.id)
      )
      if (result.likelihood_to_win) {
        cy.get('span[aria-label="Likelihood to succeed"]').should('exist')
        cy.contains(LIKELIHOOD_TO_SUCCEED[result.likelihood_to_win].text)
      } else {
        const values = Object.values(LIKELIHOOD_TO_SUCCEED).map(
          (item) => item.text
        )
        const regex = new RegExp(`${values.join('|')}`, 'g')
        cy.get('span[aria-label="Likelihood to succeed"]').should('not.exist')
        cy.contains(regex).should('not.exist')
      }

      if (result.expected_win_date) {
        cy.contains('Expected date for win')
        cy.contains(expectedWinDate)
      } else {
        cy.contains('Expected date for win').should('not.exist')
      }

      if (result.potential_value) {
        cy.contains('Potential export value')
        cy.contains(NumberUtils.currencyGBP(result.potential_value))
      } else {
        cy.contains('Potential export value').should('not.exist')
      }

      if (result.contact) {
        cy.contains('Company contact')
        cy.contains(result.contact.name)
      } else {
        cy.contains('Company contact').should('not.exist')
      }

      if (result.sector) {
        cy.contains('Project sector')
        cy.contains(result.sector.segment)
      } else {
        cy.contains('Project sector').should('not.exist')
      }
    })
}

describe('My pipeline app', () => {
  context('When viewing the propspect status', () => {
    before(() => {
      cy.visit(urls.pipeline.index())
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('Prospect').should('have.attr', 'aria-selected', 'true')
        cy.contains('Active')
        cy.contains('Won')
      })
    })

    context('should render the pipeline list', () => {
      const expectedOutcomeList = [
        { expectedDate: '15 May 2020' },
        { expectedDate: '14 May 2020' },
        { expectedDate: '13 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '12 May 2020', expectedWinDate: 'May 2021' },
      ]
      expectedOutcomeList.forEach((expectedData, index) => {
        it(`should render the item at index ${index}`, () => {
          assertPipelineItem(index, expectedData, leads)
        })
      })
    })
  })

  context('When viewing the active status', () => {
    before(() => {
      cy.visit(urls.pipeline.active())
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('Prospect')
        cy.contains('Active').should('have.attr', 'aria-selected', 'true')
        cy.contains('Won')
      })
    })

    context('should render the pipeline list', () => {
      it('should render the first item', () => {
        assertPipelineItem(0, { expectedDate: '12 May 2020' }, inProgress)
      })
    })
  })

  context('When viewing the won status', () => {
    before(() => {
      cy.visit(urls.pipeline.won())
    })

    it('should render the sub tab nav', () => {
      cy.get('[data-auto-id="pipelineSubTabNav"]').within(() => {
        cy.contains('Prospect')
        cy.contains('Active')
        cy.contains('Won').should('have.attr', 'aria-selected', 'true')
      })
    })

    context('should render the pipeline list', () => {
      it('should render the first item', () => {
        assertPipelineItem(0, { expectedDate: '10 May 2020' }, win)
      })
    })
  })

  context('When filtering pipeline by archived', () => {
    beforeEach(() => {
      cy.server()
      cy.visit(urls.pipeline.index())
      cy.route('GET', '/api-proxy/v4/pipeline-item*').as('pipelineGet')
    })

    const assertCheckedBoxAcrossTabs = (checkbox, test) => {
      cy.contains('Prospect').click()
      cy.contains('Prospect').should('have.attr', 'aria-selected', 'true')
      cy.wrap(checkbox).should(test)

      cy.contains('Active').click()
      cy.contains('Active').should('have.attr', 'aria-selected', 'true')
      cy.wrap(checkbox).should(test)

      cy.contains('Won').click()
      cy.contains('Won').should('have.attr', 'aria-selected', 'true')
      cy.wrap(checkbox).should(test)
    }

    it('should be un-checked by default', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          assertCheckedBoxAcrossTabs(element, 'not.be.checked')
        })
    })

    it('should keep its checked state across tabs', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).check()
          assertCheckedBoxAcrossTabs(element, 'be.checked')
          cy.wrap(element).uncheck()
          assertCheckedBoxAcrossTabs(element, 'not.be.checked')
        })
    })

    it('should omit ?archive=false from the query string when archive is checked', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).check()
          cy.wrap(element).should('be.checked')
          cy.wrap(element).uncheck()
          cy.wrap(element).should('not.be.checked')
          cy.wait(['@pipelineGet', '@pipelineGet']).then((xhr) => {
            expect(xhr[0].url).to.contain('archived')
            expect(xhr[1].url).to.not.contain('archived')
          })
        })
    })

    it('should add ?archive=false from the query string when archive is unchecked', () => {
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).should('not.be.checked')
          cy.wait('@pipelineGet').then((xhr) => {
            expect(xhr.url).to.contain('archived')
          })
        })
    })

    it('should render archived items', () => {
      const expectedOutcomeList = [
        { expectedDate: '15 May 2020' },
        { expectedDate: '14 May 2020' },
        { expectedDate: '13 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '12 May 2020', expectedWinDate: 'May 2021' },
        { expectedDate: '11 May 2020' },
      ]
      cy.contains('Show archived projects')
        .parent()
        .find('input')
        .then((element) => {
          cy.wrap(element).check()
          cy.wrap(element).should('be.checked')
          return cy.wait('@pipelineGet')
        })
        .then(() => {
          expectedOutcomeList.forEach((expectedData, index) => {
            assertPipelineItem(index, expectedData, leads)
          })
        })
    })
  })
})
