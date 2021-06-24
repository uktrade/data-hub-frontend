module.exports = {
  change: (changeIndex) => {
    const change = `[data-test=editHistory] div:nth-child(${changeIndex})`
    return {
      change,
      updated: `${change} > p`,
      noChanges: `${change} > div`,
      table: (tableIndex) => {
        const table = `${change} table:nth-child(${tableIndex})`
        return {
          caption: `${table} caption`,
          beforeChangeText: `${table} tr:nth-child(1) th`,
          beforeChangeValue: `${table} tr:nth-child(1) td`,
          afterChangeText: `${table} tr:nth-child(2) th`,
          afterChangeValue: `${table} tr:nth-child(2) td`,
        }
      },
    }
  },
}
