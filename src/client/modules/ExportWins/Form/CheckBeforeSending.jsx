import React from 'react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import { Step, ButtonLink, FieldInput, SummaryTable } from '../../../components'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { steps } from './constants'
import {
  transformTeamsAndAdvisers,
  transformGoodsAndServices,
  transformKeyValuePairToList,
  transformCustomerConfidential,
} from './transformers'

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
  const props = {
    values,
    goToStep,
  }
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
    <SummaryTable.Row heading="Lead Officer name">
      {values?.adviser?.label}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Team type">{values.team_type}</SummaryTable.Row>
    <SummaryTable.Row heading="HQ Team, region or post">
      {values.hq_team_region_or_post}
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
      {values.uk_region}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export potential">
      {values.business_potential}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export experience">
      {values.export_experience}
    </SummaryTable.Row>
  </SummaryTable>
)

const WinDetailsTable = ({ values, goToStep }) => (
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
    <SummaryTable.Row heading="Total value">0</SummaryTable.Row>
    <SummaryTable.ListRow
      heading="What does the value relate to?"
      value={transformGoodsAndServices(values.goods_and_services)}
      emptyValue="Not set"
    />
    <SummaryTable.Row heading="Type of goods or services">
      {values.goods_and_services_name}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Sector">{values.sector?.label}</SummaryTable.Row>
  </SummaryTable>
)

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
      value={transformKeyValuePairToList(values, 'support_type')}
      emptyValue="Not set"
    />
    <SummaryTable.ListRow
      heading="Was there a DBT campaign or event that contributed to this win?"
      value={transformKeyValuePairToList(values, 'campaign')}
      emptyValue="Not set"
    />
  </SummaryTable>
)

export default CheckBeforeSendingStep
