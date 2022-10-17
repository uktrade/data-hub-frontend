import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { BLACK, GREY_3 } from 'govuk-colours'
import Button from '@govuk-react/button'
import { kebabCase } from 'lodash'

import { FieldRadios, FieldInput, SectionHeader } from '..'

import Form from '../Form'

const buttonText = 'Archive'

const buildOptions = (type, options) => {
  const isContact = type === 'contact' ? true : false
  const otherOption = [
    {
      label: 'Other',
      value: 'Other',
      children: (
        <FieldInput
          type="text"
          label="Other"
          name="archived_reason_other"
          required={isContact ? 'You must enter a reason' : null}
        />
      ),
    },
  ]

  return options.concat(otherOption)
}

const ArchiveForm = ({
  id,
  submissionTaskName,
  type,
  isArchived,
  isDnbCompany,
  analyticsFormName,
  redirectUrl,
  transformPayload,
  archiveReasons,
  radioHint,
  flashMessage = null,
}) => {
  const [formIsOpen, setFormIsOpen] = useState(false)

  if (isArchived || isDnbCompany) {
    return null
  }

  return (
    <div data-test={kebabCase(`archive-${type}-container`)}>
      <SectionHeader type="archive">{`Archive ${type}`}</SectionHeader>

      <p data-test="archive-hint">
        Archive this {type} if it is no longer required or active.
      </p>

      {formIsOpen && (
        <Form
          id={id}
          submissionTaskName={submissionTaskName}
          transformPayload={transformPayload}
          submitButtonLabel={buttonText}
          redirectTo={() => redirectUrl}
          analyticsFormName={analyticsFormName}
          cancelRedirectTo={() => redirectUrl}
          flashMessage={flashMessage}
        >
          <FieldRadios
            label="Archive reason"
            name="archived_reason"
            required="You must select a reason"
            hint={radioHint}
            options={buildOptions(type, archiveReasons)}
          />
        </Form>
      )}

      {!formIsOpen && (
        <Button
          onClick={() => setFormIsOpen(true)}
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
          data-test="archive-button"
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}

ArchiveForm.propTypes = {
  type: PropTypes.string.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool,
  id: PropTypes.string.isRequired,
  submissionTaskName: PropTypes.string.isRequired,
  analyticsFormName: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  transformPayload: PropTypes.func.isRequired,
  archiveReasons: PropTypes.array.isRequired,
}

export default ArchiveForm
