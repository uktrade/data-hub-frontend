import React from 'react'
import PropTypes from 'prop-types'
import { H2, Table } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'

import { CompanyOneListTeamResource } from '../../../components/Resource'
import { transformOneListCoreTeamToCollection } from './transformers'
import { NewWindowLink } from '../../../components'
import urls from '../../../../lib/urls'

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
    <Table.Row>
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

export const CoreTeamAdvisers = ({ company, oneListEmail }) => (
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
            <Table.CellHeader setWidth="25%">
              Global Account Manager
            </Table.CellHeader>
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
        <Details
          summary="Need to find out more, or edit the One List tier information?"
          data-test="core-team-details"
        >
          For more information, or if you need to change the One List tier or
          account management team for this company, go to the{' '}
          <NewWindowLink
            href={urls.external.digitalWorkspace.accountManagement}
          >
            Digital Workspace
          </NewWindowLink>{' '}
          or email <Link href={`mailto:${oneListEmail}`}>{oneListEmail}</Link>
        </Details>
      </>
    )}
  </CompanyOneListTeamResource>
)

CoreTeamAdvisers.propTypes = {
  company: PropTypes.object.isRequired,
  oneListEmail: PropTypes.string.isRequired,
}
