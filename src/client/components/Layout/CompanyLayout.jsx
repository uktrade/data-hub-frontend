import React from 'react'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { CompanyLocalHeader, CompanyTabbedLocalNavigation, Main } from '..'
import CompanyInvestmentSubNavigation from '../CompanyTabbedLocalNavigation/CompanyInvestmentTab'

const CompanyLayout = ({
  company,
  flashMessages,
  breadcrumbs,
  children,
  returnUrl,
  isInvestment = false,
  isLCP = false,
}) => (
  <>
    <CompanyLocalHeader
      breadcrumbs={breadcrumbs}
      flashMessages={flashMessages}
      company={company}
      returnUrl={returnUrl}
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
  </>
)

CompanyLayout.propTypes = {
  company: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  isInvestment: PropTypes.bool,
  isLCP: PropTypes.bool,
}

export default CompanyLayout