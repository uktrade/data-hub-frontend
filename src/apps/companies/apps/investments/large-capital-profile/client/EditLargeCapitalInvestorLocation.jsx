import React from 'react'
import PropTypes from 'prop-types'
import { FormLayout } from '../../../../../../client/components'
import { FORM_LAYOUT } from '../../../../../../common/constants'

const EditLargeCapitalInvestorLocation = ({}) => {
  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      Edit Large Capital Investor Location HERE
    </FormLayout>
  )
}

EditLargeCapitalInvestorLocation.prototype = {
  profileId: PropTypes.string.isRequired,
}

export default EditLargeCapitalInvestorLocation
