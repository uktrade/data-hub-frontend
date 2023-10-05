import React from 'react'
import PropTypes from 'prop-types'

import {
  CompanyResource,
  LargeInvestorProfileResource,
} from '../../../../components/Resource'
import CompanyLayout from '../../../../components/Layout/CompanyLayout'

import CreateLargeCapitalProfile from './CreateLargeCapitalProfile'
import EditLargeLapitalProfile from './EditLargeLapitalProfile'

const LargeCapitalProfile = ({
  companyId,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
}) => {
  return (
    <LargeInvestorProfileResource id={companyId}>
      {(profile) => (
        <CompanyResource id={companyId}>
          {(company) => (
            <CompanyLayout
              company={company}
              breadcrumbs={[{ text: 'Investments' }]}
              dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
              localNavItems={localNavItems}
              flashMessages={flashMessages}
              isInvestment={true}
              isLCP={true}
            >
              {profile.results.length != 0 ? (
                <EditLargeLapitalProfile profile={profile} />
              ) : (
                <CreateLargeCapitalProfile companyId={companyId} />
              )}
            </CompanyLayout>
          )}
        </CompanyResource>
      )}
    </LargeInvestorProfileResource>
  )
}

LargeCapitalProfile.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default LargeCapitalProfile
