import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import moment from 'moment'
import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import SecondaryButton from './SecondaryButton'
import * as propTypes from './propTypes'

const StyledCellLink = styled.a({
  whiteSpace: 'nowrap',
  marginBottom: 0,
})

const CompaniesTable = ({ companies }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>Company name</Table.CellHeader>
        <Table.CellHeader>Last interaction</Table.CellHeader>
        {/* CellHeader complains if it has no children */}
        <Table.CellHeader colSpan="2">{''}</Table.CellHeader>
      </Table.Row>
    }
  >
    {companies.map(({ company, latestInteraction }) => (
      <Table.Row key={company.id}>
        <Table.Cell setWidth="25%">
          <Link href={`companies/${company.id}`}>
            <LinesEllipsis
              text={company.name}
              maxLine="2"
              ellipsis="..."
              trimRight={true}
              basedOn="words"
            />
          </Link>
        </Table.Cell>
        <Table.Cell setWidth="15%">
          {latestInteraction.date
            ? moment(latestInteraction.date).format('D MMM YYYY')
            : '-'}
        </Table.Cell>
        <Table.Cell setWidth="50%">
          {latestInteraction.id ? (
            <Link href={`interactions/${latestInteraction.id}`}>
              <LinesEllipsis
                text={latestInteraction.subject}
                maxLine="2"
                ellipsis="..."
                trimRight={true}
                basedOn="words"
              />
            </Link>
          ) : (
            latestInteraction.subject
          )}
        </Table.Cell>
        <Table.Cell>
          <SecondaryButton
            as={StyledCellLink}
            href={urls.companies.interactions.create(company.id)}
          >
            Add interaction
          </SecondaryButton>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table>
)

CompaniesTable.propTypes = {
  companies: propTypes.companies,
}

export default CompaniesTable
