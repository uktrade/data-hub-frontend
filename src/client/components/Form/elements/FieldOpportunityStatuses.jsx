import _ from 'lodash'
import React from 'react'

import FieldRadios from './FieldRadios'
import OpportunityStatusesResource from '../../Resource/OpportunityStatuses'

// TODO: Refactor with ResourceOptionsField
const FieldOpportunityStatuses = (props) => (
  <OpportunityStatusesResource>
    {(statuses) => (
      <FieldRadios
        required="You must select a status"
        {...props}
        options={statuses.map(({ id, name }) => ({ value: id, label: name }))}
      />
    )}
  </OpportunityStatusesResource>
)

FieldOpportunityStatuses.propTypes = {
  ..._.omit(FieldRadios.propTypes, 'options'),
}

export default FieldOpportunityStatuses
