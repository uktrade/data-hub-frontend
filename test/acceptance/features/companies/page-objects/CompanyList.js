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
  url: `${process.env.QA_HOST}/companies`,
  props: {},
  elements: {},
  sections: {
    firstCompanyInList: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: '.c-entity__header a',
        },
        sector: getMetaListItemValueSelector('Sector'),
        registeredAddress: getMetaListItemValueSelector('Registered address'),
      },
    },
  },
}
