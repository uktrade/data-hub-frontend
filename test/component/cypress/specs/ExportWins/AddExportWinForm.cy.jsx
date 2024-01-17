import React from 'react'

import AddExportWinForm from '../../../../../src/client/modules/ExportWins/Form/AddExportWinForm'
import { clickContinueButton } from '../../../../functional/cypress/support/actions'
import {
  assertFieldError,
  assertErrorSummary,
  assertFieldTypeahead,
} from '../../../../functional/cypress/support/assertions'
import DataHubProvider from '../provider'

const TEAM_TYPES = [
  {
    label: 'Trade (TD or ST)',
    value: 'a4839e09-e30e-492c-93b5-8ab2ef90b891',
  },
  {
    label: 'Investment (ITFG or IG)',
    value: '42bdaf2e-ae19-4589-9840-5dbb67b50add',
  },
  {
    label: 'DSO',
    value: 'c2d215e2-d564-4c50-b209-ec838eef761d',
  },
]

const Component = (props) => (
  <DataHubProvider
    resetTasks={true}
    tasks={{
      TASK_GET_EXPORT_PROJECT: () => {},
      TASK_GET_REMINDER_SUMMARY: () => {},
      Company: () => ({ name: 'Company Ltd' }),
      TeamType: () => [],
      HQTeamRegionOrPost: () => {},
      TASK_GET_TYPEAHEAD_OPTIONS: () => [],
      ...props.tasks,
    }}
  >
    <AddExportWinForm {...props} />
  </DataHubProvider>
)

describe('Add Export Win', () => {
  context('Default Layout', () => {
    it('should render both a heading and a subheading', () => {
      const header = '[data-test="heading"]'
      const subheading = '[data-test="subheading"]'
      cy.mount(<Component />)
      cy.get(header).should('have.text', 'Add export win')
      cy.get(subheading).should('have.text', 'COMPANY LTD')
    })
  })

  context('Lead Officer', () => {
    it('should render an officer details heading', () => {
      const stepHeading = '[data-test="step-heading"]'
      cy.mount(<Component />)
      cy.get(stepHeading).should('have.text', 'Officer details')
    })

    it('should render Lead Officer label and a Typeahead', () => {
      const leadOfficer = '[data-test="field-lead_officer"]'
      cy.mount(<Component />)
      cy.get(leadOfficer).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Lead officer name',
        })
      })
    })

    it('should render HQ Team after a user has selected a Team Type', () => {
      const teamType = '[data-test="field-team_type"]'
      const hqTeam = '[data-test="field-hq_team"]'
      cy.mount(
        <Component tasks={{ TASK_GET_TYPEAHEAD_OPTIONS: () => TEAM_TYPES }} />
      )
      // The HQ Team field is not visible until a team has been selected
      cy.get(hqTeam).should('not.exist')
      cy.get(teamType).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Team type',
        })
      })
      cy.get(teamType).find('input').as('teamTypeInput')
      cy.get('@teamTypeInput').type('Inv')
      cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
      // Now the user has selected a team the HQ Team field is visible
      cy.get(hqTeam).should('exist')
      cy.get(hqTeam).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'HQ team, region or post',
        })
      })
    })

    it('should render a Team Members Typeahead and hint text', () => {
      const teamMembers = '[data-test="field-team_members"]'
      const hintText = '[data-test="hint-text"]'
      cy.mount(<Component />)
      cy.get(teamMembers).then((element) => {
        assertFieldTypeahead({
          element,
          label: 'Team members (optional)',
        })
      })
      cy.get(hintText).should(
        'have.text',
        'You can add up to 5 team members. They will be notified when this win is updated.'
      )
    })

    it('should render a continue button', () => {
      const continueButton = '[data-test="continue"]'
      cy.mount(<Component />)
      cy.get(continueButton).should('have.text', 'Continue')
    })

    it('should display validation error messages on mandatory fields', () => {
      const teamType = '[data-test="field-team_type"]'
      const leadOfficer = '[data-test="field-lead_officer"]'
      const hqTeam = '[data-test="field-hq_team"]'
      cy.mount(
        <Component tasks={{ TASK_GET_TYPEAHEAD_OPTIONS: () => TEAM_TYPES }} />
      )
      clickContinueButton()
      assertErrorSummary(['Enter a lead officer', 'Select a team type'])
      assertFieldError(cy.get(leadOfficer), 'Enter a lead officer', false)
      assertFieldError(cy.get(teamType), 'Select a team type', false)
      // Select a team to reveal the HQ Team field
      cy.get(teamType).find('input').as('teamTypeInput')
      cy.get('@teamTypeInput').type('Inv')
      cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
      clickContinueButton()
      assertErrorSummary([
        'Enter a lead officer',
        'Select HQ team, region or post',
      ])
      assertFieldError(cy.get(hqTeam), 'Select HQ team, region or post', false)
    })
  })
})
