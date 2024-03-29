import React from 'react'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { CompanyLocalHeader, CompanyTabbedLocalNavigation, Main } from '..'
import CompanyInvestmentSubNavigation from '../CompanyTabbedLocalNavigation/CompanyInvestmentTab'
import WatchTextContent from '../WatchTextContent'

const CompanyLayout = ({
  company,
  breadcrumbs,
  children,
  flashMessages,
  pageTitle,
  isInvestment = false,
  isLCP = false,
}) => (
  <>
    <WatchTextContent
      onTextContentChange={(text) => {
        document.title = text
      }}
    >
      {pageTitle} - {company.name} - Companies - DBT Data Hub
    </WatchTextContent>
    <CompanyLocalHeader
      breadcrumbs={breadcrumbs}
      flashMessages={flashMessages}
      company={company}
    />
    <Main>
      <CompanyTabbedLocalNavigation company={company} />
      {isInvestment && (
        <CompanyInvestmentSubNavigation companyId={company.id} isLCP={isLCP} />
      )}
      <GridRow>
        <GridCol>{children}</GridCol>
      </GridRow>
    </Main>
    <br />
  </>
)

CompanyLayout.propTypes = {
  company: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  isInvestment: PropTypes.bool,
  isLCP: PropTypes.bool,
}

export default CompanyLayout
