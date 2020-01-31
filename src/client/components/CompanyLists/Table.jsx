import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import VisuallyHidden from '@govuk-react/visually-hidden'
import moment from 'moment'
import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import SecondaryButton from '../SecondaryButton'

const StyledCellLink = styled.a({
  whiteSpace: 'nowrap',
  marginBottom: 0,
})

const Advisers = ({ ditParticipants }) =>
  ditParticipants.length === 0
    ? 'Unknown adviser - Unknown team'
    : ditParticipants.length > 1
    ? 'Multiple advisers'
    : ditParticipants.map((adviser, index) => (
        <div key={index}>
          {`${adviser.name || 'Unknown adviser'} - ${adviser.team ||
            'Unknown team'}`}
        </div>
      ))

const CompaniesTable = ({ companies }) => (
  <Table
    head={
      <Table.Row>
        <Table.CellHeader>Company name</Table.CellHeader>
        <Table.CellHeader>Last interaction</Table.CellHeader>
        <Table.CellHeader>Subject</Table.CellHeader>
        <Table.CellHeader>Added by</Table.CellHeader>
        <Table.CellHeader>
          <VisuallyHidden>Action</VisuallyHidden>
        </Table.CellHeader>
      </Table.Row>
    }
  >
    {companies.map(
      ({ id, name, date, subject, interactionId, ditParticipants }) => (
        <Table.Row key={id}>
          <Table.Cell setWidth="20%">
            <Link href={urls.companies.detail(id)}>
              <LinesEllipsis
                text={name}
                maxLine="2"
                ellipsis="..."
                trimRight={true}
                basedOn="words"
              />
            </Link>
          </Table.Cell>
          <Table.Cell setWidth="15%">
            {date ? moment(date).format('D MMM YYYY') : '-'}
          </Table.Cell>
          <Table.Cell setWidth="30%">
            {interactionId ? (
              <Link href={`interactions/${interactionId}`}>
                <LinesEllipsis
                  text={subject}
                  maxLine="2"
                  ellipsis="..."
                  trimRight={true}
                  basedOn="words"
                />
              </Link>
            ) : (
              'No interactions have been recorded'
            )}
          </Table.Cell>
          <Table.Cell setWidth="20%">
            <Advisers ditParticipants={ditParticipants} />
          </Table.Cell>
          <Table.Cell>
            <SecondaryButton
              as={StyledCellLink}
              href={urls.companies.interactions.create(id)}
            >
              Add interaction
            </SecondaryButton>
          </Table.Cell>
        </Table.Row>
      )
    )}
  </Table>
)

export default CompaniesTable
