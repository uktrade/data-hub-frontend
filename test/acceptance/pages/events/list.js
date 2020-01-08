const {
  getSelectorForElementWithText,
  getButtonWithText,
  getMetaListItemValueSelector,
} = require('../../helpers/selectors')

const getFilterTagRemoveBtnSelector = (text) =>
  getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-collection__filter-label',
    child: '/following-sibling::a',
  })

module.exports = {
  url: `${process.env.QA_HOST}/events`,
  props: {},
  elements: {
    h1Element: '.c-local-header__heading',
    addEventButton: getButtonWithText('Add event'),
    sortBy: '#field-sortby',
  },
  sections: {
    filterTags: {
      selector: '.c-collection__filter-summary',
      elements: {
        eventName: getFilterTagRemoveBtnSelector('Event name'),
        organiser: getFilterTagRemoveBtnSelector('Organiser'),
        eventType: getFilterTagRemoveBtnSelector('Type of event'),
        country: getFilterTagRemoveBtnSelector('Country'),
        fromDate: getFilterTagRemoveBtnSelector('From'),
      },
    },
    firstEventInList: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        eventType: getMetaListItemValueSelector('Type'),
        country: getMetaListItemValueSelector('Country'),
        ukRegion: getMetaListItemValueSelector('Region'),
        eventStart: getMetaListItemValueSelector('Begins'),
        eventEnd: getMetaListItemValueSelector('Ends'),
        organiser: getMetaListItemValueSelector('Organiser'),
        leadTeam: getMetaListItemValueSelector('Lead team'),
      },
    },
    secondEventInList: {
      selector: '.c-entity-list li:nth-child(2)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        eventStart: getMetaListItemValueSelector('Begins'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        nameInput: '#field-name',
        organiser: '[name="organiser"]',
        country: '[name="address_country"]',
        eventType: '[name="event_type"]',
        startDateAfter: '#field-start_date_after',
      },
    },
  },
}
