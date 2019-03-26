module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editCompanyDetailsButton: 'a[href*="/companies"][href*="/edit"]',
    description: '#field-description',
    website: '#field-website',
  },
}
