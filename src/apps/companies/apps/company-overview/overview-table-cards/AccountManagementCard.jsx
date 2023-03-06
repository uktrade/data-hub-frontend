import React, { useState } from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'

import { SummaryTable } from '../../../../../client/components'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
  & > tbody th {
    width: 50%;
  }
`

const StyledTableRow = styled(Table.Row)`
  border: 0;
`
const Button = styled('button')`
  background: none !important;
  border: none;
  padding: 0 !important;
  /*optional*/
  font-family: arial, sans-serif;
  /*input has OS specific font-family*/
  color: #069;
  text-decoration: underline;
  cursor: pointer;
`

const StyledAddressList = styled('ol')`
  ${'' /* list-style: decimal; */}
`

const MAX_PRIMARY_CONTACTS = 4

const AccountManagementCard = ({ company, queryString }) => {
  const [primaryContacts] = useState(
    company.contacts.filter((contact) => contact.primary)
  )

  // Set up to two primary contacts
  const [viewablePrimaryContacts, setViewablePrimaryContacts] = useState(
    primaryContacts.slice(0, 2)
  )

  const maxNumberOfContacts = Math.min(
    primaryContacts.length,
    MAX_PRIMARY_CONTACTS
  )

  const hiddenContactCount =
    maxNumberOfContacts - viewablePrimaryContacts.length

  const onViewMore = () =>
    // Add up to two further primary contacts
    setViewablePrimaryContacts(
      viewablePrimaryContacts.concat(primaryContacts.slice(2, 4))
    )

  return (
    <StyledSummaryTable
      caption="Account Management"
      data-test="accountManagementContainer"
    >
      <SummaryTable.Row heading="DIT Region">
        {company?.uk_region?.name}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Account Manager">
        {company?.one_list_group_global_account_manager?.name}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Relationship manager">
        Smith Smith
      </SummaryTable.Row>
      <SummaryTable.Row heading="Lead ITA">
        {/*<Link ref="google.co.uk"> Firstname last name </Link>*/}
      </SummaryTable.Row>
      <SummaryTable.Row heading="One List">
        {company?.one_list_group_tier?.name}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Primary Contact(s)">
        {viewablePrimaryContacts.length > 0 ? (
          <StyledAddressList>
            {viewablePrimaryContacts.map((contact) => (
              <li>
                <Link href={`/contacts/${contact.id}`}>{contact.name}</Link>
              </li>
            ))}
          </StyledAddressList>
        ) : (
          <span>No contacts</span>
        )}
        {viewablePrimaryContacts.length < maxNumberOfContacts && (
          <Button onClick={onViewMore}>
            <span>
              View {hiddenContactCount} more{' '}
              {pluralize('contact', hiddenContactCount)}
            </span>
          </Button>
        )}
      </SummaryTable.Row>
      <StyledTableRow>
        <Table.Cell colSpan={2}>
          <Link href={`${queryString}/business-details`}>
            View full account management
          </Link>
        </Table.Cell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

AccountManagementCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default AccountManagementCard
