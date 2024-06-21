import React from 'react'
import { kebabCase } from 'lodash'

import ProjectIncompleteFields from '../../../../../../src/client/modules/Investments/Projects/ProjectIncompleteFields'
import { contact } from '../../../../../functional/cypress/fixtures'
import urls from '../../../../../../src/lib/urls'
import {
  STAGE_ACTIVE,
  STAGE_ASSIGN_PM,
  STAGE_VERIFY_WIN,
  STAGE_WON,
} from '../../../../../../src/client/modules/Investments/Projects/constants'

const projectId = 'ba1f0b14-5fe4-4c36-bf6a-ddf115272977'

const detailsLink = urls.investments.projects.editDetails(projectId)
const valueLink = urls.investments.projects.editValue(projectId)
const requirementsLink = urls.investments.projects.editRequirements(projectId)
const projectManagementLink =
  urls.investments.projects.editProjectManagement(projectId)
const associatedLink =
  urls.investments.projects.findAssociatedProject(projectId)
const recipientCompanyLink =
  urls.investments.projects.recipientCompany(projectId)
const evidenceLink = urls.investments.projects.evidence.index(projectId)

const prospectIncompleteFields = [
  'client_cannot_provide_total_investment',
  'strategic_drivers',
  'client_requirements',
  'client_considering_other_countries',
  'total_investment',
  'uk_region_locations',
  'fdi_type',
]

const assignPmIncompleteFields = [
  'project_manager',
  'project_assurance_adviser',
]

const activeIncompleteFields = [
  'client_cannot_provide_foreign_investment',
  'government_assistance',
  'number_new_jobs',
  'number_safeguarded_jobs',
  'r_and_d_budget',
  'non_fdi_r_and_d_budget',
  'new_tech_to_uk',
  'export_revenue',
  'address_1',
  'address_town',
  'address_postcode',
  'actual_uk_regions',
  'delivery_partners',
  'actual_land_date',
  'foreign_equity_investment',
  'average_salary',
  'associated_non_fdi_r_and_d_project',
  'uk_company',
  'investor_type',
  'specific_programmes',
  'level_of_involvement',
]

const buildAndMountComponent = (
  stageName,
  incompleteFields = [],
  currentAdviserId = contact.deanCox.id
) => {
  const project = {
    id: projectId,
    incompleteFields: incompleteFields,
    stage: {
      name: stageName,
    },
    projectManager: contact.deanCox,
    projectAssuranceAdviser: contact.deanCox,
  }

  return cy.mountWithProvider(
    <ProjectIncompleteFields
      project={project}
      currentAdviserId={currentAdviserId}
    />
  )
}

const assertToMoveText = (stage) => {
  cy.get('[data-test="project-incomplete-fields"]').should(
    'contain',
    `To move to the ${stage} stage complete the following:`
  )
}

const assertBeforeYouMoveText = (stage) => {
  cy.get('[data-test="move-to-next-stage"]').should(
    'contain',
    `Before you move to the ${stage} stage:`
  )
}

const assertLink = (fieldName, link) => {
  cy.get(`[data-test="${kebabCase(fieldName)}-link"]`)
    .should('exist')
    .should('have.text', fieldName)
    .should('have.attr', 'href', link)
}

const assertSubmitButton = (stageName) => {
  cy.get('[data-test="submit-button"]').should(
    'have.text',
    `Move to ${stageName} stage`
  )
}

const assertReadyToMove = (stageName) => {
  it('should render the progression message and button', () => {
    cy.get('[data-test="move-to-next-stage"]').should(
      'contain',
      'You have added all required information to complete this stage.'
    )
    assertSubmitButton(stageName)
  })
}

const assertEvidenceLink = () => {
  it('should render the evidence link', () => {
    cy.get('[data-test="upload-evidence-link"]')
      .should('exist')
      .should('have.text', 'Upload any evidence documents')
      .should('have.attr', 'href', evidenceLink)
  })
}

