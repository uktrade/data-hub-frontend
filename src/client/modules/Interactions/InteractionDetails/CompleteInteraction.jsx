import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'govuk-react'

import { GREEN, WHITE } from '../../../../client/utils/colours'

import ArchiveForm from '../../../components/ArchiveForm'
import { FieldDate } from '../../../components'
import { getDetailsLink, getEditLink } from './transformers'
import { ID, TASK_ARCHIVE_INTERACTION } from './state'

const CLIENT_CANCELLED_OPTION = 'Client cancelled'
const DIT_CANCELLED_OPTION = 'DBT cancelled'
const RESCHEDULED_OPTION = 'Meeting was rescheduled'

const CompleteInteraction = ({
  interactionId,
  companyObject,
  companyArray,
  kind,
  archived,
}) => {
  return (
    <>
      <Button
        as={'a'}
        href={getEditLink(interactionId, companyObject, companyArray)}
        buttonColour={GREEN}
        buttonTextColour={WHITE}
        data-test="complete-interaction-button"
      >
        Complete {kind}
      </Button>
      <ArchiveForm
        id={ID}
        submissionTaskName={TASK_ARCHIVE_INTERACTION}
        type={kind}
        isArchived={archived}
        transformPayload={(values) => ({
          values,
          interactionId,
        })}
        flashMessage={() => `The interaction has been updated`}
        redirectUrl={getDetailsLink(interactionId, companyObject, companyArray)}
        analyticsFormName="archiveInteraction"
        buttonText="Cancel"
        archiveReasons={[
          {
            label: CLIENT_CANCELLED_OPTION,
            value: CLIENT_CANCELLED_OPTION,
          },
          {
            label: DIT_CANCELLED_OPTION,
            value: DIT_CANCELLED_OPTION,
          },
          {
            label: RESCHEDULED_OPTION,
            value: RESCHEDULED_OPTION,
            children: (
              <FieldDate
                name="date"
                label="When will the meeting take place?"
                required="You must enter a valid date"
                hint="This will change the date of the interaction rather than cancelling it."
              />
            ),
          },
        ]}
      />
    </>
  )
}

CompleteInteraction.propTypes = {
  interactionId: PropTypes.string.isRequired,
  companyObject: PropTypes.object.isRequired,
  companyArray: PropTypes.array.isRequired,
  kind: PropTypes.string.isRequired,
  archived: PropTypes.bool.isRequired,
}

export default CompleteInteraction
