module.exports = {
  url: process.env.QA_HOST + '/events',
  props: {},
  elements: {
    h1Element: '.c-local-header__heading',
    addEventButton: '#add-event-link',
    sortBy: '#field-sortby',
    firstHeaderInList: '.c-entity-list li:first-child .c-entity__header a',
    secondHeaderInList: '.c-entity-list li:nth-child(2) .c-entity__header a',
    xhrTargetElement: '#xhr-outlet',
  },
  sections: {
    firstEventInList: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        eventType: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Type"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
        country: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Country"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
        region: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Region"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
        eventStart: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Begins"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
        eventEnd: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Ends"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
        organiser: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Organiser"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
        leadTeam: {
          selector: '//span[contains(@class,"c-meta-list__item-label")][text()[normalize-space()="Lead team"]]/following-sibling::span',
          locateStrategy: 'xpath',
        },
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        nameInput: {
          selector: '#field-name',
        },
      },
    },
  },
}
