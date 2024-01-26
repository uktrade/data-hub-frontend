import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import { SPACING } from '@govuk-react/constants'
import { connect } from 'react-redux'

import { InvestmentLayout, LocalNav, LocalNavLink } from '../../components'
import urls from '../../../lib/urls'
import { state2props } from './state'
import { buildProjectBreadcrumbs } from '../../modules/Investments/utils'
import InvestmentName from '../../modules/Investments/Projects/InvestmentName'

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

const localProjectUrl = (url, projectId) => projectId && url(projectId)

export const ProjectLayoutNew = ({
  projectId,
  breadcrumbs,
  pageTitle,
  children,
  userPermissions,
  flashMessages,
}) => {
  return (
    <InvestmentLayout
      projectId={projectId}
      pageTitle={
        <>
          {pageTitle} - <InvestmentName id={projectId} /> - Projects -
          Investments
        </>
      }
      breadcrumbs={buildProjectBreadcrumbs(breadcrumbs)}
      flashMessages={flashMessages}
    >
      <GridRow>
        <GridCol setWidth="one-quarter">
          <StyledNavWrapper>
            <LocalNav>
              <LocalNavLink
                dataTest="project-details-link"
                href={localProjectUrl(
                  urls.investments.projects.details,
                  projectId
                )}
              >
                Project details
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-team-link"
                href={localProjectUrl(
                  urls.investments.projects.team,
                  projectId
                )}
              >
                Project team
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-tasks-link"
                href={localProjectUrl(
                  urls.investments.projects.tasks.index,
                  projectId
                )}
              >
                Tasks
              </LocalNavLink>
              {userCanViewInteractions(userPermissions) && (
                <LocalNavLink
                  dataTest="project-interactions-link"
                  href={localProjectUrl(
                    urls.investments.projects.interactions.index,
                    projectId
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
                    projectId
                  )}
                >
                  Propositions
                </LocalNavLink>
              )}
              <LocalNavLink
                dataTest="project-evaluation-link"
                href={localProjectUrl(
                  urls.investments.projects.evaluation,
                  projectId
                )}
              >
                Evaluations
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-history-link"
                href={localProjectUrl(
                  urls.investments.editHistory.index,
                  projectId
                )}
              >
                Edit history
              </LocalNavLink>
              <LocalNavLink
                dataTest="project-evidence-link"
                href={localProjectUrl(
                  urls.investments.projects.evidence.index,
                  projectId
                )}
              >
                Evidence
              </LocalNavLink>
              {userCanViewAdmin(userPermissions) && (
                <LocalNavLink
                  dataTest="project-admin-link"
                  href={localProjectUrl(
                    urls.investments.projects.admin,
                    projectId
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
    </InvestmentLayout>
  )
}

ProjectLayoutNew.propTypes = {
  projectId: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  userPermissions: PropTypes.array.isRequired,
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }),
}

export default connect(state2props)(ProjectLayoutNew)
