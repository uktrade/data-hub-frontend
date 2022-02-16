import React from 'react'
import Link from '@govuk-react/link'
import PropTypes from 'prop-types'

import {
  Main,
  FieldAdvisersTypeahead,
  SummaryTable,
  NewWindowLink,
} from '../../../../../client/components'
import Form from '../../../../../client/components/Form'
import urls from '../../../../../lib/urls'
import { TASK_SAVE_INVESTMENT_PROJECT_MANAGERS } from './state'
import {
  transformAdviserForTypeahead,
  transformAdviserForAPI,
  transformObjectForTable,
  transformLocationsForTable,
} from './transformers'
import styled from 'styled-components'

const { format } = require('../../../../../client/utils/date')
const { currencyGBP } = require('../../../../../client/utils/number-utils')

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: -23,
})

function EditProjectManagement({
  id,
  projectAssuranceAdviser,
  projectManager,
  primarySector,
  clientCompany,
  accountTier,
  possibleUKLocations,
  competitorCountries,
  estimatedLandDate,
  totalInvestment,
}) {
  return (
    <Main>
      <Form
        id="edit-investment-project-management"
        analyticsFormName="editInvestmentProjectManagement"
        initialValues={{
          project_assurance_adviser: transformAdviserForTypeahead(
            projectAssuranceAdviser
          ),
          project_manager: transformAdviserForTypeahead(projectManager),
        }}
        cancelRedirectTo={() => urls.investments.projects.team(id)}
        redirectTo={() => urls.investments.projects.team(id)}
        submissionTaskName={TASK_SAVE_INVESTMENT_PROJECT_MANAGERS}
        transformPayload={(values) => ({
          id,
          projectAssuranceAdviserId: transformAdviserForAPI(
            values.project_assurance_adviser
          ),
          projectManagerId: transformAdviserForAPI(values.project_manager),
        })}
        flashMessage={() => 'Investment details updated'}
      >
        <StyledSummaryTable
          caption="Assign project management"
          data-test="briefProjectSummary"
        >
          <SummaryTable.Row
            heading="Primary sector"
            children={transformObjectForTable(primarySector)}
          />
          <SummaryTable.Row
            heading="Client company"
            children={
              <Link
                href={urls.companies.detail(clientCompany.id)}
                aria-label={'client company'}
              >
                {clientCompany.name}
              </Link>
            }
          />
          <SummaryTable.Row
            heading="Website"
            children={
              clientCompany.website ? (
                <NewWindowLink href={clientCompany.website}>
                  {clientCompany.website}
                </NewWindowLink>
              ) : (
                ''
              )
            }
          />
          <SummaryTable.Row
            heading="Account tier"
            children={transformObjectForTable(accountTier, 'None')}
          />
          <SummaryTable.Row
            heading="Possible UK locations"
            children={transformLocationsForTable(possibleUKLocations)}
          />
          <SummaryTable.Row
            heading="Competitor countries"
            children={transformLocationsForTable(competitorCountries)}
          />
          <SummaryTable.Row
            heading="Estimated land date"
            children={format(estimatedLandDate, 'MMMM yyyy')}
          />
          <SummaryTable.Row
            heading="Total investment"
            children={totalInvestment ? currencyGBP(totalInvestment) : ''}
          />
        </StyledSummaryTable>
        <FieldAdvisersTypeahead
          name="project_assurance_adviser"
          label="Project Assurance Adviser"
          placeholder="Select an adviser"
        />

        <FieldAdvisersTypeahead
          name="project_manager"
          label="Project Manager"
          placeholder="Select a manager"
        />
      </Form>
    </Main>
  )
}

EditProjectManagement.propTypes = {
  id: PropTypes.string.isRequired,
  projectAssuranceAdviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  projectManager: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  primarySector: PropTypes.shape({
    name: PropTypes.string,
  }),
  clientCompany: PropTypes.shape({
    name: PropTypes.string,
  }),
  accountTier: PropTypes.string,
  possibleUKLocations: PropTypes.array,
  competitorCountries: PropTypes.array,
  estimatedLandDate: PropTypes.string,
  totalInvestment: PropTypes.string,
}

export default EditProjectManagement
