import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom-v5-compat'

import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import ProjectsCollection from '../../Investments/Projects/ProjectsCollection'
import { state2props } from '../../Investments/Projects/state'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

const CompanyProjectsCollection = ({ ...props }) => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Investment' }]}
            isInvestment={true}
            pageTitle="Investments"
          >
            <ProjectsCollection company={company} {...props} />
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(state2props)(CompanyProjectsCollection)
