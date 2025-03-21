import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { omitBy, isUndefined } from 'lodash'

import { useFormContext } from '../../../../../client/components/Form/hooks'
import { FieldRadios } from '../../../../../client/components'
import { KINDS } from '../../../constants'

const StepCompanyExportInteractionType = () => {
  const { resetFields, getFieldState } = useFormContext()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.endsWith('/interactions/create')) {
      // If we do not clean up, then the form values object contains keys and values
      // relevant to the initial form interaction, as the user completes the form
      // a second time some keys and values are overwritten, others are not, the
      // latter causes problems with API validation when saving the form as the
      // wrong keys are sent as part of the payload, which ultimately means the
      // user cannot save the form (HTTP 400), meaning they have to start over.
      // Therefore, the cleanest approach is to reset the fields within the form
      // the moment the users lands on the "Add interaction ..." page:

      const theme = 'export'
      const kind = getFieldState('kind').value
      const previousSelection = omitBy({ theme, kind }, isUndefined)

      return resetFields(previousSelection)
    }
  }, [location.pathname])

  return (
    <>
      <FieldRadios
        label="What would you like to record?"
        name="kind"
        dataTestPrefix="export"
        required="Select interaction type"
        options={[
          {
            label: 'A standard interaction',
            hint: 'For example, an email, phone call or meeting',
            value: KINDS.INTERACTION,
          },
          {
            label: 'A service you have provided',
            hint: 'For example, a significant assist or event',
            value: KINDS.SERVICE_DELIVERY,
          },
        ]}
      />
    </>
  )
}

export default StepCompanyExportInteractionType
