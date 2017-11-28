const {
  getSelectorForElementWithText,
  getButtonWithText,
  getMetaListItemValueSelector,
} = require('../../../helpers/selectors')

const getFilterTagRemoveBtnSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-collection__filter-label',
    child: '/following-sibling::a',
  }
)

module.exports = {
  url: process.env.QA_HOST + '/events',
  props: {},
  elements: {
    h1Element: '.c-local-header__heading',
    addEventButton: getButtonWithText('Add event'),
    sortBy: '#field-sortby',
    xhrTargetElement: '#xhr-outlet',
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
        updated: getMetaListItemValueSelector('Updated'),
      },
    },
    secondEventInList: {
      selector: '.c-entity-list li:nth-child(2)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        eventStart: getMetaListItemValueSelector('Begins'),
        updated: getMetaListItemValueSelector('Updated'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        nameInput: {
          selector: '#field-name',
        },
        organiser: {
          selector: 'select[name="organiser"]',
        },
        country: {
          selector: 'select[name="address_country"]',
        },
        eventType: {
          selector: 'select[name="event_type"]',
        },
        startDateAfter: {
          selector: '#field-start_date_after',
        },
      },
    },
  },
}
