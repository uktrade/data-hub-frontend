import { faker, jsf } from '../../../sandbox/utils/random'

import apiSchema from '../../../api-schema.json'
import { listFaker } from './utils'
import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../../../../src/client/modules/Files/CollectionList/constants'

const genericDocumentFaker = (overrides = {}) => ({
  ...jsf.generate(apiSchema.components.schemas.GenericDocumentRetrieve),
  id: faker.string.uuid(),
  created_by: {
    id: faker.string.uuid(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
  },
  modified_by: {
    id: faker.string.uuid(),
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
  },
  document: {
    id: faker.string.uuid(),
    created_by: null,
    modified_by: null,
    created_on: faker.date.past({ years: 2 }),
    modified_on: null,
    archived: false,
    archived_on: null,
    archived_reason: null,
    title: faker.lorem.words(),
    url: faker.internet.url(),
    archived_by: null,
  },
  related_object: {
    id: faker.string.uuid(),
    name: faker.company.name(),
  },
  created_on: faker.date.past({ years: 2 }),
  modified_on: faker.date.past({ years: 1 }),
  archived: false,
  archived_on: null,
  archived_reason: null,
  document_object_id: faker.string.uuid(),
  related_object_id: faker.string.uuid(),
  archived_by: null,
  document_type: DOCUMENT_TYPES.SHAREPOINT.type,
  related_object_type: RELATED_OBJECT_TYPES.COMPANY,
  ...overrides,
})

const genericDocumentsListFaker = (length = 1, overrides) =>
  listFaker({ fakerFunction: genericDocumentFaker, length, overrides })

export { genericDocumentFaker, genericDocumentsListFaker }

export default genericDocumentsListFaker
