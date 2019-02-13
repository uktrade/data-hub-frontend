const {
  getSelectorForElementWithText,
  getMetaListItemValueSelector,
} = require('../../helpers/selectors')

const getFilterSummaryFilterSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'govuk-!-font-weight-bold',
    child: '/following-sibling::ul/li[1]',
  }
)

module.exports = {
  url: `${process.env.QA_HOST}/interactions`,
  elements: {
    interactionsTab: 'a[href*="/search/interactions"]',
  },
  sections: {
    summary: {
      selector: '.c-collection-selected-filters',
      elements: {
        kind: getFilterSummaryFilterSelector('Kind'),
        communicationChannel: getFilterSummaryFilterSelector('Communication channel'),
        adviser: getFilterSummaryFilterSelector('Adviser'),
        dateFrom: getFilterSummaryFilterSelector('From'),
        dateTo: getFilterSummaryFilterSelector('To'),
        seviceProvider: getFilterSummaryFilterSelector('Service provider'),
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
        teamSearch: getMetaListItemValueSelector('Teams'),
      },
    },
    filters: {
      selector: '.c-collection-filters',
      elements: {
        interaction: 'label[for=field-kind-1]',
        serviceDelivery: 'label[for=field-kind-2]',
        policyFeedback: 'label[for=field-kind-3]',
        communicationChannel: '[name="communication_channel"]',
        adviser: '[name="dit_adviser"]',
        dateFrom: '#field-date_after',
        dateTo: '#field-date_before',
        serviceProvider: '[name="dit_team"]',
        teamSearch: '#dit_team__typeahead .multiselect__input',
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
