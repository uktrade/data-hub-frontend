import _ from 'lodash'
import React from 'react'

import ConstructionRisksResource from '../../Resource/ConstructionRisks'
import FieldRadios from './FieldRadios'

const FieldConstructionRiskRadios = ({ ...props }) => (
  <ConstructionRisksResource>
    {(constructionRisks) => (
      <FieldRadios
        {...props}
        legend="Construction risk"
        options={constructionRisks.map(({ name, id }) => ({
          value: id,
          label: name,
        }))}
      />
    )}
  </ConstructionRisksResource>
)

FieldConstructionRiskRadios.propTypes = _.omit(
  FieldRadios.propTypes,
  'options',
  'legend'
)

export default FieldConstructionRiskRadios
