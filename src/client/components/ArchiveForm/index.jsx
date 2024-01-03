import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import { kebabCase } from 'lodash'

import { BLACK, GREY_3 } from '../../../client/utils/colours'
import { FieldRadios, FieldInput, SectionHeader } from '..'

import Form from '../Form'

const CANCELLATION_LABEL = 'Cancellation reason'
const ARCHIVE_LABEL = 'Archive'
const SUBMIT_LABEL = 'Submit'

const defaultHint = (type) =>
  `Archive this ${type} if it is no longer required or active.`
const interactionHint = (type) =>
  `Cancel this ${type} if the meeting did not happen`

const isInteraction = (type) =>
  type === 'interaction' || type === 'service delivery'

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

  return isInteraction(type) ? options : options.concat(otherOption)
}

const getTopHint = (type) =>
  isInteraction(type) ? interactionHint(type) : defaultHint(type)

const getRadioButtonLabel = (type) =>
  isInteraction(type) ? CANCELLATION_LABEL : ARCHIVE_LABEL + ' reason'

const showCancelLink = (type, redirectUrl) =>
  isInteraction(type) ? null : () => redirectUrl

const getSubmitLabel = (type) =>
  isInteraction(type) ? SUBMIT_LABEL : ARCHIVE_LABEL

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
  buttonText = ARCHIVE_LABEL,
}) => {
  const [formIsOpen, setFormIsOpen] = useState(false)

  if (isArchived || isDnbCompany) {
    return null
  }

  return (
    <div data-test={kebabCase(`archive-${type}-container`)}>
      <SectionHeader type="archive">{`${buttonText} ${type}`}</SectionHeader>

      <p data-test="archive-hint">{getTopHint(type)}</p>

      {formIsOpen && (
        <Form
          id={id}
          submissionTaskName={submissionTaskName}
          transformPayload={transformPayload}
          submitButtonLabel={getSubmitLabel(type)}
          redirectTo={() => redirectUrl}
          analyticsFormName={analyticsFormName}
          cancelRedirectTo={showCancelLink(type, redirectUrl)}
          flashMessage={flashMessage}
        >
          <FieldRadios
            label={getRadioButtonLabel(type)}
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
