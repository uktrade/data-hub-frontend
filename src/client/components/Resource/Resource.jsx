import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import multiInstance from '../../utils/multiinstance'
import { apiProxyAxios } from '../Task/utils'
import Task from '../Task'
import LoadingBox from '../Task/LoadingBox'
import { deepKeysToCamelCase } from '../../utils'
import ProgressIndicator from '../ProgressIndicator'
import Err from '../Task/Error'
import PaginatedResource from './Paginated'
import ResourceOptionsField from '../Form/elements/ResourceOptionsField'
import FieldRadios from '../Form/elements/FieldRadios'
import FieldCheckboxes from '../Form/elements/FieldCheckboxes'
import FieldTypeahead from '../Form/elements/FieldTypeahead'
import FieldSelect from '../Form/elements/FieldSelect'
import FieldChoice from '../Form/elements/FieldChoice'

/**
 * @function Resource
 * This component abstracts away the loading of a resource which has an ID.
 * It's basically a {Task} with the result persisted in the state without the
 * need to deal with the {onSuccessDispatch} mechanism and to add any reducers.
 * @param {Object} props
 * @param {string} props.name - The name of the task which loads the resource
 * @param {string} props.id - The unique ID of the resource for the given name.
 * The ID will be the task's payload.e
 * @param {any} props.payload - A payload with which the task will be called.
 * @param {(result: any) => React.ReactNode} props.children - The single child should be
 * a function to whose arguments will be spread the return value of the
 * {transformer}.
 * @param {(result: any) => any[]} [props.transformer = x => [x]] -
 * A function which should transform the task result into an array that will
 * be spread to the {props.children} function. Defaults to `x => [x]`.
 * @param {any} [progressBox] - If truthy, the {LoadingBox} will be used as
 * the task status component. Note that in such case {props.children} will be
 * also called before the task resolves with the resut being {undefined}.
 * @example
 * <Resource name="My task name" id="foo" payload={123}>
 *   {result =>
 *     <pre>{JSON.stringify(result, null, 2)}</pre>
 *   }
 * </Resource>
 */
const Resource = multiInstance({
  name: 'Resource',
  actionPattern: 'RESOURCE',
  reducer: (state, { id, result }) => ({
    ...state,
    [id]: result,
  }),
  idProp: 'name',
  componentStateToProps: (state, _, { id }) => ({ result: state[id] }),
  component: ({
    name,
    id,
    taskStatusProps,
    children,
    result,
    payload,
    transformer = (x) => [x],
    progressBox,
    noRetry,
  }) =>
    progressBox ? (
      <LoadingBox
        {...taskStatusProps}
        name={name}
        id={id}
        noRetry={noRetry}
        startOnRender={{
          onSuccessDispatch: 'RESOURCE',
          payload,
          ignoreIfInProgress: true,
        }}
      >
        {result ? children(...transformer(result)) : children()}
      </LoadingBox>
    ) : (
      <Task.Status
        {...taskStatusProps}
        name={name}
        id={id}
        noRetry={noRetry}
        startOnRender={{
          onSuccessDispatch: 'RESOURCE',
          payload,
        }}
      >
        {() => result !== undefined && children(...transformer(result))}
      </Task.Status>
    ),
})

Resource.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.func,
  taskStatusProps: PropTypes.shape(_.omit(Task.Status.propTypes, 'name', 'id')),
}

/**
 * @function Resource.Inline
 * @description Same as Resource but with inline variants of progress indicator and error views.
 * Use this component to fetch data in inline context.
 */
Resource.Inline = (props) => (
  <Resource
    {...props}
    taskStatusProps={{
      dismissable: false,
      noun: props.noun || props.name,
      renderProgress: ProgressIndicator.Inline,
      renderError: Err.Inline,
      ...props.taskStatusProps,
    }}
  />
)

export default Resource

