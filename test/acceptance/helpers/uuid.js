const faker = require('faker')

const MARKER = '|'

/**
 * get the uuid part of string created with the withUid method
 * @param name
 */
const getUid = (name) => name.split(MARKER)[1]

/**
 * create name with a uuid suffix
 * @param name
 */
const appendUid = (name) => `${name}${MARKER}${faker.random.uuid()}`

module.exports = {
  getUid,
  appendUid,
}
