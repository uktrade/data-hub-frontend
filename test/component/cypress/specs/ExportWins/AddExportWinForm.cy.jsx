import React from 'react'

import AddExportWinForm from '../../../../../src/client/modules/ExportWins/Form/AddExportWinForm'
import DataHubProvider from '../provider'

const typeahead = '[data-test="typeahead-input"]'

const Component = (props) => {
  return (
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
}

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
      cy.get(leadOfficer).as('leadOfficer')
      cy.get('@leadOfficer')
        .find('label')
        .should('have.text', 'Lead officer name')
      cy.get('@leadOfficer').find(typeahead).should('exist')
    })

    it('should render HQ Team after a user has selected a Team type', () => {
      const teamType = '[data-test="field-team_type"]'
      const hqTeam = '[data-test="field-hq_team"]'
      cy.mount(
        <Component
          tasks={{
            TASK_GET_TYPEAHEAD_OPTIONS: () => [
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
            ],
          }}
        />
      )
      cy.get(teamType).as('teamType')
      cy.get(teamType).find('input').as('teamTypeInput')
      // The HQ Team field is not visible until a team has been selected
      cy.get(hqTeam).should('not.exist')
      cy.get('@teamType').find('label').should('have.text', 'Team type')
      cy.get('@teamType').find(typeahead).should('exist')
      cy.get('@teamTypeInput').type('Inv')
      cy.get('@teamTypeInput').type('{downarrow}{enter}{esc}')
      // Now the user has selected a team the HQ Team field will be visible
      cy.get(hqTeam).should('exist')
      cy.get(hqTeam)
        .find('label')
        .should('have.text', 'HQ team, region or post')
      cy.get(hqTeam).find(typeahead).should('exist')
    })

    it('should render Team Members label and a Typeahead', () => {
      const teamMembers = '[data-test="field-team_members"]'
      const hintText = '[data-test="hint-text"]'
      cy.mount(<Component />)
      cy.get(teamMembers).as('teamMembers')
      cy.get('@teamMembers')
        .find('label')
        .should('have.text', 'Team members (optional)')
      cy.get('@teamMembers').find(typeahead).should('exist')
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
  })
})