describe('ProjectIncompleteFields', () => {
  context(
    'When the project is at the Prospect stage and has incomplete fields',
    () => {
      before(() => {
        buildAndMountComponent('Prospect', prospectIncompleteFields)
      })

      it('should render the component with all incomplete fields', () => {
        assertToMoveText(STAGE_ASSIGN_PM)
        assertLink('Total investment', valueLink)
        assertLink('Strategic drivers behind this investment', requirementsLink)
        assertLink(
          'Possible UK locations for this investment',
          requirementsLink
        )
        assertLink(
          'Is the client considering other countries?',
          requirementsLink
        )
        assertLink('Client requirements', requirementsLink)
        assertLink('Can client provide total investment value?', valueLink)
        assertLink('FDI type', detailsLink)
      })
    }
  )
  context(
    'When the project is at the Prospect stage and has no incomplete fields',
    () => {
      before(() => {
        buildAndMountComponent('Prospect')
      })
      assertReadyToMove(STAGE_ASSIGN_PM)
    }
  )
  context(
    'When the project is at the Assign PM stage and has incomplete fields',
    () => {
      before(() => {
        buildAndMountComponent(STAGE_ASSIGN_PM, assignPmIncompleteFields)
      })

      it('should render the component with all incomplete fields', () => {
        assertToMoveText(STAGE_ACTIVE)
        assertLink('Project Manager', projectManagementLink)
        assertLink('Project Assurance Adviser', projectManagementLink)
      })
    }
  )
  context(
    'When the project is at the Assign PM stage and has no incomplete fields',
    () => {
      before(() => {
        buildAndMountComponent(STAGE_ASSIGN_PM)
      })

      assertReadyToMove(STAGE_ACTIVE)
    }
  )
  context(
    'When the project is at the Active stage and has incomplete fields',
    () => {
      before(() => {
        buildAndMountComponent(STAGE_ACTIVE, activeIncompleteFields)
      })

      it('should render the component with all incomplete fields', () => {
        assertToMoveText(STAGE_VERIFY_WIN)
        assertLink('Can client provide capital expenditure value?', valueLink)
        assertLink(
          'Is this project receiving government financial assistance?',
          valueLink
        )
        assertLink('Number of new jobs', valueLink)
        assertLink('Number of safeguarded jobs', valueLink)
        assertLink(
          'Does this project have budget for a research and development?',
          valueLink
        )
        assertLink(
          'Is this project associated with a non-FDI R&D project?',
          valueLink
        )
        assertLink(
          'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
          valueLink
        )
        assertLink(
          'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
          valueLink
        )
        assertLink('Street', requirementsLink)
        assertLink('Town', requirementsLink)
        assertLink('Postcode', requirementsLink)
        assertLink('UK regions landed', requirementsLink)
        assertLink('Delivery partners', requirementsLink)
        assertLink('Actual land date', detailsLink)
        assertLink('Foreign equity investment', valueLink)
        assertLink('Average salary of new jobs', valueLink)
        assertLink('Non-FDI R&D project', associatedLink)
        assertLink('UK recipient company', recipientCompanyLink)
        assertLink('Investor type', detailsLink)
        assertLink('Specific investment programmes', detailsLink)
        assertLink('Level of investor involvement', detailsLink)
      })
    }
  )
  context(
    'When the project is at the Active stage and has no incomplete fields',
    () => {
      before(() => {
        buildAndMountComponent(STAGE_ACTIVE)
      })

      it('should render the correct message and link', () => {
        assertBeforeYouMoveText(STAGE_VERIFY_WIN)
        assertEvidenceLink()
      })
    }
  )
  context(
    'When the user does not have permission to move to Verify Win',
    () => {
      before(() => {
        buildAndMountComponent(STAGE_ACTIVE, [], contact.johnnyCakeman.id)
      })

      it('should render the PM/PAA message', () => {
        cy.get('[data-test="move-to-next-stage"]').should(
          'contain',
          'Only the Project Manager or Project Assurance Adviser can move the project to the Verify win stage.'
        )
        cy.get('[data-test="submit-button"]').should('not.exist')
      })
    }
  )

  context('When the project is at the Verify win stage', () => {
    before(() => {
      buildAndMountComponent(STAGE_VERIFY_WIN)
    })

    it('should render the progression message and button', () => {
      assertBeforeYouMoveText(STAGE_WON)
      cy.get('[data-test="review-evidence-link"]')
        .should('exist')
        .should('have.text', 'Review the evidence for this investment project')
        .should('have.attr', 'href', evidenceLink)
      assertSubmitButton(STAGE_WON)
    })
  })
})
