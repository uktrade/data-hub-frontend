import React from 'react'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import { CompanyLocalHeader2, CompanyTabbedLocalNavigation, Main } from '..'

const CompanyLayout = ({
  company,
  flashMessages,
  breadcrumbs,
  dnbRelatedCompaniesCount,
  children,
  returnUrl,
  localNavItems,
}) => {
  return (
    <>
      <CompanyLocalHeader2
        breadcrumbs={breadcrumbs}
        flashMessages={flashMessages}
        company={company}
        dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
        returnUrl={returnUrl}
      />
      <Main>
        <CompanyTabbedLocalNavigation
          localNavItems={localNavItems}
          company={company}
        />
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Main>
    </>
  )
}

CompanyLayout.propTypes = {
  company: PropTypes.object.isRequired,
  permissions: PropTypes.array.isRequired,
  children: PropTypes.element.isRequired,
}

export default CompanyLayout
