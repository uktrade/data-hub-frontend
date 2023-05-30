import React from 'react'
import PropTypes from 'prop-types'
import { H2, Table } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'

import {
  CompanyResource,
  CompanyOneListTeamResource,
} from '../../../components/Resource'
import { transformOneListCoreTeamToCollection } from './transformers'
import { NewWindowLink } from '../../../components'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
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
  transformedAdvisers.map(({ team, location, name }) => (
    <Table.Row>
      <Table.Cell>{team}</Table.Cell>
      <Table.Cell>{location}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
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

const CoreTeam = ({
  companyId,
  oneListEmail,
  dnbRelatedCompaniesCount,
  returnUrl,
  localNavItems,
}) => (
  <CompanyResource id={companyId}>
    {(company) => (
      <CompanyOneListTeamResource id={companyId}>
        {(oneListTeam) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[
              { link: urls.dashboard(), text: 'Home' },
              {
                link: urls.companies.index(),
                text: 'Companies',
              },
              { link: urls.companies.detail(company.id), text: company.name },
              { text: 'Core Team' },
            ]}
            dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
            returnUrl={returnUrl}
            localNavItems={localNavItems}
          >
            <H2 size={LEVEL_SIZE[3]} data-test="core-team-heading">
              Advisers on the core team
            </H2>
            <p data-test="core-team-subheading">{getSubheadingText(company)}</p>
            <Table data-test="global-acc-manager-table">
              <Table.Row>
                <Table.CellHeader setWidth="33%">Team</Table.CellHeader>
                <Table.CellHeader setWidth="33%">Location</Table.CellHeader>
                <Table.CellHeader setWidth="33%">
                  Global Account Manager
                </Table.CellHeader>
              </Table.Row>
              {buildGAMRow(oneListTeam)}
            </Table>
            {buildAdviserRows(oneListTeam) && (
              <Table data-test="advisers-table">
                <Table.Row>
                  <Table.CellHeader setWidth="33%">Team</Table.CellHeader>
                  <Table.CellHeader setWidth="33%">Location</Table.CellHeader>
                  <Table.CellHeader setWidth="33%">
                    Adviser on core team
                  </Table.CellHeader>
                </Table.Row>
                {buildAdviserRows(oneListTeam)}
              </Table>
            )}
            <Details
              summary="Need to find out more, or edit the One List tier information?"
              data-test="core-team-details"
            >
              For more information, or if you need to change the One List tier
              or account management team for this company, go to the{' '}
              <NewWindowLink
                href={urls.external.digitalWorkspace.accountManagement}
              >
                Digital Workspace
              </NewWindowLink>{' '}
              or email{' '}
              <Link href={`mailto:${oneListEmail}`}>{oneListEmail}</Link>
            </Details>
          </CompanyLayout>
        )}
      </CompanyOneListTeamResource>
    )}
  </CompanyResource>
)

CoreTeam.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default CoreTeam
