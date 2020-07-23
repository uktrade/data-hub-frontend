import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { Badge } from '../../../../../client/components/'
import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from 'data-hub-components'

const StyledAddressList = styled('ul')`
  ${({ isRegistered }) => isRegistered && `margin-top: ${SPACING_POINTS[2]}px;`}
`

const Address = ({ address, isRegistered }) => {
  return (
    <Table.Cell>
      {isRegistered && <Badge>Registered</Badge>}
      <StyledAddressList isRegistered={isRegistered}>
        {address.line_1 && <li>{address.line_1}</li>}
        {address.line_2 && <li>{address.line_2}</li>}
        {address.town && <li>{address.town}</li>}
        {address.county && <li>{address.county}</li>}
        {address.postcode && <li>{address.postcode}</li>}
        {address.country && <li>{address.country.name}</li>}
      </StyledAddressList>
    </Table.Cell>
  )
}

Address.propTypes = {
  address: PropTypes.object.isRequired,
  isRegistered: PropTypes.bool,
}

Address.defaultProps = {
  isRegistered: false,
}

const SectionAddresses = ({
  businessDetails,
  isDnbCompany,
  isArchived,
  urls,
}) => (
  <SummaryTable
    caption="Addresses"
    data-auto-id="addressesDetailsContainer"
    actions={
      !isDnbCompany &&
      !isArchived && (
        <Link href={`${urls.companyEdit}#field-address`}>Edit</Link>
      )
    }
  >
    <Table.Row>
      <Address address={businessDetails.address} />

      {businessDetails.registered_address && (
        <Address
          address={businessDetails.registered_address}
          isRegistered={true}
        />
      )}
    </Table.Row>
  </SummaryTable>
)

SectionAddresses.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionAddresses
