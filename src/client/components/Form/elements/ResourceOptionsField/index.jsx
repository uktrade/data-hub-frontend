import React from 'react'
import PropTypes from 'prop-types'

import { idNamesToValueLabels } from '../../../../utils'
import Resource from '../../../Resource/Resource'

/**
 * @function ResourceOptionsField
 * @description Makes it easy to convert an _options form field_ (a field which
 * presents the user a number of options to the user) into a field, which
 * resolve its options with a _resource_ or a _task_.
 * You need to either specify {props.resource} or {props.taskName}.
 * All other props not specified here will be forwarded to the field component
 * passed to {props.field}.
 * @type {import("./types").ResourceOptionsField} Form
 * @typedef {import("./types").Props} Props
 * @param {Object} props
 * @param {Function} [props.field] - The _options form field_ to be wrapped.
 * @param {Function} [props.resource] - A particular _resource_ component which
 * represents a specific resource.
 * @param {string} [props.taskName] - The name of the _task_ to use instead of
 * a {resource}.
 * @param {string} [props.id] - ID for the _task_ or _resource_. This prop is
 * required with if {props.taskName} is used and optional with {props.resource}.
 * @param {any} [props.payload] - The optional ID
 * @param {Props['resultToOptions']} [props.resultToOptions=idNamesToValueLabels]
 * - Use this to transform the _task_/_resource_ result to the field options.
 * @param {Props['interceptOption']} [props.interceptOption] - A function that
 * will be called for each option already resolved with {props.resultToOptions}
 * and should return the tweaked option. Allows you to tweak the optios e.g.
 * to add children or hint to it.
 * @example
 * import CountriesResource from '../Resource'
 * import FieldSelect from '../Form/elements/FieldSelect'
 *
 * const FieldCountriesSelect = (props) =>
 *  <ResourceOptionsField
 *    {...props}
 *    resource={CountriesResource}
 *    field={FieldSelect}
 *  />
 */
const ResourceOptionsField = ({
  id = '__RESOURCE_OPTIONS__',
  field: Field,
  resource: Rsrc = Resource,
  payload = { _: '0' },
  // Only required when Resource is not specified
  taskName,
  resultToOptions = idNamesToValueLabels,
  interceptOption = (x) => x,
  ...props
}) => (
  <Rsrc {...{ name: taskName, id, payload }} progressBox={true}>
    {(result) => (
      <Field
        {...props}
        disabled={result === undefined}
        options={
          result === undefined
            ? []
            : resultToOptions(result).map(interceptOption)
        }
      />
    )}
  </Rsrc>
)

ResourceOptionsField.propTypes = {
  field: PropTypes.func.isRequired,
  id: PropTypes.string,
  resource: PropTypes.func,
  taskName: PropTypes.string,
  resultToOptions: PropTypes.func,
}

export default ResourceOptionsField
