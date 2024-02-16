import React from 'react'
import WarningText from '@govuk-react/warning-text'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'
import pluralize from 'pluralize'

import { Step, ButtonLink, FieldInput, SummaryTable } from '../../../components'
import { useFormContext } from '../../../components/Form/hooks'
import { OPTION_NO, OPTION_YES } from '../../../../common/constants'
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

const CheckBeforeSendingStep = ({ isEditing }) => {
  const { values, goToStep } = useFormContext()
  const props = { values, goToStep, isEditing }

  return (
    <Step
      name={steps.CHECK_BEFORE_SENDING}
      submitButtonLabel="Confirm and send to customer"
    >
      <H3 data-test="step-heading">Check before sending</H3>
      <OfficerDetailsTable {...props} />
      <CreditForThisWinTable {...props} />
      <CustomerDetailsTable {...props} />
      <WinDetailsTable {...props} />
      <SupportGivenTable {...props} />
      <WarningText data-test="warning-text">
        This information will be sent to {values.contact?.label} so they can
        confirm the export win.
      </WarningText>
      {/*
          TODO: We have to include this hidden field 
          otherwise we lose the previous step's state.
      */}
      <FieldInput type="hidden" />
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
      {values.lead_officer?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Team type">
      {values.team_type?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="HQ Team, region or post">
      {values.hq_team?.label}
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
        <li>HQ team, region or post: {contributingTeam.hqTeam}</li>
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
        {values?.credit_for_win === OPTION_NO ? 'No' : 'Yes'}
        {values?.credit_for_win === OPTION_YES && (
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
      {values.company_contacts?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="HQ location">
      {values.customer_location?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export potential">
      {values.business_potential?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export experience">
      {values.export_experience?.label}
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
  const exportSum = sumWinTypeYearlyValues('export_win', values)
  const odiWinSum = sumWinTypeYearlyValues('odi_win', values)
  const busSuccSum = sumWinTypeYearlyValues('business_success_win', values)

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
        {values.country?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Date won">
        {`${values.date?.month}/${values.date?.year}`}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Summary of support given">
        {values.description}
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
          {getWinTypeValue('export_win', values)}
        </SummaryTable.Row>
      )}
      {showBusinessSuccessWin && (
        <SummaryTable.Row heading="Business success value">
          {getWinTypeValue('business_success_win', values)}
        </SummaryTable.Row>
      )}
      {showOdiWin && (
        <SummaryTable.Row heading="Outward Direct Investment (ODI) value">
          {getWinTypeValue('odi_win', values)}
        </SummaryTable.Row>
      )}
      <SummaryTable.Row heading="Total value">
        {getTotalWinTypeValue(values.win_type, values)}
      </SummaryTable.Row>
      <SummaryTable.Row heading="What does the value relate to?">
        {transformGoodsAndServices(values.goods_vs_services)}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Type of goods or services">
        {values.name_of_export}
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
      value={values.type_of_support}
      emptyValue="Not set"
    />
    <SummaryTable.ListRow
      heading="Was there a DBT campaign or event that contributed to this win?"
      value={values.associated_programme}
      emptyValue="Not set"
    />
  </SummaryTable>
)

export default CheckBeforeSendingStep
