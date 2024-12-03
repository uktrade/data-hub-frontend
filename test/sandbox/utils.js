/**
 * To prevent flaky tests, tests must be deterministic. So if we want to use any
 * random generated data, it must be pseudo-random. Thus we should only ever use
 * `faker` and `json-schema-faker` _seeded_ with a constant _seed_.
 *
 * The seed configuration only applies to the currently imported instance of
 * each library so we only should instances exported from this module.
 *
 * We enforce this with the `no-restricted-imports` ESLint rule and this should
 * be the only valid place to violate that rule.
 */
/* eslint-disable no-restricted-imports */
import { JSONSchemaFaker } from 'json-schema-faker'
import { faker as fkr } from '@faker-js/faker'
/* eslint-enable no-restricted-imports */
import seedrandom from 'seedrandom'

const SEED = 123

fkr.seed(SEED)

export const resolve = (options) =>
  new Promise((resolve) => setTimeout(resolve, options.after, options.with))

JSONSchemaFaker.option({
  random: seedrandom(SEED),
})

export const faker = fkr

export const jsf = JSONSchemaFaker
