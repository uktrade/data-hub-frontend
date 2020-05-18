const urls = require('../../../../../src/lib/urls')
const leads = require('../../../../sandbox/fixtures/v4/pipeline-item/leads.json')
const inProgress = require('../../../../sandbox/fixtures/v4/pipeline-item/in-progress.json')
const win = require('../../../../sandbox/fixtures/v4/pipeline-item/win.json')

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
      it('should render the first item', () => {
        cy.get('[data-auto-id="pipelineSubTabNav"]')
          .get('ol > li:first')
          .within(() => {
            cy.contains(leads.results[0].name)
            cy.contains(leads.results[0].company.name).should(
              'have.attr',
              'href',
              urls.companies.detail(leads.results[0].company.id)
            )
            cy.contains('15 May 2020')
            cy.contains('Edit').should(
              'have.attr',
              'href',
              urls.pipeline.edit(leads.results[0].id)
            )
          })
      })

      it('should render the second item', () => {
        cy.get('[data-auto-id="pipelineSubTabNav"]')
          .get('ol > li')
          .eq(1)
          .within(() => {
            cy.contains(leads.results[1].name)
            cy.contains(leads.results[1].company.name).should(
              'have.attr',
              'href',
              urls.companies.detail(leads.results[1].company.id)
            )
            cy.contains('14 May 2020')
            cy.contains('Edit').should(
              'have.attr',
              'href',
              urls.pipeline.edit(leads.results[1].id)
            )
          })
      })

      it('should render the third item', () => {
        cy.get('[data-auto-id="pipelineSubTabNav"]')
          .get('ol > li:last')
          .within(() => {
            cy.contains(leads.results[2].name)
            cy.contains(leads.results[2].company.name).should(
              'have.attr',
              'href',
              urls.companies.detail(leads.results[2].company.id)
            )
            cy.contains('13 May 2020')
            cy.contains('Edit').should(
              'have.attr',
              'href',
              urls.pipeline.edit(leads.results[2].id)
            )
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
        cy.get('[data-auto-id="pipelineSubTabNav"]')
          .get('ol > li:first')
          .within(() => {
            cy.contains(inProgress.results[0].name)
            cy.contains(inProgress.results[0].company.name).should(
              'have.attr',
              'href',
              urls.companies.detail(inProgress.results[0].company.id)
            )
            cy.contains('12 May 2020')
            cy.contains('Edit').should(
              'have.attr',
              'href',
              urls.pipeline.edit(inProgress.results[0].id)
            )
          })
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
        cy.get('[data-auto-id="pipelineSubTabNav"]')
          .get('ol > li:first')
          .within(() => {
            cy.contains(win.results[0].name)
            cy.contains(win.results[0].company.name).should(
              'have.attr',
              'href',
              urls.companies.detail(win.results[0].company.id)
            )
            cy.contains('10 May 2020')
            cy.contains('Edit').should(
              'have.attr',
              'href',
              urls.pipeline.edit(win.results[0].id)
            )
          })
      })
    })
  })
})
