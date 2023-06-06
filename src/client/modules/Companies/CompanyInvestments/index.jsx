import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import { state2props } from './state'
import TabNav from '../../../components/TabNav'
import urls from '../../../../lib/urls'
import ProjectsCollection from '../../../../apps/investments/client/projects/ProjectsCollection'
import LargeCapitalProfile from './LargeCapitalProfile'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'

const CompanyInvestment = ({
  companyId,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
}) => (
  <Route>
    {() => (
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[
              { link: urls.dashboard(), text: 'Home' },
              {
                link: urls.companies.index(),
                text: 'Companies',
              },
              { link: urls.companies.detail(company.id), text: company.name },
              { text: 'Investments' },
            ]}
            dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
            localNavItems={localNavItems}
            flashMessages={flashMessages}
          >
            <TabNav
              id="investment-tab-nav"
              label="Investment tab nav"
              routed={true}
              tabs={{
                [urls.companies.investments.companyInvestmentProjects(
                  companyId
                )]: {
                  label: 'Investments',
                  content: <ProjectsCollection company={company} />,
                },
                [urls.companies.investments.largeCapitalProfile(companyId)]: {
                  label: 'Large capital profile',
                  content: <LargeCapitalProfile companyId={companyId} />,
                },
              }}
            />
          </CompanyLayout>
        )}
      </CompanyResource>
    )}
  </Route>
)

CompanyInvestment.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default connect(state2props)(CompanyInvestment)
