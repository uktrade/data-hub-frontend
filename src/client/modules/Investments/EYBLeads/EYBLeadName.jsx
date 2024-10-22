import React from 'react'

import { EYBLeadResource } from '../../../components/Resource'
import NOT_SET_TEXT from '../../../../apps/companies/constants'

const EYBLeadName = (props) => (
  <EYBLeadResource.Inline {...props}>
    {(eybLead) => (eybLead.company ? eybLead.company.name : NOT_SET_TEXT)}
  </EYBLeadResource.Inline>
)

export default EYBLeadName
