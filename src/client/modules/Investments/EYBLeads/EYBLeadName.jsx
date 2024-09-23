import React from 'react'

import { EYBLeadResource } from '../../../components/Resource'

const EYBLeadName = (props) => (
  <EYBLeadResource.Inline {...props}>
    {(eybLead) => eybLead.company.name}
  </EYBLeadResource.Inline>
)

export default EYBLeadName
