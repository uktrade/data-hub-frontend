import React from 'react'
import { useParams } from 'react-router-dom'

import {
  CompanyResource,
  LargeInvestorProfileResource,
} from '../../../../components/Resource'
import CompanyLayoutNew from '../../../../components/Layout/CompanyLayoutNew'
import DefaultLayoutBase from '../../../../components/Layout/DefaultLayoutBase'

import CreateLargeCapitalProfile from './CreateLargeCapitalProfile'
import EditLargeCapitalProfile from './EditLargeCapitalProfile'

const LargeCapitalProfile = ({ flashMessages }) => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <LargeInvestorProfileResource id={companyId}>
        {(profile) => (
          <CompanyResource id={companyId}>
            {(company) => (
              <CompanyLayoutNew
                company={company}
                breadcrumbs={[{ text: 'Investments' }]}
                flashMessages={flashMessages}
                isInvestment={true}
                isLCP={true}
                pageTitle="Large capital profile"
              >
                {profile.results.length != 0 ? (
                  <EditLargeCapitalProfile profile={profile} />
                ) : (
                  <CreateLargeCapitalProfile companyId={companyId} />
                )}
              </CompanyLayoutNew>
            )}
          </CompanyResource>
        )}
      </LargeInvestorProfileResource>
    </DefaultLayoutBase>
  )
}

export default LargeCapitalProfile
