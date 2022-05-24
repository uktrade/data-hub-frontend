import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BLACK, GREY_3 } from 'govuk-colours'
import Button from '@govuk-react/button'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import { kebabCase } from 'lodash'

import { FieldRadios, FieldInput } from '../../../../../client/components'

import Form from '../../../../../client/components/Form'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`
const buttonText = 'Archive'

const SectionArchive = ({
  id,
  submissionTaskName,
  type,
  isArchived,
  isDnbCompany,
  analyticsFormName,
  redirectUrl,
  transformPayload,
  archiveReasons,
}) => {
  const [formIsOpen, setFormIsOpen] = useState(false)

  if (isArchived || isDnbCompany) {
    return null
  }

  return (
    <div data-test={kebabCase(`archive-${type}-container`)}>
      <StyledSectionHeader>Archive {type}</StyledSectionHeader>

      <p>Archive this {type} if it is no longer required or active.</p>

      {formIsOpen && (
        <Form
          id={id}
          submissionTaskName={submissionTaskName}
          transformPayload={transformPayload}
          submitButtonLabel={buttonText}
          redirectTo={() => redirectUrl}
          analyticsFormName={analyticsFormName}
          cancelRedirectTo={() => redirectUrl}
        >
          <FieldRadios
            label="Archive reason"
            name="archived_reason"
            required="Select a reason"
            options={[
              archiveReasons,
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
        </Form>
      )}

      {!formIsOpen && (
        <Button
          onClick={() => setFormIsOpen(true)}
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}

SectionArchive.propTypes = {
  type: PropTypes.string.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool,
  id: PropTypes.string.isRequired,
  submissionTaskName: PropTypes.string.isRequired,
  analyticsFormName: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  transformPayload: PropTypes.func.isRequired,
  archiveReasons: PropTypes.object.isRequired,
}

export default SectionArchive
