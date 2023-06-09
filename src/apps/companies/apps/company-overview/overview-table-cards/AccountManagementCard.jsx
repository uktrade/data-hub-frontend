import React, { useState } from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'

import { SummaryTable } from '../../../../../client/components'
import { isItaTierDAccount } from '../../../../../client/modules/Companies/utils'
import urls from '../../../../../lib/urls'
import { buildCellContents } from './transformers'
import {
  StyledLastTableCell,
  StyledSummaryTable,
  StyledTableRow,
} from './components'

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

const AccountManagementCard = ({ company }) => {
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
      <SummaryTable.Row heading="DBT Region">
        {buildCellContents(
          company?.ukRegion,
          <span>{company.ukRegion?.name}</span>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row
        heading={
          isItaTierDAccount(company.oneListGroupTier)
            ? 'Lead ITA'
            : 'Account Manager'
        }
      >
        {buildCellContents(
          company?.oneListGroupGlobalAccountManager,
          <Link href={urls.companies.advisers.index(company.id)}>
            {company.oneListGroupGlobalAccountManager?.name}
          </Link>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="One List">
        {buildCellContents(
          company?.oneListGroupTier?.name,
          <span>{company.oneListGroupTier?.name}</span>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Primary Contact(s)">
        {buildCellContents(
          viewablePrimaryContacts.length > 0,
          <StyledAddressList>
            {viewablePrimaryContacts.map((contact) => (
              <li>
                <Link href={urls.contacts.details(contact.id)}>
                  {contact.name}
                </Link>
              </li>
            ))}
          </StyledAddressList>
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
        <StyledLastTableCell colSpan={2}>
          <Link
            href={urls.companies.advisers.index(company.id)}
            data-test="account-management-page-link"
          >
            View full account management
          </Link>
        </StyledLastTableCell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

AccountManagementCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default AccountManagementCard
