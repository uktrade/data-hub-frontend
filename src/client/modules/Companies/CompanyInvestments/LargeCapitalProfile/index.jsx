import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { H2, SectionBreak } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import pluralize from 'pluralize'
import styled from 'styled-components'

import { SummaryTable, ToggleSection } from '../../../../components'
import LargeInvestorProfileResource from '../../../../components/Resource/LargeInvestorProfile'
import { RED } from '../../../../utils/colours'
import ProfileDetailsTable from './ProfileDetailsTable'
import EditLargeCapitalInvestorDetails from './EditProfileDetails'
import ProfileRequirementsTable from './ProfileRequirementsTable'
import EditRequirementsForm from './EditRequirementsForm'
import ProfileLocationTable from './ProfileLocationTable'
import EditLocationForm from './EditLocationForm'

const StyledLabel = styled('label')`
  display: inline-table;
  background: transparent;
  border: none;
  font-size: 18px;
  margin: 10px 5px 5px;
  color: ${RED};
`

const IncompleteFieldsBadge = (incompleteFieldCount) => {
  const badgeText =
    incompleteFieldCount === 0
      ? 'Complete'
      : `${pluralize('field', incompleteFieldCount, true)} incomplete`

  return <StyledLabel>{badgeText}</StyledLabel>
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
      badge={IncompleteFieldsBadge(incompleteFields.length)}
      justifyHeaderContent={true}
    >
      {isEditing ? (
        <>{form}</>
      ) : (
        <>
          <SummaryTable>{children}</SummaryTable>
          <Button onClick={() => onEdit(true)} data-test={`${id}_button`}>
            Edit
          </Button>
        </>
      )}
    </ToggleSection>
    <SectionBreak />
  </>
)

const LargeCapitalProfile = ({ companyId }) => {
  const [detailsFormIsOpen, setDetailsFormIsOpen] = useState(false)
  const [requirementsFormIsOpen, setRequirementsFormIsOpen] = useState(false)
  const [locationFormIsOpen, setLocationFormIsOpen] = useState(false)
  return (
    <LargeInvestorProfileResource id={companyId}>
      {(profile) => (
        <>
          {profile.results.length != 0 ? (
            <>
              <H2 size={LEVEL_SIZE[3]}>Large capital investor profile</H2>
              <ProfileSection
                incompleteFields={profile.results[0].incompleteDetailsFields}
                form={
                  <EditLargeCapitalInvestorDetails
                    profileId={profile.results[0].id}
                    companyId={profile.results[0].investorCompany.id}
                    investorDetails={profile.results[0]}
                  />
                }
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
                form={
                  <EditRequirementsForm
                    companyId={profile.results[0].investorCompany.id}
                  />
                }
                toggleName="Investor requirements"
                id="investor_requirements"
                isEditing={requirementsFormIsOpen}
                onEdit={setRequirementsFormIsOpen}
              >
                <ProfileRequirementsTable profile={profile.results[0]} />
              </ProfileSection>
              <ProfileSection
                incompleteFields={profile.results[0].incompleteLocationFields}
                form={<EditLocationForm companyId={companyId} />}
                toggleName="Location"
                id="location"
                isEditing={locationFormIsOpen}
                onEdit={setLocationFormIsOpen}
              >
                <ProfileLocationTable
                  companyId={profile.results[0].investorCompany.id}
                />
              </ProfileSection>
            </>
          ) : (
            <p>Placeholder for create profile code</p>
          )}
        </>
      )}
    </LargeInvestorProfileResource>
  )
}

LargeCapitalProfile.propTypes = {
  interactionId: PropTypes.string.isRequired,
}

export default LargeCapitalProfile
