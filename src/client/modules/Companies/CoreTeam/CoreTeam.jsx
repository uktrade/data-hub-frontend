import React from 'react'
import PropTypes from 'prop-types'
import { H2, Table, Link } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'

import { CompanyOneListTeamResource } from '../../../components/Resource'
import { transformOneListCoreTeamToCollection } from './transformers'

const getSubheadingText = (company) => {
  const endText = ` an account managed company on the One List (${company.oneListGroupTier.name})`
  if (company.globalHeadquarters?.name) {
    return (
      `This company is a subsidiary of the ${company.globalHeadquarters.name},` +
      endText
    )
  }
  return 'This is' + endText
}

const buildRow = (transformedAdvisers) =>
  transformedAdvisers.map(({ team, location, name, email }) => (
    <Table.Row key={name}>
      <Table.Cell>{team}</Table.Cell>
      <Table.Cell>{location}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>
        {email ? <Link href={`mailto:${email}`}>{email}</Link> : '-'}
      </Table.Cell>
    </Table.Row>
  ))

const buildGAMRow = (oneListTeam) => {
  const advisers = transformOneListCoreTeamToCollection(oneListTeam).gam
  return buildRow(advisers)
}

const buildAdviserRows = (oneListTeam) => {
  const advisers = transformOneListCoreTeamToCollection(oneListTeam).teamMembers
  return advisers.length > 0 ? buildRow(advisers) : null
}

export const CoreTeamAdvisers = ({ company }) => (
  <CompanyOneListTeamResource id={company.id}>
    {(oneListTeam) => (
      <>
        <H2 size={LEVEL_SIZE[3]} data-test="core-team-heading">
          Advisers on the core team
        </H2>
        <p data-test="core-team-subheading">{getSubheadingText(company)}</p>
        <Table data-test="global-acc-manager-table">
          <Table.Row>
            <Table.CellHeader setWidth="25%">Team</Table.CellHeader>
            <Table.CellHeader setWidth="15%">Location</Table.CellHeader>
            <Table.CellHeader setWidth="25%">Lead ITA</Table.CellHeader>
            <Table.CellHeader setWidth="35%">Email</Table.CellHeader>
          </Table.Row>
          {buildGAMRow(oneListTeam)}
        </Table>
        {buildAdviserRows(oneListTeam) && (
          <Table data-test="advisers-table">
            <Table.Row>
              <Table.CellHeader setWidth="25%">Team</Table.CellHeader>
              <Table.CellHeader setWidth="15%">Location</Table.CellHeader>
              <Table.CellHeader setWidth="25%">
                Adviser on core team
              </Table.CellHeader>
              <Table.CellHeader setWidth="35%">Email</Table.CellHeader>
            </Table.Row>
            {buildAdviserRows(oneListTeam)}
          </Table>
        )}
      </>
    )}
  </CompanyOneListTeamResource>
)

CoreTeamAdvisers.propTypes = {
  company: PropTypes.object.isRequired,
  oneListEmail: PropTypes.string.isRequired,
}
