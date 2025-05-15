import { faker } from '../../../sandbox/utils/random'
import { listFaker } from './utils'
import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../../../../src/client/modules/Files/CollectionList/constants'
import { VIRUS_SCAN_STATUSES } from '../../../../src/client/modules/Investments/Projects/constants'

/**
 * Returns a random virus scan status label
 * @returns {string}
 */
const getRandomVirusScanStatus = () => {
  const statusKeys = Object.keys(VIRUS_SCAN_STATUSES)
  const randomKey = faker.helpers.arrayElement(statusKeys)
  return VIRUS_SCAN_STATUSES[randomKey].label
}

/**
 * Generates a user object for creator/modifier fields
 * @returns {Object}
 */
const userData = () => ({
  id: faker.string.uuid(),
  name: `${faker.person.firstName()} ${faker.person.lastName}`,
  email: faker.internet.email(),
})

/**
 * Generates an object with fields shared by all generic document instances
 * @param {Object} overrides - Fields to override
 * @returns {Object}
 */
const baseGenericDocumentData = (overrides = {}) => {
  const user = userData()
  const pastDate = faker.date.past({ years: 2 })
  const relatedObjectID = faker.string.uuid()
  return {
    id: faker.string.uuid(),
    created_by: user,
    modified_by: user,
    created_on: pastDate,
    modified_on: pastDate,
    archived: false,
    archived_by: null,
    archived_on: null,
    archived_reason: null,
    related_object_id: relatedObjectID,
    related_object: {
      id: relatedObjectID,
      name: faker.company.name(),
    },
    related_object_type: RELATED_OBJECT_TYPES.COMPANY,
    ...overrides,
  }
}

/**
 * Generates an object with fields shared by each specific document type
 * @returns {Object}
 */
const baseSpecificDocumentData = () => {
  const user = userData()
  const pastDate = faker.date.past({ years: 2 })
  return {
    id: faker.string.uuid(),
    created_by: user,
    modified_by: user,
    created_on: pastDate,
    modified_on: pastDate,
  }
}

/**
 * Generates an object with SharePoint link specific fields
 * @returns {Object}
 */
const sharePointDocumentData = () => ({
  title: faker.lorem.words(),
  url: faker.internet.url(),
})

/**
 * Generates an object with Uploadable document specific fields
 * @returns {Object}
 */
const uploadableDocumentData = () => {
  const fileName = faker.system.fileName()
  return {
    title: fileName,
    origin_filename: fileName,
    status: getRandomVirusScanStatus(),
  }
}

/**
 * Generates a SharePoint document instance
 * @param {Object} overrides - Fields to override
 * @returns {Object}
 */
const sharePointDocumentFaker = (overrides = {}) => {
  const genericDocument = baseGenericDocumentData({
    document_type: DOCUMENT_TYPES.SHAREPOINT.type,
    ...overrides,
  })
  return {
    ...genericDocument,
    document: {
      ...baseSpecificDocumentData(),
      ...sharePointDocumentData(),
      ...(overrides.document || {}),
    },
  }
}

/**
 * Generates an Uploadable document instance
 * @param {Object} overrides - Fields to override
 * @returns {Object}
 */
const uploadableDocumentFaker = (overrides = {}) => {
  const genericDocument = baseGenericDocumentData({
    document_type: DOCUMENT_TYPES.UPLOADABLE.type,
    ...overrides,
  })
  return {
    ...genericDocument,
    document: {
      ...baseSpecificDocumentData(),
      ...uploadableDocumentData(),
      ...(overrides.document || {}),
    },
  }
}

/**
 * Generates a list of generic document instances (with varying specific types)
 * @param {Object} options - Configuration options
 * @param {number} options.sharePointCount - Desired number of SharePoint documents
 * @param {number} options.uploadableCount - Desired number of Uploadable documents
 * @param {Object} options.overrides - Fields to override (in all instances)
 * @returns {Array}
 */
const genericDocumentListFaker = ({
  sharePointCount = 2,
  uploadableCount = 2,
  overrides = {},
} = {}) => {
  const sharePointDocuments = listFaker({
    fakerFunction: sharePointDocumentFaker,
    length: sharePointCount,
    overrides,
  })
  const uploadableDocuments = listFaker({
    fakerFunction: uploadableDocumentFaker,
    length: uploadableCount,
    overrides,
  })
  return [...sharePointDocuments, ...uploadableDocuments]
}

export {
  sharePointDocumentFaker,
  uploadableDocumentFaker,
  genericDocumentListFaker,
}
