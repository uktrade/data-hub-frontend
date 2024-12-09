import { upperFirst } from 'lodash'

import {
  formatDate,
  DATE_FORMAT_MEDIUM_WITH_TIME,
} from '../../../../../src/client/utils/date-utils'

const urls = require('../../../../../src/lib/urls')
const { investmentProjectFaker } = require('../../fakers/investment-projects')

const investmentProjectWithAllDetails = investmentProjectFaker({
  value_complete: true,
  created_by: {
    name: 'Andy Pipkin',
    contact_email: 'andy.pipkin@gov.uk',
    dit_team: {
      name: 'Little Britain',
    },
  },
  created_on: '2017-06-07T10:00:00Z',
  eyb_leads: ['befab707-5abd-4f47-8477-57f091e6dac9'],
})

const investmentProjectWithoutAllDetails = investmentProjectFaker({
  value_complete: true,
  created_on: '2017-06-07T10:00:00Z',
})

describe('Investment project details', () => {
  context('When viewing a project with all the details fields', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentProjectWithAllDetails.id}`,
        investmentProjectWithAllDetails
      ).as('apiCall')
      cy.visit(
        urls.investments.projects.editDetails(
          investmentProjectWithAllDetails.id
        )
      )
      cy.wait('@apiCall')
    })

    it('should render the meta list with all expected content', () => {
      cy.get('[data-test="meta-list"]').should('exist')
      cy.get('[data-test="meta-list-item-status"]')
        .contains('Status')
        .next('span')
        .should(
          'contain',
          upperFirst(investmentProjectWithAllDetails.status) + ' - change'
        )

      cy.get('[data-test="meta-list-item-project-code"]')
        .contains('Project code')
        .next('span')
        .should('contain', investmentProjectWithAllDetails.project_code)

      cy.get('[data-test="meta-list-item-valuation"]')
        .contains('Valuation')
        .next('span')
        .should(
          'contain',
          investmentProjectWithAllDetails.value_complete
            ? 'Project valued'
            : 'Not yet valued'
        )

      cy.get('[data-test="meta-list-item-created-on"]')
        .contains('Created on')
        .next('span')
        .should(
          'contain',
          formatDate(
            investmentProjectWithAllDetails.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          )
        )

      cy.get('[data-test="meta-list-item-created-by"]')
        .contains('Created by')
        .next('span')
        .should(
          'contain',
          investmentProjectWithAllDetails.created_by.dit_team.name
        )

      cy.get('[data-test="meta-list-item-generated-from"]')
        .contains('Generated from')
        .next('span')
        .should('contain', 'EYB lead')
    })
  })

  context('When viewing a project without leads and created by', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentProjectWithoutAllDetails.id}`,
        investmentProjectWithoutAllDetails
      ).as('apiCall')
      cy.visit(
        urls.investments.projects.editDetails(
          investmentProjectWithoutAllDetails.id
        )
      )
      cy.wait('@apiCall')
    })

    it('should render the meta list with all expected content', () => {
      cy.get('[data-test="meta-list"]').should('exist')
      cy.get('[data-test="meta-list-item-status"]')
        .contains('Status')
        .next('span')
        .should(
          'contain',
          upperFirst(investmentProjectWithoutAllDetails.status) + ' - change'
        )

      cy.get('[data-test="meta-list-item-project-code"]')
        .contains('Project code')
        .next('span')
        .should('contain', investmentProjectWithoutAllDetails.project_code)

      cy.get('[data-test="meta-list-item-valuation"]')
        .contains('Valuation')
        .next('span')
        .should(
          'contain',
          investmentProjectWithoutAllDetails.value_complete
            ? 'Project valued'
            : 'Not yet valued'
        )

      cy.get('[data-test="meta-list-item-created-on"]')
        .contains('Created on')
        .next('span')
        .should(
          'contain',
          formatDate(
            investmentProjectWithoutAllDetails.created_on,
            DATE_FORMAT_MEDIUM_WITH_TIME
          )
        )

      cy.get('[data-test="meta-list-item-created-by"]').should('not.exist')
      cy.get('[data-test="meta-list-item-generated-from"]').should('not.exist')
    })
  })
})
