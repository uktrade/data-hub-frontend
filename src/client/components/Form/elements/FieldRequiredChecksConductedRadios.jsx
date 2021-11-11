import _ from 'lodash'
import React from 'react'

import RequiredChecksConductedResource from '../../Resource/RequiredChecksConducted'
import FieldRadios from './FieldRadios'

const RequiredChecksConductedRadios = ({ ...props }) => (
  <RequiredChecksConductedResource>
    {(checksConducted) => (
      <FieldRadios
        {...props}
        options={checksConducted.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
      />
    )}
  </RequiredChecksConductedResource>
)

RequiredChecksConductedRadios.propTypes = _.omit(
  FieldRadios.propTypes,
  'options'
)

export default RequiredChecksConductedRadios
