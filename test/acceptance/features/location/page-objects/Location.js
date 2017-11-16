module.exports = {
  url: process.env.QA_HOST,
  sections: {
    localHeader: {
      selector: '.c-local-header',
      elements: {
        header: '.c-local-header__heading',
      },
    },
  },
}
