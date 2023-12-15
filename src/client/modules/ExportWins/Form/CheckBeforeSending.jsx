import React from 'react'
import WarningText from '@govuk-react/warning-text'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'
import pluralize from 'pluralize'

import { Step, ButtonLink, FieldInput, SummaryTable } from '../../../components'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { steps } from './constants'
import {
  transformTeamsAndAdvisers,
  transformGoodsAndServices,
  transformCustomerConfidential,
} from './transformers'

import {
  formatValue,
  getYearFromWinType,
  getMaxYearFromWinTypes,
  sumWinTypeYearlyValues,
  sumAllWinTypeYearlyValues,
} from './utils'

const StyledButtonLink = styled(ButtonLink)({
  margin: 0,
})

const StyledContributingTeamsAndAdvisers = styled('div')({
  fontWeight: 'bold',
})

const StyledOrderedList = styled('ol')({
  marginTop: 10,
})

const StyledFieldInput = styled(FieldInput)({
  display: 'none',
})

const CheckBeforeSendingStep = () => {
  const { values, goToStep } = useFormContext()
  const props = { values, goToStep }

  return (
    <Step
      name={steps.CHECK_BEFORE_SENDING}
      submitButtonLabel="Confirm and send to customer"
    >
      <H3>Check before sending</H3>
      <OfficerDetailsTable {...props} />
      <CreditForThisWinTable {...props} />
      <CustomerDetailsTable {...props} />
      <WinDetailsTable {...props} />
      <SupportGivenTable {...props} />
      <WarningText>
        This information will be sent to {values.contact?.label} so they can
        confirm the export win.
      </WarningText>
      {/* 
          TODO: FIX THIS BUG! We have to keep this in otherwise we
          lose the keys in the values object from the previous step
      */}
      <StyledFieldInput name="hidden" type="text" />
    </Step>
  )
}

