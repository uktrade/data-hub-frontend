module.exports = {
  activityFeed: {
    item: (number) => {
      return `#activity-feed-app > div > ol > li:nth-child(${number})`
    },
  },
}
