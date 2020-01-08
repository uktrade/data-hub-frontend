const { order: orderFixtures } = require('../../fixtures')

module.exports = {
  url: function companyFixtureUrl(order) {
    const fixture = orderFixtures[order]
    const orderId = fixture ? fixture.id : orderFixtures.draft.id

    return `${process.env.QA_HOST}/omis/${orderId}`
  },
  props: {
    urlMatch: new RegExp(
      /omis\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/work-order/
    ),
  },
  elements: {},
  sections: {
    header: {
      selector: '.c-local-header',
      elements: {
        heading: '.c-local-header__heading',
        status:
          '.c-meta-list:nth-of-type(2) .c-meta-list__item:nth-of-type(3) .c-meta-list__item-value',
      },
      sections: {
        metadata: {
          selector: '.c-meta-list:first-of-type',
          elements: {
            company:
              '.c-meta-list__item:nth-of-type(1) .c-meta-list__item-value',
            market:
              '.c-meta-list__item:nth-of-type(2) .c-meta-list__item-value',
            ukRegion:
              '.c-meta-list__item:nth-of-type(3) .c-meta-list__item-value',
          },
        },
      },
    },
    contact: {
      selector: '.c-answers-summary:first-of-type',
      elements: {
        name: 'tr:nth-of-type(1) td.c-answers-summary__content',
      },
    },
    internal: {
      selector: '.c-answers-summary:nth-of-type(5)',
      elements: {
        sector: 'tr:nth-of-type(2) td.c-answers-summary__content',
      },
    },
  },
}
