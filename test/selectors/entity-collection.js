module.exports = {
  addCompany: '[data-auto-id="Add company"]',
  addEvent: '[data-auto-id="Add event"]',
  addOrder: '[data-auto-id="Add order"]',
  collection: '.c-collection',
  collectionRowMessage: '.c-collection__export-message',
  collectionRowButton: '.c-collection__header-actions > a',
  collectionRemoveAllFilter: '.c-collection__filter-remove-all',
  collectionResult: '.c-collection__result-count',
  entities: 'article > ol',
  entity: (rowNum) => {
    return `article > ol > li:nth-child(${rowNum})`
  },
  entityBadge: (rowNum) => {
    return `article > ol > li:nth-child(${rowNum}) .c-badge`
  },
  badge: (entityRow, badgeNum) => {
    return `article > ol > li:nth-child(${entityRow}) div.c-meta-list__item:nth-child(${badgeNum}) .c-badge`
  },
  sort: '#field-sortby',
  totalValue: '.c-collection__total-cost__value',
}
