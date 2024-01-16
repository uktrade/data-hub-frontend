import React from 'react'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { CompanyTabbedLocalNavigation, Main } from '..'
import CompanyInvestmentSubNavigation from '../CompanyTabbedLocalNavigation/CompanyInvestmentTab'
import CompanyLocalHeader from '../CompanyLocalHeader'

const CompanyLayoutNew = ({
  company,
  breadcrumbs,
  children,
  returnUrl,
  flashMessages,
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

CompanyLayoutNew.propTypes = {
  company: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  isInvestment: PropTypes.bool,
  isLCP: PropTypes.bool,
}

export default CompanyLayoutNew
