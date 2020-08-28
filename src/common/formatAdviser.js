const parseAdviserData = (advisers) => {
  return advisers
    .filter((adviser) => adviser.name && adviser.name.trim().length)
    .map(({ id, name, dit_team }) => ({
      label: `${name}${dit_team ? ', ' + dit_team.name : ''}`,
      value: id,
    }))
}

module.exports = { parseAdviserData }
