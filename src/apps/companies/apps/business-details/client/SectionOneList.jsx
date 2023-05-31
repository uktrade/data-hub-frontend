import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from '../../../../../client/components/'

const StyledSummaryFooterLink = styled(Link)`
  margin-top: -${SPACING_POINTS[7]}px;
  display: block;
`

const getLocation = (managerTeam) =>
  managerTeam.ukRegion
    ? managerTeam.ukRegion.name
    : managerTeam.country
    ? managerTeam.country.name
    : '-'

const SectionOneList = ({ company, isArchived, isDnbCompany, urls }) =>
  company.oneListGroupGlobalAccountManager ? (
    <>
      <SummaryTable
        caption="Global Account Manager – One List"
        data-test="oneListDetailsContainer"
        actions={
          !isArchived &&
          !isDnbCompany && <Link href={urls.companyEdit}>Edit</Link>
        }
      >
        <SummaryTable.Row heading="One List tier">
          {company.oneListGroupTier.name}
        </SummaryTable.Row>

        <SummaryTable.Row heading="Global Account Manager">
          {company.oneListGroupGlobalAccountManager.name}
          {company.oneListGroupGlobalAccountManager.ditTeam.name}
          {getLocation(company.oneListGroupGlobalAccountManager.ditTeam)}
        </SummaryTable.Row>
      </SummaryTable>

      <StyledSummaryFooterLink href={urls.companyAdvisers}>
        See all advisers on the core team
      </StyledSummaryFooterLink>
    </>
  ) : null

SectionOneList.propTypes = {
  company: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionOneList
