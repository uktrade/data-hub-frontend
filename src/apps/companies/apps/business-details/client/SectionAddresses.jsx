import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import { Badge, SummaryTable } from '../../../../../client/components/'
import { SPACING_POINTS } from '@govuk-react/constants'
import urls from '../../../../../lib/urls'

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
        {address.line1 && <li>{address.line1}</li>}
        {address.line2 && <li>{address.line2}</li>}
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

const SectionAddresses = ({ company, isDnbCompany, isArchived }) => {
  const hasOnlyOneAddress = company.registeredAddress == null

  return (
    <SummaryTable
      caption="Addresses"
      data-test="addressesDetailsContainer"
      actions={
        !isDnbCompany &&
        !isArchived && (
          <Link href={`${urls.companies.edit(company.id)}#field-address`}>
            Edit
          </Link>
        )
      }
    >
      <Table.Row>
        {!hasOnlyOneAddress && (
          <Address address={company.registeredAddress} isRegistered={true} />
        )}

        <Address address={company.address} isRegistered={hasOnlyOneAddress} />
      </Table.Row>
    </SummaryTable>
  )
}

SectionAddresses.propTypes = {
  company: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
}

export default SectionAddresses
