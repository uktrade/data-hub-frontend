import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { get, isEmpty } from 'lodash'
import { SPACING_POINTS, LINE_HEIGHT } from '@govuk-react/constants'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import { NewWindowLink, SummaryTable } from '../../../../../client/components/'
import { exportSegmentsLabels, exportSubSegmentsLabels } from '../../../labels'

const TableDetails = styled('div')`
  display: flex;
  flex-flow: row wrap;
  * {
    font-size: inherit;
    line-height: inherit;
  }
  & > span {
    flex: 1;
    padding-left: ${SPACING_POINTS[5]}px;
    line-height: ${LINE_HEIGHT.SIZE_24};
  }
  & > details {
    flex: 1;
    padding-left: ${SPACING_POINTS[5]}px;
    line-height: ${LINE_HEIGHT.SIZE_24};
    margin-bottom: 0;
  }
`

const SectionAbout = ({ businessDetails, isDnbCompany, isArchived, urls }) => (
  <SummaryTable
    caption={`About ${businessDetails.name}`}
    data-test="aboutDetailsContainer"
    actions={!isArchived && <Link href={urls.companyEdit}>Edit</Link>}
  >
    {/* TODO: isolate this component when ready */}
    {/* {Object.entries(businessDetails.about).map(([key, { label, value }]) => (
      <SummaryTable.Row key={key} heading={label} hideWhenEmpty={true}>
        {'TEST' || value}
      </SummaryTable.Row>
    ))} */}

    <SummaryTable.Row heading="VAT number" hideWhenEmpty={true}>
      {businessDetails.vat_number}
    </SummaryTable.Row>

    {!isDnbCompany && (
      <SummaryTable.Row heading="Business type" hideWhenEmpty={true}>
        {businessDetails.business_type}
      </SummaryTable.Row>
    )}

    <SummaryTable.Row heading="Trading name">
      {isEmpty(businessDetails.trading_names)
        ? 'Not set'
        : businessDetails.trading_names}
    </SummaryTable.Row>

    <SummaryTable.Row heading="CDMS reference" hideWhenEmpty={true}>
      {businessDetails.reference_code}
    </SummaryTable.Row>

    {businessDetails.company_number && (
      <SummaryTable.Row heading="Companies House number" hideWhenEmpty={true}>
        {businessDetails.company_number}

        <NewWindowLink href={urls.companiesHouse}>
          View on Companies House website
        </NewWindowLink>
      </SummaryTable.Row>
    )}

    <SummaryTable.Row heading="Annual turnover">
      {businessDetails.turnover && (
        <>
          {currencyGBP(businessDetails.turnover, {
            maximumSignificantDigits: 2,
          })}

          {businessDetails.is_turnover_estimated && (
            <TableDetails>
              This is an estimated number
              <Details summary="What does that mean?">
                Actual turnover is not available for this business. The number
                has been modelled by Dun & Bradstreet, based on similar
                businesses.
              </Details>
            </TableDetails>
          )}
        </>
      )}
      {!businessDetails.turnover &&
        get(businessDetails, 'turnover_range', 'Not set')}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Number of employees">
      {businessDetails.number_of_employees && (
        <>
          {businessDetails.number_of_employees}

          {businessDetails.is_number_of_employees_estimated && (
            <TableDetails>
              This is an estimated number
              <Details summary="What does that mean?">
                Actual number of employees is not available for this business.
                The number has been modelled by Dun & Bradstreet, based on
                similar businesses.
              </Details>
            </TableDetails>
          )}
        </>
      )}
      {!businessDetails.number_of_employees &&
        get(businessDetails, 'employee_range', 'Not set')}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Website">
      {businessDetails.website ? (
        <NewWindowLink href={businessDetails.website}>
          {businessDetails.website}
        </NewWindowLink>
      ) : (
        'Not set'
      )}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Business description">
      {businessDetails.description || 'No description has been added'}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Segment">
      {exportSegmentsLabels[businessDetails.export_segment] ||
        'No export segment or not known'}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Sub-segment">
      {exportSubSegmentsLabels[businessDetails.export_sub_segment] ||
        'No sub export segment or not known'}
    </SummaryTable.Row>
  </SummaryTable>
)

SectionAbout.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionAbout
