import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { Badge, SummaryTable } from '../../../../../client/components/'
import { SPACING_POINTS } from '@govuk-react/constants'

const StyledAddressList = styled('ul')`
  margin-top: ${SPACING_POINTS[2]}px;
`

const Address = ({ address, isRegistered }) => {
  const renderAdministrativeArea = (address) => {
    if (address.area && address.area.name) {
      return <li>{address.area.name}</li>
    }
  }
  const addressType = isRegistered ? 'Registered' : 'Trading'
  return (
    <Table.Cell>
      {<Badge>{addressType}</Badge>}
      <StyledAddressList data-test={`addresses${addressType}`}>
        {address.line_1 && <li>{address.line_1}</li>}
        {address.line_2 && <li>{address.line_2}</li>}
        {address.town && <li>{address.town}</li>}
        {address.county && <li>{address.county}</li>}
        {address.postcode && <li>{address.postcode}</li>}
        {renderAdministrativeArea(address)}
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
    data-test="addressesDetailsContainer"
    actions={
      !isDnbCompany &&
      !isArchived && (
        <Link href={`${urls.companyEdit}#field-address`}>Edit</Link>
      )
    }
  >
    <Table.Row>
      {businessDetails.registered_address && (
        <Address
          address={businessDetails.registered_address}
          isRegistered={true}
        />
      )}

      <Address address={businessDetails.address} />
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
