import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { CompanyLocalHeader, CompanyTabbedLocalNavigation, Main } from '..'
import CompanyInvestmentSubNavigation from '../CompanyTabbedLocalNavigation/CompanyInvestmentTab'

const CompanyLayoutNew = ({
  company,
  breadcrumbs,
  children,
  returnUrl,
  flashMessages,
  pageTitle,
  isInvestment = false,
  isLCP = false,
}) => {
  useEffect(() => {
    document.title = `${pageTitle} - ${company.name} - Companies - DBT Data Hub`
  }, [`${pageTitle} - ${company.name} - Companies - DBT Data Hub`])
  return (
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
          <CompanyInvestmentSubNavigation
            companyId={company.id}
            isLCP={isLCP}
          />
        )}
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Main>
    </>
  )
}

CompanyLayoutNew.propTypes = {
  company: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  isInvestment: PropTypes.bool,
  isLCP: PropTypes.bool,
}

export default CompanyLayoutNew
