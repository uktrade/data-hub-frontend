module.exports = {
  addCompany: '[data-auto-id="Add company"]',
  collection: '.c-collection',
  collectionRowMessage: '.c-collection__export-message',
  collectionRowButton: '.c-collection__header-actions > a',
  collectionRemoveAllFilter: '.c-collection__filter-remove-all',
  entities: 'article > ol',
  entity: (rowNum) => {
    return `article > ol > li:nth-child(${rowNum})`
  },
  entityBadge: (rowNum) => {
    return `article > ol > li:nth-child(${rowNum}) .c-badge`
  },
  sort: '#field-sortby',
}
