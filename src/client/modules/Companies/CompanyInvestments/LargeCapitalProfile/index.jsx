import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import {
  CompanyResource,
  LargeInvestorProfileResource,
} from '../../../../components/Resource'
import CompanyLayout from '../../../../components/Layout/CompanyLayout'
import DefaultLayoutBase from '../../../../components/Layout/DefaultLayoutBase'

import CreateLargeCapitalProfile from './CreateLargeCapitalProfile'
import EditLargeCapitalProfile from './EditLargeCapitalProfile'

const LargeCapitalProfile = () => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <LargeInvestorProfileResource id={companyId}>
        {(profile) => (
          <CompanyResource id={companyId}>
            {(company) => (
              <CompanyLayout
                company={company}
                breadcrumbs={[{ text: 'Investments' }]}
                isInvestment={true}
                isLCP={true}
                pageTitle="Large capital profile"
              >
                {profile.results.length != 0 ? (
                  <EditLargeCapitalProfile profile={profile} />
                ) : (
                  <CreateLargeCapitalProfile companyId={companyId} />
                )}
              </CompanyLayout>
            )}
          </CompanyResource>
        )}
      </LargeInvestorProfileResource>
    </DefaultLayoutBase>
  )
}

export default LargeCapitalProfile
