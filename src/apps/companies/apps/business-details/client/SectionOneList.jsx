import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from '../../../../../client/components/'
import urls from '../../../../../lib/urls'

const StyledSummaryFooterLink = styled(Link)`
  margin-top: -${SPACING_POINTS[7]}px;
  display: block;
`

const getLocation = (manager) => {
  if (!manager || !manager.ditTeam) {
    return '-'
  }

  return manager.ditTeam.ukRegion
    ? manager.ditTeam.ukRegion.name
    : manager.ditTeam.country
    ? manager.ditTeam.country.name
    : '-'
}

const SectionOneList = ({ company, isArchived, isDnbCompany }) =>
  company.oneListGroupGlobalAccountManager ? (
    <>
      <SummaryTable
        caption="Global Account Manager – One List"
        data-test="oneListDetailsContainer"
        actions={
          !isArchived &&
          !isDnbCompany && (
            <Link href={urls.companies.edit(company.id)}>Edit</Link>
          )
        }
      >
        <SummaryTable.Row heading="One List tier">
          {company.oneListGroupTier.name}
        </SummaryTable.Row>

        <SummaryTable.Row heading="Global Account Manager">
          {company.oneListGroupGlobalAccountManager.name}
          {company.oneListGroupGlobalAccountManager.ditTeam
            ? company.oneListGroupGlobalAccountManager.ditTeam.name
            : '-'}
          {getLocation(company.oneListGroupGlobalAccountManager)}
        </SummaryTable.Row>
      </SummaryTable>

      <StyledSummaryFooterLink
        href={urls.companies.accountManagement.index(company.id)}
      >
        See all advisers on the core team
      </StyledSummaryFooterLink>
    </>
  ) : null

SectionOneList.propTypes = {
  company: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
}

export default SectionOneList
