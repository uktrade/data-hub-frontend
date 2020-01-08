module.exports = () => {
  return {
    removeSubsidiary: 'a:contains("Remove subsidiary")',
    search: {
      term: '.c-entity-search__input',
      button: '.c-entity-search__button',
      result(number) {
        return {
          title: `.c-entity-list__item:nth-child(${number}) h3 a`,
        }
      },
    },
  }
}
