import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import pluralise from 'pluralise'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from 'data-hub-components'

const StyledRowActionLink = styled(Link)`
  float: right;
  margin-left: ${SPACING_POINTS[3]}px;
  font-size: inherit;
`

const SubsidiariesCounter = ({ isGlobalHQ, subsidiariesCount, urls }) => {
  if (subsidiariesCount) {
    return (
      <Link href={urls.linkSubsidiary}>
        {subsidiariesCount} {pluralise(subsidiariesCount, 'subsidiary')}
      </Link>
    )
  }

  if (isGlobalHQ) {
    return (
      <>
        None
        <StyledRowActionLink href={urls.subsidiaries}>Link a subsidiary</StyledRowActionLink>
      </>
    )
  }

  return 'None'
}

SubsidiariesCounter.propTypes = {
  isGlobalHQ: PropTypes.bool.isRequired,
  subsidiariesCount: PropTypes.number.isRequired,
  urls: PropTypes.object.isRequired,
}

const GlobalHQ = ({ businessDetails, urls }) => {
  if (!businessDetails.headquarter_type && !businessDetails.global_headquarters) {
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
        <Link href={`/companies/${businessDetails.global_headquarters.id}`}>
          {businessDetails.global_headquarters.name}
        </Link>
        <StyledRowActionLink href={urls.removeGlobalHQ}>
          Remove link
        </StyledRowActionLink>
      </>
    )
  }

  return null
}

GlobalHQ.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
}

const SectionHierarchy = ({
  businessDetails,
  isGlobalHQ,
  isArchived,
  isDnbCompany,
  subsidiariesCount,
  urls,
}) => (
  <SummaryTable
    caption="Business hierarchy"
    data-auto-id="businessHierarchyDetailsContainer"
    actions={!isArchived && !isDnbCompany && <Link href={`${urls.companyEdit}#field-headquarter_type`}>Edit</Link>}
  >
    <SummaryTable.Row heading="Headquarter type">
      {businessDetails.headquarter_type_label}
    </SummaryTable.Row>

    {businessDetails.headquarter_type &&
      <SummaryTable.Row heading="Subsidiaries">
        <SubsidiariesCounter
          businessDetails={businessDetails}
          isGlobalHQ={isGlobalHQ}
          subsidiariesCount={subsidiariesCount}
          urls={urls}
        />
      </SummaryTable.Row>
    }

    <SummaryTable.Row heading="Global HQ">
      <GlobalHQ businessDetails={businessDetails} urls={urls} />
    </SummaryTable.Row>
  </SummaryTable>
)

SectionHierarchy.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
  subsidiariesCount: PropTypes.number.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionHierarchy
