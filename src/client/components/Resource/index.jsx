import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import multiInstance from '../../utils/multiinstance'
import { apiProxyAxios } from '../Task/utils'
import Task from '../Task'
import LoadingBox from '../Task/LoadingBox'

const deepKeysToCamelCase = (x) =>
  Array.isArray(x)
    ? x.map(deepKeysToCamelCase)
    : _.isPlainObject(x)
    ? Object.fromEntries(
        Object.entries(x).map(([k, v]) => [
          _.camelCase(k),
          deepKeysToCamelCase(v),
        ])
      )
    : x

/**
 * @function Resource
 * This component abstracts away the loading of a resource which has an ID.
 * It's basically a {Task} whith the result persisted in the state without the
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
  }) =>
    progressBox ? (
      <LoadingBox
        {...taskStatusProps}
        name={name}
        id={id}
        startOnRender={{
          onSuccessDispatch: 'RESOURCE',
          payload,
          ignoreIfInProgress: true,
        }}
      >
        {children(...(result ? transformer(result) : [result]))}
      </LoadingBox>
    ) : (
      <Task.Status
        {...taskStatusProps}
        name={name}
        id={id}
        startOnRender={{
          onSuccessDispatch: 'RESOURCE',
          payload,
          ignoreIfInProgress: true,
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
  taskStatusProps: PropTypes.shape(Task.Status.propTypes),
}

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
 * // Now you can easily fetch a company with CompanyResource
 * <CompanyResource id={companyId}>
 *   {(camelCasedCompany, rawResponseData) =>
 *     <pre>{JSON.stringify(camelCasedCompany, null, 2)}</pre>
 *   }
 * </CompanyResource>
 */
export const createEntityResource = (name, endpoint) => {
  const Component = (props) => (
    <Resource
      transformer={(rawResult) => [deepKeysToCamelCase(rawResult), rawResult]}
      {...props}
      name={name}
    />
  )

  Component.propTypes = _.omit(Component.propTypes, 'name')
  Component.tasks = {
    [name]: (payload, id) =>
      apiProxyAxios
        .get(`/api-proxy/${endpoint(id)}`, { params: payload })
        .then(({ data }) => data),
  }

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
 */
export const createCollectionResource = (name, endpoint) => {
  const Comp = createEntityResource(name, () => endpoint)
  const Component = (props) => (
    <Comp
      transformer={(rawResult) => [
        deepKeysToCamelCase(rawResult.results),
        rawResult.count,
        rawResult,
      ]}
      {...props}
      id="__COLLECTION__"
    />
  )

  Component.propTypes = _.omit(Component.propTypes, 'id')
  Component.tasks = Comp.tasks
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
 */
export const createMetadataResource = (name, endpoint) => {
  const Comp = createEntityResource(name, () => `v4/metadata/${endpoint}`)
  const Component = (props) => (
    <Comp
      transformer={(rawResult) => [
        deepKeysToCamelCase(rawResult),
        rawResult.length,
        rawResult,
      ]}
      {...props}
      id="__METADATA__"
    />
  )

  Component.propTypes = _.omit(Component.propTypes, 'id')
  Component.tasks = Comp.tasks
  return Component
}