/**
 * A utility factory for creating a {Resource} preset to a specific _entity_
 * API endpoint. An _entity_ endpoint is one that represents an entity uniquely
 * identified by an ID.
 * @param {string} name - The name for the resource and its task
 * @param {(id: string) => string} endpoint - A function
 * which takes the entity {id} and should return the path of the API endpoint
 * for the given resource without the leading slash.
 * @returns A resource component preconfigured for a specific task name and an
 * _task_ to the specified API {endpoint}.
 * The API response will be passed to the component's children function
 * camelCased. The raw data as returned by the API will be passed as the second
 * argument.
 * @example
 * // Create a Resource component pre-bound to name="Company"
 * const CompanyResource = createEntityResource('Company', (id) => `v4/company/${id}`)
 *
 * // You need to spread CompanyResource.tasks in the ./tasks.js module export
 * export default {
 *   ...CompanyResource.tasks,
 * }
 *
 * // And also add it to the ./index.jsx default export
 * export { default as CompanyResource } from './Company'
 *
 * // Now you can easily fetch a company with CompanyResource
 * <CompanyResource id={companyId}>
 *   {(camelCasedCompany, rawResponseData) =>
 *     <pre>{JSON.stringify(camelCasedCompany, null, 2)}</pre>
 *   }
 * </CompanyResource>
 */
export const createEntityResource = (name, endpoint) => {
  const transformer = (rawResult) => [deepKeysToCamelCase(rawResult), rawResult]
  const Component = (props) => (
    <Resource transformer={transformer} {...props} name={name} />
  )

  Component.Inline = (props) => (
    <Resource.Inline transformer={transformer} {...props} name={name} />
  )

  Component.propTypes = _.omit(Component.propTypes, 'name')
  Component.tasks = {
    [name]: (payload, id) =>
      apiProxyAxios
        .get(`/${endpoint(id)}`, { params: payload })
        .then(({ data }) => {
          return data
        }),
  }
  Component.transformer = transformer
  Component.taskName = name

  return Component
}

/**
 * A utility factory for creating a {Resource} preset to a specific _collection_
 * API endpoint. A _collection_ endpoint is one that represents a collection of
 * _entities_ and responds with a `{count: Number, results: entity[]}` schema.
 * @param {string} name - The name for the resource and its task
 * @param {string} endpoint - The API endpoint for the given resource without leading slash.
 * @returns A resource component preconfigured for a specific task name and an
 * API task to the specified {endpoint}. The total collection count is passed
 * as the second argument to the component's {children} function and the raw
 * response data as third.
 * The component also comes with a {PaginatedResource} subcomponent preconfigured
 * in the same way accessible as a `Paginated` property of the created component.
 * @example
 * // Create a Resource component pre-bound to name="Company"
 * const CompaniesResource = createCollectionResource('Companies', 'v4/company')
 *
 * // You need to spread CompanyResource.tasks in the ./tasks.js module export
 * export default {
 *   ...CompaniesResource.tasks,
 * }
 *
 * // Use the component
 * <CompaniesResource payload={{limit: 10, offset: 20}}>
 *   {(camelCasedCompanies, total, rawResponseData) =>
 *     <pre>{JSON.stringify(camelCasedCompanies, null, 2)}</pre>
 *   }
 * </CompaniesResource>
 *
 * // Use the PaginatedResource subcomponent
 * <CompanyResource.Paginated id="my-paginated-company-view">
 *  {currentPage =>
 *    <pre>{JSON.stringify(currentPage, null, 2)}</pre>
 *  }
 * </CompanyResource.Paginated>
 */
