const {
  getSelectorForElementWithText,
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
  url: `${process.env.QA_HOST}/interactions`,
  elements: {
    interactionsTab: 'a[href*="/search/interactions"]',
  },
  sections: {
    filterTags: {
      selector: '.c-collection__filter-summary',
      elements: {
        kind: getFilterTagRemoveBtnSelector('Kind'),
        communicationChannel: getFilterTagRemoveBtnSelector('Communication channel'),
        adviser: getFilterTagRemoveBtnSelector('Adviser'),
        from: getFilterTagRemoveBtnSelector('From'),
        to: getFilterTagRemoveBtnSelector('To'),
        seviceProvider: getFilterTagRemoveBtnSelector('Service provider'),
      },
    },
    firstInteractionInList: {
      selector: '.c-entity-list li:nth-child(1)',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },

        subject: getMetaListItemValueSelector('Subject'),
        type: getMetaListItemValueSelector('Type'),
        contact: getMetaListItemValueSelector('Contact'),
        company: getMetaListItemValueSelector('Company'),
        channel: getMetaListItemValueSelector('Channel'),
        adviser: getMetaListItemValueSelector('Adviser'),
        serviceProvider: getMetaListItemValueSelector('Service provider'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        kindInteraction: '#field-kind-1',
        kindServiceDelivery: '#field-kind-2',
        communicationChannel: '#field-communication_channel',
        adviser: '#field-dit_adviser',
        from: '#field-date_after',
        to: 'label[for=field-date_before]',
        serviceProvider: 'label[for=field-dit_team]',
      },
    },
    collectionHeader: {
      selector: '.c-collection__header',
      elements: {
        sortBy: '#field-sortby',
      },
    },
  },
}
