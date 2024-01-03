import React from 'react'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { CompanyTabbedLocalNavigation, DefaultLayout } from '..'
import CompanyInvestmentSubNavigation from '../CompanyTabbedLocalNavigation/CompanyInvestmentTab'
import { buildCompanyBreadcrumbs } from '../../modules/Companies/utils'
import CompanyLocalHeaderNew from '../CompanyLocalHeader/CompanyLocalHeaderNew'

const CompanyLayoutNew = ({
  company,
  breadcrumbs,
  children,
  returnUrl,
  pageTitle,
  isInvestment = false,
  isLCP = false,
}) => (
  <DefaultLayout
    heading={company && company.name}
    pageTitle={`${pageTitle} - ${company && company.name} - Companies`}
    breadcrumbs={buildCompanyBreadcrumbs(breadcrumbs, company.id, company.name)}
    useReactRouter={false}
    localHeaderChildren={
      company && (
        <CompanyLocalHeaderNew company={company} returnUrl={returnUrl} />
      )
    }
  >
    <CompanyTabbedLocalNavigation company={company} />
    {isInvestment && (
      <CompanyInvestmentSubNavigation companyId={company.id} isLCP={isLCP} />
    )}
    <GridRow>
      <GridCol>{children}</GridCol>
    </GridRow>
  </DefaultLayout>
)

CompanyLayoutNew.propTypes = {
  company: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  isInvestment: PropTypes.bool,
  isLCP: PropTypes.bool,
}

export default CompanyLayoutNew