export const createCollectionResource = (name, endpoint) => {
  const EntityResource =
    typeof endpoint === 'function'
      ? createEntityResource(name, endpoint)
      : createEntityResource(name, () => endpoint)
  const transformer = (rawResult) => [
    deepKeysToCamelCase(rawResult.results),
    rawResult.count,
    rawResult,
  ]

  const Component = ({ id = '__COLLECTION__', ...props }) => (
    <EntityResource transformer={transformer} id={id} {...props} />
  )

  Component.propTypes = _.omit(Component.propTypes, 'id')
  Component.tasks = EntityResource.tasks
  Component.transformer = transformer
  Component.taskName = name
  Component.resourceName = name

  Component.Paginated = ({ showSort = true, ...props }) => (
    <PaginatedResource {...props} name={name} showSort={showSort} />
  )

  return Component
}

/**
 * A utility factory for creating a {Resource} preset to a specific _metadata_
 * API endpoint. Works exactly as {createCollectionResource} except for the
 * endpoint path format and the response schema it expects.
 * @param {string} name - The name for the resource and its task
 * @param {string} endpoint - The metadata endpoint path without the leading
 * `v4/metadata` part e.g. `'country'` for the endpoint `/v4/metadata/country`.
 * @returns A resource component preconfigured for a specific task name and an
 * API task to the specified {endpoint}. The total collection count is passed
 * as the second argument to the component's {children} function and the raw
 * response data as third.
 * The resulting component also comes with these form field subcomponents,
 * which you can use with the `<Form/>` component:
 * - `FieldOptions`
 * - `FieldRadios`
 * - `FieldSelect`
 * - `FieldCheckboxes`
 * - `FieldTypeahead`
 * @example
 * // Create a Resource component pre-bound to name="Company"
 * const CountriesResource = createMetadataResource('Countries', 'country')
 *
 * // You need to spread CompanyResource.tasks in the ./tasks.js module export
 * export default {
 *   ...CountriesResource.tasks,
 * }
 *
 * // Use the component
 * <CountriesResource>
 *   {(countries, total, rawData) =>
 *     <pre>{JSON.stringify({total, countries, rawData}, null, 2)}</pre>
 *   }
 * </CountriesResource>
 *
 * // Form field sub-components
 * <Form
 *   // ...
 * >
 *   <CountriesResource.FieldRadios name="countryRadios"/>
 *   <CountriesResource.FieldSelect name="countrySelect"/>
 *   <CountriesResource.FieldCheckboxes name="countryCheckboxes"/>
 *   <CountriesResource.FieldTypeahead name="countryTypeahead"/>
 * </Form>
 */
export const createMetadataResource = (name, endpoint) => {
  const EntityResource = createEntityResource(
    name,
    () => `v4/metadata/${endpoint}`
  )
  const transformer = (rawResult) => [
    deepKeysToCamelCase(rawResult),
    rawResult.length,
    rawResult,
  ]
  const Component = (props) => (
    <EntityResource
      transformer={transformer}
      id="__METADATA__"
      payload={props.payload || { _: '0' }}
      {...props}
    />
  )

  Component.propTypes = _.omit(Component.propTypes, 'id')
  Component.tasks = EntityResource.tasks
  Component.transformer = transformer
  Component.taskName = name

  Component.FieldOptions = (props) => (
    <ResourceOptionsField id="__METADATA__" {...props} resource={Component} />
  )

  Component.FieldRadios = (props) => (
    <Component.FieldOptions {...props} field={FieldRadios} />
  )

  Component.FieldSelect = (props) => (
    <Component.FieldOptions {...props} field={FieldSelect} />
  )

  Component.FieldCheckboxes = (props) => (
    <Component.FieldOptions {...props} field={FieldCheckboxes} />
  )

  Component.FieldTypeahead = (props) => (
    <Component.FieldOptions {...props} field={FieldTypeahead} />
  )

  Component.FieldChoice = (props) => (
    <Component.FieldOptions {...props} field={FieldChoice} />
  )

  Component.FieldChoice.Radio = (props) => (
    <Component.FieldChoice {...props} type="radio" />
  )

  Component.FieldChoice.Checkbox = (props) => (
    <Component.FieldChoice {...props} type="checkbox" />
  )

  return Component
}
