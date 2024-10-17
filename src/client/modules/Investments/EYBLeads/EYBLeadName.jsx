import React from 'react'

import { EYBLeadResource } from '../../../components/Resource'

const EYBLeadName = (props) => (
  <EYBLeadResource.Inline {...props}>
    {(eybLead) => (eybLead.company ? eybLead.company.name : 'Not set')}
  </EYBLeadResource.Inline>
)

export default EYBLeadName
