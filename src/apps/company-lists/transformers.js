async function transformCompaniesInLists (allLists, allListsCompaniesIn) {
  const allIdCompaniesIn = allListsCompaniesIn.results.map(list => list.id)
  return {
    companyLists: allLists.results.map(({ id, name }) => ({
      listName: name,
      listId: id,
      isAdded: allIdCompaniesIn.find(x => x === id) ? 'yes' : 'no',
    })),
  }
}

module.exports = {
  transformCompaniesInLists,
}
