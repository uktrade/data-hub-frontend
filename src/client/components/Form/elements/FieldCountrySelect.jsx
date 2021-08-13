import _ from 'lodash'
import React from 'react'

import CountriesResource from '../../Resource/Countries'
import FieldSelect from './FieldSelect'

const FieldCountrySelect = (props) => (
  <CountriesResource>
    {(countries) => (
      <FieldSelect
        label="Country"
        {...props}
        options={countries.map(({ name, id }) => ({ label: name, value: id }))}
      />
    )}
  </CountriesResource>
)

FieldCountrySelect.propTypes = _.omit(FieldSelect.propTypes, 'options')

export default FieldCountrySelect
