const { getSelectorForElementWithText } = require('../../../helpers/selectors')

const getMetaListItemValueSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  }
)

module.exports = {
  sections: {
    firstAuditInList: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header h3',
        },
        adviser: getMetaListItemValueSelector('Adviser'),
        fields: getMetaListItemValueSelector('Fields'),
        changeCount: getMetaListItemValueSelector('Change count'),
      },
    },
    lastContactInList: {
      selector: '.c-entity-list li:last-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
      },
    },
  },
}
