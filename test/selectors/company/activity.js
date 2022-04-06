module.exports = {
  pendingDnbInvestigationMessage:
    'div:contains("This company record is based on information that has not yet been validated.")',
  activityFeed: {
    item: (number) => {
      return `#activity-feed-app > div > ol > li:nth-child(${number})`
    },
  },
}
