import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'
import { SPACING } from '@govuk-react/constants'

import Task from '../../../../../client/components/Task'
import { SummaryTable } from '../../../../../client/components'
import { INVESTMENT__COMPANY_INVESTMENT_COUNT } from '../../../../../client/actions'
import {
  COMPANY_INVESTMENT_COUNT_ID,
  TASK_GET_COMPANY_INVESTMENT_COUNT,
  companyInvestmentCountState2props,
} from './state'
import { NOT_SET_TEXT } from '../../../../companies/constants'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const StyledLoadingBox = styled(LoadingBox)({
  width: SPACING.SCALE_4,
  height: SPACING.SCALE_4,
})

const LoadingIndicator = () => <StyledLoadingBox loading={true} />

const getInvestmentCountMessage = (companyInvestmentCount) =>
  `${
    companyInvestmentCount === 0 ? 'No' : companyInvestmentCount
  } investment ${pluralize('project', companyInvestmentCount)} in the UK`

const CompanySummaryTable = ({ company, companyInvestmentCount }) => (
  <StyledSummaryTable
    caption="Source of foreign equity investment"
    data-test="clientCompanyTable"
  >
    <SummaryTable.Row heading="Company" hideWhenEmpty={true}>
      {company.name}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Country" hideWhenEmpty={true}>
      {company.address ? company.address.country.name : NOT_SET_TEXT}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Company investments">
      <Task.Status
        name={TASK_GET_COMPANY_INVESTMENT_COUNT}
        id={COMPANY_INVESTMENT_COUNT_ID}
        renderProgress={LoadingIndicator}
        startOnRender={{
          payload: company.id,
          onSuccessDispatch: INVESTMENT__COMPANY_INVESTMENT_COUNT,
        }}
      >
        {() => <>{getInvestmentCountMessage(companyInvestmentCount)}</>}
      </Task.Status>
    </SummaryTable.Row>
    {company.one_list_group_tier && (
      <SummaryTable.Row heading="One List tier" hideWhenEmpty={true}>
        {company.one_list_group_tier.name}
      </SummaryTable.Row>
    )}
    {company.one_list_group_global_account_manager && (
      <SummaryTable.Row heading="Global Account Manager" hideWhenEmpty={true}>
        {company.one_list_group_global_account_manager.name}
      </SummaryTable.Row>
    )}
  </StyledSummaryTable>
)

CompanySummaryTable.propTypes = {
  company: PropTypes.object.isRequired,
  companyInvestmentCount: PropTypes.number.isRequired,
}

export default connect(companyInvestmentCountState2props)(CompanySummaryTable)
