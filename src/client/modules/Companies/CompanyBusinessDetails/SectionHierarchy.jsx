import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from '../../../components'
import WideSummaryTableRow from './WideSummaryTableRow'
import { hqLabels } from '../../../../apps/companies/labels'
import { companies } from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const StyledRowActionLink = styled(AccessibleLink)`
  float: right;
  margin-left: ${SPACING_POINTS[3]}px;
  font-size: inherit;
`
const getHQLabel = (headquarterType) =>
  headquarterType && hqLabels[headquarterType.name]

const setGlobalHQUrl = (globalHeadquarters) =>
  globalHeadquarters ? companies.detail(globalHeadquarters.id) : undefined

const SubsectionDnBHierarchy = ({
  globalUltimate,
  isDnbCompany,
  isGlobalUltimate,
  dnbRelatedCompaniesCount,
  companyId,
}) => {
  if (!isDnbCompany) {
    return null
  }

  return (
    <>
      <WideSummaryTableRow>
        This hierarchy information from Dun & Bradstreet cannot be edited.
      </WideSummaryTableRow>

      {isGlobalUltimate && (
        <SummaryTable.Row heading="Headquarter type">
          Ultimate HQ
        </SummaryTable.Row>
      )}

      {!isGlobalUltimate && globalUltimate && (
        <SummaryTable.Row heading="Ultimate HQ">
          <AccessibleLink href={companies.detail(globalUltimate.id)}>
            {globalUltimate.name}
          </AccessibleLink>
        </SummaryTable.Row>
      )}

      <WideSummaryTableRow>
        {dnbRelatedCompaniesCount > 0 ? (
          <>
            Data Hub contains{' '}
            <AccessibleLink
              data-test="company-tree-link"
              href={companies.dnbHierarchy.tree(companyId)}
            >
              {pluralize(
                'other company record',
                dnbRelatedCompaniesCount,
                true
              )}
            </AccessibleLink>{' '}
            related to this company
          </>
        ) : (
          'This company is not related to any other company records.'
        )}
      </WideSummaryTableRow>
    </>
  )
}

SubsectionDnBHierarchy.propTypes = {
  isDnbCompany: PropTypes.bool.isRequired,
  isGlobalUltimate: PropTypes.bool.isRequired,
  dnbRelatedCompaniesCount: PropTypes.number.isRequired,
  globalUltimate: PropTypes.object,
}

const SubsidiariesCounter = ({ subsidiariesCount, isGlobalHQ, companyId }) => {
  if (subsidiariesCount) {
    return (
      <AccessibleLink href={companies.subsidiaries.index(companyId)}>
        {pluralize('subsidiary', subsidiariesCount, true)}
      </AccessibleLink>
    )
  }

  if (isGlobalHQ) {
    return (
      <>
        None
        <StyledRowActionLink href={companies.subsidiaries.link(companyId)}>
          Link a subsidiary
        </StyledRowActionLink>
      </>
    )
  }

  return 'None'
}

SubsidiariesCounter.propTypes = {
  subsidiariesCount: PropTypes.number.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
}

const GlobalHQ = ({ company }) => {
  if (!company.headquarterType && !company.globalHeadquarters) {
    return (
      <>
        None
        <StyledRowActionLink href={companies.hierarchies.ghq.link(company.id)}>
          Link to the Global HQ
        </StyledRowActionLink>
      </>
    )
  }

  if (company.globalHeadquarters) {
    return (
      <>
        <AccessibleLink href={setGlobalHQUrl(company.globalHeadquarters)}>
          {company.globalHeadquarters.name}
        </AccessibleLink>
        <StyledRowActionLink
          href={companies.hierarchies.ghq.remove(company.id)}
        >
          Remove link
        </StyledRowActionLink>
      </>
    )
  }
}

GlobalHQ.propTypes = {
  company: PropTypes.object.isRequired,
}

const SubsectionDataHubHierarchy = ({
  company,
  isDnbCompany,
  subsidiariesCount,
  isGlobalHQ,
}) => {
  const showGlobalHQ =
    company.globalHeadquarters ||
    (!company.headquarterType && !company.globalHeadquarters)

  return (
    <>
      <WideSummaryTableRow addPadding={isDnbCompany}>
        This hierarchy information is manually recorded (linked) by Data Hub
        users. This means it can be different from the Dun & Bradstreet
        hierarchy, which in the future will replace this manually recorded
        information.
      </WideSummaryTableRow>

      <SummaryTable.Row heading="Headquarter type" hideWhenEmpty={true}>
        {getHQLabel(company.headquarterType)}
      </SummaryTable.Row>

      {company.headquarterType && (
        <SummaryTable.Row heading="Subsidiaries">
          <SubsidiariesCounter
            isGlobalHQ={isGlobalHQ}
            subsidiariesCount={subsidiariesCount}
            companyId={company.id}
          />
        </SummaryTable.Row>
      )}

      {showGlobalHQ && (
        <SummaryTable.Row heading="Global HQ">
          <GlobalHQ company={company} />
        </SummaryTable.Row>
      )}
    </>
  )
}

SubsectionDataHubHierarchy.propTypes = {
  company: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isGlobalHQ: PropTypes.bool.isRequired,
  subsidiariesCount: PropTypes.number.isRequired,
}

const SectionHierarchy = ({
  company,
  isArchived,
  isDnbCompany,
  subsidiariesCount,
  dnbRelatedCompaniesCount,
  globalUltimate,
}) => {
  const isGlobalHQ = company.headquarterType?.name === 'ghq'
  const isGlobalUltimate = !!company.isGlobalUltimate
  const showDataHubHierarchy =
    company.headquarterType || company.globalHeadquarters || !isDnbCompany

  return (
    <SummaryTable
      caption="Business hierarchy"
      data-test="businessHierarchyDetailsContainer"
      actions={
        !isArchived &&
        showDataHubHierarchy && (
          <AccessibleLink
            href={`${companies.edit(company.id)}#field-headquarter_type`}
            key={company.id}
          >
            Edit
          </AccessibleLink>
        )
      }
    >
      {isDnbCompany && (
        <SubsectionDnBHierarchy
          globalUltimate={globalUltimate}
          isDnbCompany={isDnbCompany}
          isGlobalUltimate={isGlobalUltimate}
          dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
          companyId={company.id}
        />
      )}
      {showDataHubHierarchy && (
        <SubsectionDataHubHierarchy
          company={company}
          isDnbCompany={isDnbCompany}
          isGlobalHQ={isGlobalHQ}
          subsidiariesCount={subsidiariesCount}
        />
      )}
    </SummaryTable>
  )
}

SectionHierarchy.propTypes = {
  company: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
  subsidiariesCount: PropTypes.number.isRequired,
  dnbRelatedCompaniesCount: PropTypes.number.isRequired,
  globalUltimate: PropTypes.object,
}

export default SectionHierarchy
