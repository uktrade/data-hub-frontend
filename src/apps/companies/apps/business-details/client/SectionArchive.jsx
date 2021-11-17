import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, GREY_3 } from 'govuk-colours'
import Button from '@govuk-react/button'
import { ButtonLink } from '../../../../../client/components/'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'

import {
  FormActions,
  FieldRadios,
  FieldInput,
} from '../../../../../client/components'

import TaskForm from '../../../../../client/components/Task/Form'

import { ID, TASK_ARCHIVE_COMPANY } from './state'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const SectionArchive = ({ isArchived, isDnbCompany, urls }) => {
  const [formIsOpen, setFormIsOpen] = useState(false)

  if (isArchived || isDnbCompany) {
    return null
  }

  return (
    <div data-test="archiveCompanyContainer">
      <StyledSectionHeader>Archive company</StyledSectionHeader>

      <p>Archive this company if it is no longer required or active.</p>

      {formIsOpen && (
        <TaskForm
          id={ID}
          submissionTaskName={TASK_ARCHIVE_COMPANY}
          transformPayload={(values) => ({
            values,
            urls,
          })}
          redirectTo={() => urls.companyBusinessDetails}
          analyticsFormName="archive-company"
        >
          <FieldRadios
            label="Archive reason"
            name="archived_reason"
            required="Select a reason"
            options={[
              { label: 'Company is dissolved', value: 'Company is dissolved' },
              {
                label: 'Other',
                value: 'Other',
                children: (
                  <FieldInput
                    type="text"
                    label="Other"
                    name="archived_reason_other"
                  />
                ),
              },
            ]}
          />

          <FormActions>
            <Button>Archive</Button>
            <ButtonLink onClick={() => setFormIsOpen(false)}>Cancel</ButtonLink>
          </FormActions>
        </TaskForm>
      )}

      {!formIsOpen && (
        <Button
          onClick={() => setFormIsOpen(true)}
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
        >
          Archive
        </Button>
      )}
    </div>
  )
}

SectionArchive.propTypes = {
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionArchive
