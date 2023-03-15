const sortCriteria = {
  _script: {
    type: 'number',
    script: {
      lang: 'painless',
      // Using the logic below to perform sorting, as we want to sort on published time, apart from events, which
      // have a startTime set. The sort order needs to reflect their startTime (i.e. when the event is happening)
      // in the list of activities, as opposed to when that activity was created.
      source:
        "doc.containsKey('object.startTime') ? doc['object.startTime'].value.toInstant().toEpochMilli() " +
        ": doc['published'].value.toInstant().toEpochMilli()",
    },
    order: 'desc',
  },
}

module.exports = { sortCriteria }
