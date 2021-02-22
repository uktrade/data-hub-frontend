module.exports = {
  header: '.c-collection__header-intro',
  headerCount: '.c-collection__result-count',
  items: '.c-entity-list__item',
  itemsHeader: '.c-entity-list__item .c-entity__header',
  itemsList: '.c-entity-list__item .c-meta-list',
  error: 'h3',
  contentTable: (table) => {
    return `.c-details-container__content > table:nth-child(${table})`
  },
  contentHeader: '.govuk-heading-m',
  nav: 'a.c-entity-search__aggregations-link',
}
