import _ from 'lodash'
import React from 'react'

import CapitalInvestmentRequiredChecksConductedResource from '../../Resource/CapitalInvestmentRequiredChecksConducted'
import FieldRadios from './FieldRadios'

const FieldCapitalInvestmentRequiredChecksConductedRadios = ({ ...props }) => (
  <CapitalInvestmentRequiredChecksConductedResource>
    {(checksConducted) => (
      <FieldRadios
        {...props}
        options={checksConducted.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
      />
    )}
  </CapitalInvestmentRequiredChecksConductedResource>
)

FieldCapitalInvestmentRequiredChecksConductedRadios.propTypes = _.omit(
  FieldRadios.propTypes,
  'options'
)

export default FieldCapitalInvestmentRequiredChecksConductedRadios
