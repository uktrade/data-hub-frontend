module.exports = {
  url: `${process.env.QA_HOST}/omis/create/confirm`,
  elements: {
    editCompanyLink: 'a[href="company/edit"]',
    editContactLink: 'a[href="contact/edit"]',
    editMarketLink: 'a[href="market/edit"]',
    editSectorLink: 'a[href="sector/edit"]',
  },
  sections: {
    company: {
      selector: '.c-answers-summary:first-of-type',
      elements: {
        company: 'td.c-answers-summary__content',
      },
    },
    contact: {
      selector: '.c-answers-summary:nth-of-type(2)',
      elements: {
        contact: 'td.c-answers-summary__content',
      },
    },
    market: {
      selector: '.c-answers-summary:nth-of-type(3)',
      elements: {
        market: 'td.c-answers-summary__content',
      },
    },
    sector: {
      selector: '.c-answers-summary:nth-of-type(4)',
      elements: {
        sector: 'td.c-answers-summary__content',
      },
    },
  },
}
