import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { H2, SectionBreak } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import pluralize from 'pluralize'
import styled from 'styled-components'

import { SummaryTable, ToggleSection } from '../../../../components'
import {
  CompanyResource,
  LargeInvestorProfileResource,
} from '../../../../components/Resource'
import { RED } from '../../../../utils/colours'
import CompanyLayout from '../../../../components/Layout/CompanyLayout'

import ProfileDetailsTable from './ProfileDetailsTable'
import EditProfileDetails from './EditProfileDetails'
import ProfileRequirementsTable from './ProfileRequirementsTable'
import EditRequirementsForm from './EditRequirementsForm'
import ProfileLocationTable from './ProfileLocationTable'
import EditLocationForm from './EditLocationForm'
import CreateLargeCapitalProfile from './CreateLargeCapitalProfile'

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 18px;
  margin: 10px 5px 5px;
  color: ${RED};
`

const IncompleteFieldsBadge = (incompleteFieldCount, id) => {
  const badgeText =
    incompleteFieldCount === 0
      ? 'Complete'
      : `${pluralize('field', incompleteFieldCount, true)} incomplete`

  return (
    <StyledLabel data-test={`${id}-incomplete-fields`}>{badgeText}</StyledLabel>
  )
}

const ProfileSection = ({
  incompleteFields,
  toggleName,
  id,
  children,
  form,
  isEditing,
  onEdit,
}) => (
  <>
    <ToggleSection
      label={toggleName}
      id={`${id}_toggle`}
      badge={IncompleteFieldsBadge(incompleteFields.length, id)}
      justifyHeaderContent={true}
    >
      {isEditing ? (
        <>{form}</>
      ) : (
        <>
          <SummaryTable data-test={`${id}-table`}>{children}</SummaryTable>
          <Button onClick={() => onEdit(true)} data-test={`${id}_button`}>
            Edit
          </Button>
        </>
      )}
    </ToggleSection>
    <SectionBreak />
  </>
)

const LargeCapitalProfile = ({
  companyId,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
}) => {
  const [detailsFormIsOpen, setDetailsFormIsOpen] = useState(false)
  const [requirementsFormIsOpen, setRequirementsFormIsOpen] = useState(false)
  const [locationFormIsOpen, setLocationFormIsOpen] = useState(false)
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
                <>
                  <H2 size={LEVEL_SIZE[3]}>Large capital investor profile</H2>
                  <ProfileSection
                    incompleteFields={
                      profile.results[0].incompleteDetailsFields
                    }
                    form={<EditProfileDetails profile={profile.results[0]} />}
                    toggleName="Investor details"
                    id="investor_details"
                    isEditing={detailsFormIsOpen}
                    onEdit={setDetailsFormIsOpen}
                  >
                    <ProfileDetailsTable profile={profile.results[0]} />
                  </ProfileSection>
                  <ProfileSection
                    incompleteFields={
                      profile.results[0].incompleteRequirementsFields
                    }
                    form={<EditRequirementsForm profile={profile.results[0]} />}
                    toggleName="Investor requirements"
                    id="investor_requirements"
                    isEditing={requirementsFormIsOpen}
                    onEdit={setRequirementsFormIsOpen}
                  >
                    <ProfileRequirementsTable profile={profile.results[0]} />
                  </ProfileSection>
                  <ProfileSection
                    incompleteFields={
                      profile.results[0].incompleteLocationFields
                    }
                    form={<EditLocationForm profile={profile.results[0]} />}
                    toggleName="Location"
                    id="location"
                    isEditing={locationFormIsOpen}
                    onEdit={setLocationFormIsOpen}
                  >
                    <ProfileLocationTable profile={profile.results[0]} />
                  </ProfileSection>
                </>
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