const OfficerDetailsTable = ({ values, goToStep }) => (
  <SummaryTable
    caption="Officer details"
    data-test="officer-details"
    actions={
      <StyledButtonLink
        onClick={() => {
          goToStep(steps.OFFICER_DETAILS)
        }}
      >
        Change
      </StyledButtonLink>
    }
  >
    <SummaryTable.Row heading="Lead officer name">
      {values.adviser?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Team type">
      {values.team_type?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="HQ Team, region or post">
      {values.hq_team_region_or_post?.label}
    </SummaryTable.Row>
    <SummaryTable.ListRow
      heading="Team members (optional)"
      value={values.team_members}
      emptyValue="Not set"
    />
  </SummaryTable>
)

const ContributingTeamsAndAdvisers = ({ teamsAndAdvisors }) => (
  <>
    <StyledContributingTeamsAndAdvisers>
      Contributing teams and advisers
    </StyledContributingTeamsAndAdvisers>
    {teamsAndAdvisors.map((contributingTeam, index) => (
      <StyledOrderedList index={index} length={teamsAndAdvisors.length}>
        <li>Contributing officer: {contributingTeam.officer}</li>
        <li>Team type: {contributingTeam.teamType}</li>
        <li>HQ team, region or post: {contributingTeam.hqTeamRegionOrPost}</li>
      </StyledOrderedList>
    ))}
  </>
)

const CreditForThisWinTable = ({ values, goToStep }) => {
  const teamsAndAdvisors = transformTeamsAndAdvisers(values)
  return (
    <SummaryTable
      caption="Credit for this win"
      data-test="credit-for-this-win"
      actions={
        <StyledButtonLink
          onClick={() => {
            goToStep(steps.CREDIT_FOR_THIS_WIN)
          }}
        >
          Change
        </StyledButtonLink>
      }
    >
      <SummaryTable.Row heading="Did any other teams help with this win?">
        {values?.credit_for_win === 'no' ? 'No' : 'Yes'}
        {values?.credit_for_win === 'yes' && (
          <ContributingTeamsAndAdvisers teamsAndAdvisors={teamsAndAdvisors} />
        )}
      </SummaryTable.Row>
    </SummaryTable>
  )
}

const CustomerDetailsTable = ({ values, goToStep }) => (
  <SummaryTable
    caption="Customer details"
    data-test="customer-details"
    actions={
      <StyledButtonLink
        onClick={() => {
          goToStep(steps.CUSTOMER_DETAILS)
        }}
      >
        Change
      </StyledButtonLink>
    }
  >
    <SummaryTable.Row heading="Contact name">
      {values.contact?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="HQ location">
      {values.uk_region?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export potential">
      {values.business_potential}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export experience">
      {values.exporter_experience}
    </SummaryTable.Row>
  </SummaryTable>
)

const getWinTypeValue = (winType, values) => {
  const sum = formatValue(sumWinTypeYearlyValues(winType, values))
  const year = getYearFromWinType(winType, values)
  return `${sum} over ${year} ${pluralize('year', year)}`
}

const getTotalWinTypeValue = (winTypes = [], values) => {
  const sum = formatValue(sumAllWinTypeYearlyValues(winTypes, values))
  const maxYear = getMaxYearFromWinTypes(winTypes, values)
  return `${sum} over ${maxYear} ${pluralize('year', maxYear)}`
}

const WinDetailsTable = ({ values, goToStep }) => {
  const exportSum = sumWinTypeYearlyValues('export_win_year', values)
  const odiWinSum = sumWinTypeYearlyValues('odi_win_year', values)
  const busSuccSum = sumWinTypeYearlyValues('business_success_win_year', values)

  const hasMoreThanOneWinType = values?.win_type?.length > 1
  const showExportWin = exportSum > 0 && hasMoreThanOneWinType
  const showBusinessSuccessWin = busSuccSum > 0 && hasMoreThanOneWinType
  const showOdiWin = odiWinSum > 0 && hasMoreThanOneWinType

  return (
    <SummaryTable
      caption="Win details"
      data-test="win-details"
      actions={
        <StyledButtonLink
          onClick={() => {
            goToStep(steps.WIN_DETAILS)
          }}
        >
          Change
        </StyledButtonLink>
      }
    >
      <SummaryTable.Row heading="Destination">
        {values.destination_country?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Date won">
        {`${values.win_date?.month}/${values.win_date?.year}`}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Summary of support given">
        {values.summary_of_support}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Overseas customer">
        {values.name_of_customer}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Confidential">
        {transformCustomerConfidential(values.name_of_customer_confidential)}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Type of win">
        {values.business_type}
      </SummaryTable.Row>
      {showExportWin && (
        <SummaryTable.Row heading="Export value">
          {getWinTypeValue('export_win_year', values)}
        </SummaryTable.Row>
      )}
      {showBusinessSuccessWin && (
        <SummaryTable.Row heading="Business success value">
          {getWinTypeValue('business_success_win_year', values)}
        </SummaryTable.Row>
      )}
      {showOdiWin && (
        <SummaryTable.Row heading="Outward Direct Investment (ODI) value">
          {getWinTypeValue('odi_win_year', values)}
        </SummaryTable.Row>
      )}
      <SummaryTable.Row heading="Total value">
        {getTotalWinTypeValue(values.win_type, values)}
      </SummaryTable.Row>
      <SummaryTable.ListRow
        heading="What does the value relate to?"
        value={transformGoodsAndServices(values.goods_and_services)}
        emptyValue="Not set"
      />
      <SummaryTable.Row heading="Type of goods or services">
        {values.goods_and_services_name}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Sector">
        {values.sector?.label}
      </SummaryTable.Row>
    </SummaryTable>
  )
}

const SupportGivenTable = ({ values, goToStep }) => (
  <SummaryTable
    caption="Support given"
    data-test="support-given"
    actions={
      <StyledButtonLink
        onClick={() => {
          goToStep(steps.SUPPORT_PROVIDED)
        }}
      >
        Change
      </StyledButtonLink>
    }
  >
    <SummaryTable.Row heading="HVC code">{values?.hvc?.label}</SummaryTable.Row>
    <SummaryTable.ListRow
      heading="What type of support was given?"
      value={values.support_type}
      emptyValue="Not set"
    />
    <SummaryTable.ListRow
      heading="Was there a DBT campaign or event that contributed to this win?"
      value={values.campaign}
      emptyValue="Not set"
    />
  </SummaryTable>
)

export default CheckBeforeSendingStep
