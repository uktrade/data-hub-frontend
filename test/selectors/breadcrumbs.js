module.exports = {
  item: {
    byNumber: (number) =>
      `.govuk-breadcrumbs__list li:nth-child(${number}) .govuk-breadcrumbs__link`,
    last: () => '.govuk-breadcrumbs__list li:last-child',
  },
}
