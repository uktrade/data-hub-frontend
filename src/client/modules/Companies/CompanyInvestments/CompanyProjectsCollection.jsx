import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { CompanyResource } from '../../../components/Resource'
import CompanyLayoutNew from '../../../components/Layout/CompanyLayoutNew'
import ProjectsCollection from '../../Investments/Projects/ProjectsCollection'
import { state2props } from '../../Investments/Projects/state'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'

const CompanyProjectsCollection = ({ returnUrl, ...props }) => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayoutNew
            company={company}
            breadcrumbs={[{ text: 'Investment' }]}
            returnUrl={returnUrl}
            isInvestment={true}
            pageTitle="Investments"
          >
            <ProjectsCollection company={company} {...props} />
          </CompanyLayoutNew>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(state2props)(CompanyProjectsCollection)
