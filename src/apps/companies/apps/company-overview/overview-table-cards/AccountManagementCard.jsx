import React, { useState } from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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

const StyledAddressList = styled('ul')``

const generatePrimaryContacts = (list, listSize) => {
  let contacts = []
  for (let i = 0; i < listSize; i++) {
    if (list[i] !== undefined) {
      contacts.push(
        <li>
          <Link href={`/contacts/${list[i].id}`}>{list[i].name}</Link>
        </li>
      )
    }
  }
  return <StyledAddressList>{contacts}</StyledAddressList>
}

function getContactsAmount(value) {
  let contactViewMore = 0
  if (value > 2) {
    for (let i = 2; i < 4; i++) {
      contactViewMore++
    }
  }
  return contactViewMore
}

const AccountManagementCard = (props) => {
  const [contacts] = useState([props.company.contacts])
  const { company, queryString } = props
  return (
    <>
      <StyledSummaryTable
        caption="Account Management"
        data-test="accountManagementContainer"
      >
        <SummaryTable.Row heading="DIT Region">
          {company.uk_region.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Account Manager">
          {company.one_list_group_global_account_manager.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Relationship manager">
          Smith Smith
        </SummaryTable.Row>
        <SummaryTable.Row heading="Lead ITA">
          {/*<Link ref="google.co.uk"> Firstname last name </Link>*/}
        </SummaryTable.Row>
        <SummaryTable.Row heading="One List">
          {company.one_list_group_tier.name}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Primary Contact(s)">
          {generatePrimaryContacts(contacts, 2)}
          <Button onClick={generatePrimaryContacts(company.contacts, 4)}>
            {company.contacts.length > 2 ? (
              <span>
                View {getContactsAmount(company.contacts.length)} more contacts
              </span>
            ) : (
              <span></span>
            )}
          </Button>
        </SummaryTable.Row>

        <StyledTableRow>
          <Table.Cell colSpan={2}>
            <Link href={`${queryString}/business-details`}>
              View full account management
            </Link>
          </Table.Cell>
        </StyledTableRow>
      </StyledSummaryTable>
    </>
  )
}

AccountManagementCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default AccountManagementCard
