import Link from '@govuk-react/link'
import Table from '@govuk-react/table'
import VisuallyHidden from '@govuk-react/visually-hidden'
import moment from 'moment'
import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import styled from 'styled-components'
import { upperFirst } from 'lodash'

import { UNKNOWN_ADVISER, UNKNOWN_TEAM, MULTIPLE_ADVISERS } from './constants'

import urls from '../../../../lib/urls'
import SecondaryButton from './SecondaryButton'
import * as propTypes from './propTypes'

const StyledCellLink = styled.a({
  whiteSpace: 'nowrap',
  marginBottom: 0,
})

const setDefaultText = (text, defaultText) =>
  text && text.length ? text : defaultText

const UNKNOWN_ADVISER_TEXT = upperFirst(UNKNOWN_ADVISER)
const UNKNOWN_TEAM_TEXT = upperFirst(UNKNOWN_TEAM)

const Advisers = ({ ditParticipants }) =>
  ditParticipants.length === 0
    ? `${UNKNOWN_ADVISER_TEXT} - ${UNKNOWN_TEAM_TEXT}`
    : ditParticipants.length > 1
    ? MULTIPLE_ADVISERS
    : ditParticipants.map((adviser, index) => (
        <div key={index}>
          {`${setDefaultText(
            adviser.name,
            UNKNOWN_TEAM_TEXT
          )} - ${setDefaultText(adviser.team, UNKNOWN_TEAM_TEXT)}`}
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
    {companies.map(({ company, latestInteraction, ditParticipants }) => (
      <Table.Row key={company.id}>
        {console.log(companies)}
        <Table.Cell setWidth="20%">
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
        <Table.Cell setWidth="30%">
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
        <Table.Cell setWidth="20%">
          <Advisers ditParticipants={ditParticipants} />
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
