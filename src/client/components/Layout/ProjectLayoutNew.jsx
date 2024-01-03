import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import { SPACING } from '@govuk-react/constants'
import { connect } from 'react-redux'

import {
  DefaultLayout,
  InvestmentProjectLocalHeader,
  LocalNav,
  LocalNavLink,
} from '../../components'
import urls from '../../../lib/urls'
import { state2props } from './state'
import { buildProjectBreadcrumbs } from '../../modules/Investments/utils'

const StyledNavWrapper = styled('div')`
  margin-bottom: ${SPACING.SCALE_5};
`

const userCanViewInteractions = (permissions) =>
  permissions.includes(
    'interaction.view_associated_investmentproject_interaction'
  ) || permissions.includes('interaction.view_all_interaction')

const userCanViewPropositions = (permissions) =>
  permissions.includes('proposition.view_all_proposition') ||
  permissions.includes('proposition.view_associated_proposition')

const userCanViewAdmin = (permissions) =>
  permissions.includes('investment.change_to_any_stage_investmentproject')

const localProjectUrl = (url, project) => project && url(project.id)

export const ProjectLayoutNew = ({
  project,
  breadcrumbs,
  pageTitle,
  children,
  userPermissions,
}) => {
  console.log('*********************')
  console.log(project)
  return (
    <DefaultLayout
      heading={project && project.name}
      headingLink={
        project && {
          url: urls.companies.detail(project.investorCompany?.id),
          text: project.investorCompany?.name,
        }
      }
      pageTitle={`${pageTitle} - ${
        project && project?.name
      } - Projects - Investments`}
      breadcrumbs={buildProjectBreadcrumbs({ text: project?.name })}
      useReactRouter={false}
      localHeaderChildren={
        project && <InvestmentProjectLocalHeader investment={project} />
      }
    >
      <GridRow>
        <GridCol setWidth="one-quarter">
          <StyledNavWrapper>
            <LocalNav>
              <LocalNavLink
                dataTest="project-details-link"
                href={localProjectUrl(
                  urls.investments.projects.details,
                  project
                )}
              >
                Project details
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-team-link"
                href={localProjectUrl(urls.investments.projects.team, project)}
              >
                Project team
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-tasks-link"
                href={localProjectUrl(
                  urls.investments.projects.tasks.index,
                  project
                )}
              >
                Tasks
              </LocalNavLink>
              {userCanViewInteractions(userPermissions) && (
                <LocalNavLink
                  dataTest="project-interactions-link"
                  href={localProjectUrl(
                    urls.investments.projects.interactions.index,
                    project
                  )}
                  aria-label="Project interactions"
                >
                  Interactions
                </LocalNavLink>
              )}
              {userCanViewPropositions(userPermissions) && (
                <LocalNavLink
                  dataTest="project-propositions-link"
                  href={localProjectUrl(
                    urls.investments.projects.propositions,
                    project
                  )}
                >
                  Propositions
                </LocalNavLink>
              )}
              <LocalNavLink
                dataTest="project-evaluation-link"
                href={localProjectUrl(
                  urls.investments.projects.evaluation,
                  project
                )}
              >
                Evaluations
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-history-link"
                href={localProjectUrl(
                  urls.investments.editHistory.index,
                  project
                )}
              >
                Edit history
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-evidence-link"
                href={localProjectUrl(
                  urls.investments.projects.evidence.index,
                  project
                )}
              >
                Evidence
              </LocalNavLink>
              {userCanViewAdmin(userPermissions) && (
                <LocalNavLink
                  dataTest="project-admin-link"
                  href={localProjectUrl(
                    urls.investments.projects.admin,
                    project
                  )}
                >
                  Admin
                </LocalNavLink>
              )}
            </LocalNav>
          </StyledNavWrapper>
        </GridCol>
        <GridCol>{children}</GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

ProjectLayoutNew.propTypes = {
  project: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  userPermissions: PropTypes.array.isRequired,
}

export default connect(state2props)(ProjectLayoutNew)
