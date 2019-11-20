import React from 'react'
import PropTypes from 'prop-types'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { get } from 'lodash'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { StatusMessage } from 'data-hub-components'
import DateUtils from 'data-hub-components/dist/utils/DateUtils'

import SectionAbout from './SectionAbout'
import SectionAddresses from './SectionAddresses'
import SectionHierarchy from './SectionHierarchy'
import SectionDescription from './SectionDescription'
import SectionRegion from './SectionRegion'
import SectionSector from './SectionSector'
import SectionOneList from './SectionOneList'
import SectionDocuments from './SectionDocuments'
import SectionArchive from './SectionArchive'

const StyledRoot = styled('div')`
  & > table {
    margin-top: ${SPACING_POINTS[8]}px;
    margin-bottom: ${SPACING_POINTS[8]}px;
  }
`

const CompanyBusinessDetails = ({
  businessDetails,
  subsidiariesCount,
  dnbRelatedCompaniesCount,
  globalUltimate,
  isGlobalUltimateFlagEnabled,
  urls,
}) => {
  const isGlobalHQ = get(businessDetails, 'headquarter_type.name') === 'ghq'
  const isGlobalUltimate = !!businessDetails.is_global_ultimate
  const isDnbCompany = !!businessDetails.duns_number
  const isArchived = !!businessDetails.archived
  const isBasedInUK = !!businessDetails.uk_based

  return (
    <StyledRoot>
      <p>
        This page shows information about this business and how it is related to other businesses.<br />
        Changes made to this information can be found on the <Link href={urls.companyAudit}>Audit trail page</Link>.
      </p>

      {isArchived &&
        <StatusMessage>
          This company was archived on {DateUtils.format(businessDetails.archived_on)}
          by {businessDetails.archived_by.first_name} {businessDetails.archived_by.last_name}.
          <br />
          <strong>Reason:</strong> {businessDetails.archived_reason}<br />
          <br />
          <Link href={urls.companyUnarchive}>Unarchive</Link>
        </StatusMessage>
      }

      {isDnbCompany &&
        <Details
          summary="Where does information on this page come from?"
          data-auto-id="businessDetailsWhereDoesInformation"
        >
          <p>
            The information on this page that cannot be edited comes from <Link href="https://www.dnb.co.uk/about-us/data-cloud.html">Dun & Bradstreet</Link>.
            This is an external and verified source.
            The information is automatically updated. <Link href={urls.companyAudit}>View the audit history</Link>.
          </p>
          <p>
            If you think the information is incomplete or incorrect, <Link href={urls.support}>get in touch using the support form</Link>.
          </p>
        </Details>
      }

      <SectionAbout
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />

      <SectionAddresses
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />

      <SectionDescription
        businessDetails={businessDetails}
        isArchived={isArchived}
        urls={urls}
      />

      <SectionRegion
        businessDetails={businessDetails}
        isArchived={isArchived}
        isBasedInUK={isBasedInUK}
        urls={urls}
      />

      <SectionSector
        businessDetails={businessDetails}
        isArchived={isArchived}
        urls={urls}
      />

      <SectionOneList
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />

      <SectionHierarchy
        businessDetails={businessDetails}
        subsidiariesCount={subsidiariesCount}
        dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        isGlobalUltimate={isGlobalUltimate}
        isGlobalHQ={isGlobalHQ}
        isGlobalUltimateFlagEnabled={isGlobalUltimateFlagEnabled}
        globalUltimate={globalUltimate}
        urls={urls}
      />

      <SectionDocuments urls={urls} />

      <SectionArchive
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />
    </StyledRoot>
  )
}

CompanyBusinessDetails.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
  subsidiariesCount: PropTypes.number,
  dnbRelatedCompaniesCount: PropTypes.number,
  globalUltimate: PropTypes.object.isRequired,
  isGlobalUltimateFlagEnabled: PropTypes.bool.isRequired,
}

CompanyBusinessDetails.defaultProps = {
  subsidiariesCount: 0,
  dnbRelatedCompaniesCount: 0,
}

export default CompanyBusinessDetails
