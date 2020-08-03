import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import pluralize from 'pluralize'
import styled from 'styled-components'

import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from '../../../../../client/components/'
import WideSummaryTableRow from './WideSummaryTableRow'

const StyledRowActionLink = styled(Link)`
  float: right;
  margin-left: ${SPACING_POINTS[3]}px;
  font-size: inherit;
`

const SubsectionDnBHierarchy = ({
  globalUltimate,
  isDnbCompany,
  isGlobalUltimate,
  isGlobalUltimateFlagEnabled,
  dnbRelatedCompaniesCount,
  urls,
}) => {
  if (!isDnbCompany || !isGlobalUltimateFlagEnabled) {
    return null
  }

  return (
    <>
      <WideSummaryTableRow>
        This hierarchy information from Dun & Bradstreet cannot be edited.
      </WideSummaryTableRow>

      {isGlobalUltimate && (
        <SummaryTable.Row heading="Headquarter type">
          Ultimate HQ
        </SummaryTable.Row>
      )}

      {!isGlobalUltimate && globalUltimate && (
        <SummaryTable.Row heading="Ultimate HQ">
          <Link href={globalUltimate.url}>{globalUltimate.name}</Link>
        </SummaryTable.Row>
      )}

      <WideSummaryTableRow>
        {dnbRelatedCompaniesCount > 0 ? (
          <>
            Data Hub contains{' '}
            <Link href={urls.dnbHierarchy}>
              {pluralize(
                'other company record',
                dnbRelatedCompaniesCount,
                true
              )}
            </Link>{' '}
            related to this company
          </>
        ) : (
          'This company is not related to any other company records.'
        )}
      </WideSummaryTableRow>
    </>
  )
}

SubsectionDnBHierarchy.propTypes = {
  isDnbCompany: PropTypes.bool.isRequired,
  isGlobalUltimate: PropTypes.bool.isRequired,
  isGlobalUltimateFlagEnabled: PropTypes.bool.isRequired,
  dnbRelatedCompaniesCount: PropTypes.number.isRequired,
  globalUltimate: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
}

const SubsidiariesCounter = ({ subsidiariesCount, isGlobalHQ, urls }) => {
  if (subsidiariesCount) {
    return (
      <Link href={urls.subsidiaries}>
        {pluralize('subsidiary', subsidiariesCount, true)}
      </Link>
    )
  }

  if (isGlobalHQ) {
    return (
      <>
        None
        <StyledRowActionLink href={urls.linkSubsidiary}>
          Link a subsidiary
        </StyledRowActionLink>
      </>
    )
  }

  return 'None'
}

SubsidiariesCounter.propTypes = {
  subsidiariesCount: PropTypes.number.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

const GlobalHQ = ({ businessDetails, urls }) => {
  if (
    !businessDetails.headquarter_type &&
    !businessDetails.global_headquarters
  ) {
    return (
      <>
        None
        <StyledRowActionLink href={urls.linkGlobalHQ}>
          Link to the Global HQ
        </StyledRowActionLink>
      </>
    )
  }

  if (businessDetails.global_headquarters) {
    return (
      <>
        <Link href={urls.globalHQ}>{businessDetails.global_headquarters}</Link>
        <StyledRowActionLink href={urls.removeGlobalHQ}>
          Remove link
        </StyledRowActionLink>
      </>
    )
  }
}

GlobalHQ.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
}

const SubsectionDataHubHierarchy = ({
  businessDetails,
  isDnbCompany,
  urls,
  subsidiariesCount,
  isGlobalHQ,
}) => {
  const showGlobalHQ =
    businessDetails.global_headquarters ||
    (!businessDetails.headquarter_type && !businessDetails.global_headquarters)

  return (
    <>
      <WideSummaryTableRow addPadding={isDnbCompany}>
        This hierarchy information is manually recorded (linked) by Data Hub
        users. This means it can be different from the Dun & Bradstreet
        hierarchy, which in the future will replace this manually recorded
        information.
      </WideSummaryTableRow>

      <SummaryTable.Row heading="Headquarter type">
        {businessDetails.headquarter_type_label}
      </SummaryTable.Row>

      {businessDetails.headquarter_type && (
        <SummaryTable.Row heading="Subsidiaries">
          <SubsidiariesCounter
            isGlobalHQ={isGlobalHQ}
            subsidiariesCount={subsidiariesCount}
            urls={urls}
          />
        </SummaryTable.Row>
      )}

      {showGlobalHQ && (
        <SummaryTable.Row heading="Global HQ">
          <GlobalHQ businessDetails={businessDetails} urls={urls} />
        </SummaryTable.Row>
      )}
    </>
  )
}

SubsectionDataHubHierarchy.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
  subsidiariesCount: PropTypes.number.isRequired,
  urls: PropTypes.object.isRequired,
}

const SectionHierarchy = ({
  businessDetails,
  isGlobalHQ,
  isArchived,
  isDnbCompany,
  isGlobalUltimate,
  subsidiariesCount,
  dnbRelatedCompaniesCount,
  globalUltimate,
  isGlobalUltimateFlagEnabled,
  urls,
}) => {
  const showDnbHierarchy = isDnbCompany
  const showDataHubHierarchy =
    businessDetails.headquarter_type ||
    businessDetails.global_headquarters ||
    !isDnbCompany

  return (
    <SummaryTable
      caption="Business hierarchy"
      data-auto-id="businessHierarchyDetailsContainer"
      actions={
        !isArchived &&
        showDataHubHierarchy && (
          <Link href={`${urls.companyEdit}#field-headquarter_type`}>Edit</Link>
        )
      }
    >
      {showDnbHierarchy && (
        <SubsectionDnBHierarchy
          globalUltimate={globalUltimate}
          isDnbCompany={isDnbCompany}
          isGlobalUltimate={isGlobalUltimate}
          isGlobalUltimateFlagEnabled={isGlobalUltimateFlagEnabled}
          dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
          urls={urls}
        />
      )}
      {showDataHubHierarchy && (
        <SubsectionDataHubHierarchy
          businessDetails={businessDetails}
          isDnbCompany={isDnbCompany}
          isGlobalHQ={isGlobalHQ}
          subsidiariesCount={subsidiariesCount}
          urls={urls}
        />
      )}
    </SummaryTable>
  )
}

SectionHierarchy.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
  isGlobalUltimate: PropTypes.bool.isRequired,
  isGlobalUltimateFlagEnabled: PropTypes.bool.isRequired,
  subsidiariesCount: PropTypes.number.isRequired,
  dnbRelatedCompaniesCount: PropTypes.number.isRequired,
  globalUltimate: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionHierarchy
