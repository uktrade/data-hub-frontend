import React from 'react'
import WarningText from '@govuk-react/warning-text'
import InsetText from '@govuk-react/inset-text'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { Link } from 'govuk-react'
import pluralize from 'pluralize'

import { Step, ButtonLink, FieldInput, SummaryTable } from '../../../components'
import { OPTION_NO, OPTION_YES } from '../../../../common/constants'
import { useFormContext } from '../../../components/Form/hooks'
import { formatMediumDateTime } from '../../../utils/date'
import { WIN_STATUS } from '../Status/constants'
import { ContactLink } from './ExportWinForm'
import urls from '../../../../lib/urls'
import { steps } from './constants'
import { CompanyName } from '.'
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

const StyledSummaryTable = styled(SummaryTable)(({ isEditing }) => ({
  marginBottom: isEditing ? 15 : 30,
}))

const StyledInsetText = styled(InsetText)({
  marginTop: 0,
  marginBottom: 30,
  padding: '0 0 0 5px',
  fontSize: FONT_SIZE.SIZE_14,
})

const SummaryStep = ({ isEditing, companyId }) => {
  const { values, goToStep } = useFormContext()
  const props = { values, goToStep, isEditing, companyId }

  return (
    <Step
      name={steps.SUMMARY}
      submitButtonLabel={isEditing ? 'Save' : 'Confirm and send to customer'}
    >
      <OfficerDetailsTable {...props} />
      <CreditForThisWinTable {...props} />
      <CustomerDetailsTable {...props} />
      <WinDetailsTable {...props} />
      <SupportGivenTable {...props} />
      {!isEditing && (
        <WarningText data-test="warning-text">
          This information will be sent to {values.company_contacts?.email} so
          they can confirm the export win.
        </WarningText>
      )}
      {isEditing && <AdditionalInformation {...props} />}
      {/*
          TODO: We have to include this hidden field 
          otherwise we lose the previous step's state.
      */}
      <FieldInput type="hidden" />
    </Step>
  )
}

const OfficerDetailsTable = ({ values, goToStep, isEditing }) => (
  <>
    <StyledSummaryTable
      caption="Officer details"
      data-test="officer-details"
      isEditing={isEditing}
      actions={
        <StyledButtonLink
          onClick={() => {
            goToStep(steps.OFFICER_DETAILS)
          }}
        >
          Edit
        </StyledButtonLink>
      }
    >
      <SummaryTable.Row heading="Lead officer name">
        {values.lead_officer?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Team type">
        {values.team_type?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="HQ team, region or post">
        {values.hq_team?.label}
      </SummaryTable.Row>
      <SummaryTable.ListRow
        heading="Team members (optional)"
        value={values.team_members}
        emptyValue="Not set"
      />
    </StyledSummaryTable>
    {isEditing && (
      <StyledInsetText data-test="lead-officer">
        <ContactLink sections={['Lead officer name']} />
      </StyledInsetText>
    )}
  </>
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
          Edit
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

const CustomerDetailsTable = ({ values, goToStep, isEditing, companyId }) => (
  <>
    <StyledSummaryTable
      isEditing={isEditing}
      caption="Customer details"
      data-test="customer-details"
      actions={
        <StyledButtonLink
          onClick={() => {
            goToStep(steps.CUSTOMER_DETAILS)
          }}
        >
          Edit
        </StyledButtonLink>
      }
    >
      <SummaryTable.Row heading="Company name">
        {isEditing && (
          <Link href={urls.companies.overview.index(values.company?.id)}>
            {values.company?.name}
          </Link>
        )}
        {!isEditing && (
          <Link href={urls.companies.overview.index(companyId)}>
            <CompanyName companyId={companyId} />
          </Link>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Contact name">
        {values.company_contacts?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="HQ location">
        {values.customer_location?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Medium-sized and high potential companies">
        {values.business_potential?.label}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Export experience">
        {values.export_experience?.label}
      </SummaryTable.Row>
    </StyledSummaryTable>
    {isEditing && (
      <StyledInsetText data-test="customer-details-contact">
        <ContactLink sections={['Export experience']} />
      </StyledInsetText>
    )}
  </>
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

const WinDetailsTable = ({ values, goToStep, isEditing }) => {
  const exportSum = sumWinTypeYearlyValues('export_win', values)
  const odiWinSum = sumWinTypeYearlyValues('odi_win', values)
  const busSuccSum = sumWinTypeYearlyValues('business_success_win', values)

  const hasMoreThanOneWinType = values?.win_type?.length > 1
  const showExportWin = exportSum > 0 && hasMoreThanOneWinType
  const showBusinessSuccessWin = busSuccSum > 0 && hasMoreThanOneWinType
  const showOdiWin = odiWinSum > 0 && hasMoreThanOneWinType

  return (
    <>
      <StyledSummaryTable
        isEditing={isEditing}
        caption="Win details"
        data-test="win-details"
        actions={
          <StyledButtonLink
            onClick={() => {
              goToStep(steps.WIN_DETAILS)
            }}
          >
            Edit
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
        {values.name_of_customer && (
          <SummaryTable.Row heading="Overseas customer">
            {values.name_of_customer}
          </SummaryTable.Row>
        )}
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
      </StyledSummaryTable>
      {isEditing && (
        <StyledInsetText data-test="win-details-contact">
          <ContactLink
            sections={[
              'Summary of the support you provided',
              'Destination',
              'Date won',
              'Type of export win and Value',
            ]}
          />
        </StyledInsetText>
      )}
    </>
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
        Edit
      </StyledButtonLink>
    }
  >
    <SummaryTable.Row heading="High Value Campaign (HVC) code">
      {values?.hvc?.label}
    </SummaryTable.Row>
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

const AdditionalInformation = ({ values, isEditing }) => {
  const winStatus = values.customer_response?.agree_with_win
  return (
    <>
      <StyledSummaryTable
        isEditing={isEditing}
        caption="Additional Information"
        data-test="additional-information"
      >
        {winStatus === WIN_STATUS.REJECTED && (
          <>
            <SummaryTable.Row heading="Comments">
              {values.customer_response.comments}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Export win confirmed">
              No
            </SummaryTable.Row>
          </>
        )}
        {winStatus === WIN_STATUS.PENDING && (
          <>
            <SummaryTable.Row heading="First sent">
              {formatMediumDateTime(values.first_sent)}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Last Sent">
              {formatMediumDateTime(values.last_sent)}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Export win confirmed">
              Pending
            </SummaryTable.Row>
          </>
        )}
        {winStatus === WIN_STATUS.CONFIRMED && (
          <>
            <SummaryTable.Row heading="Comments">
              {values.customer_response.comments || 'Not set'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Export win confirmed">
              Yes
            </SummaryTable.Row>
            <SummaryTable.Row heading="What value do you estimate you would have achieved without our support?">
              {values.customer_response.expected_portion_without_help.name}
            </SummaryTable.Row>
          </>
        )}
      </StyledSummaryTable>
    </>
  )
}

export default SummaryStep
