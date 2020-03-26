Cypress.Commands.add('selectFirstOption', (selector) => {
  cy.get(selector)
    .find('option')
    .then(($els) => $els.get(1).setAttribute('selected', 'selected'))
    .parent()
    .trigger('change')
})

/**
 * Adds a Cypress command whith nice logging. In particular, solves the problem
 * when the created shapshot doesn't highlight the selected DOM element.
 * @param {Object} options
 * @param {String} options.name - The command name
 * @param {String} options.logName - The name of the log message e.g. 'GET'
 * @param {(...args) => Promise} options.command - The actual implementation of
 * the command It can take any number of arguments, but the last one is treated
 * as options. It should return the Cypress promise, if it's a continuation
 * command.
 * @param {(...args) => String} options.getLogMessage - A function which takes
 * all the command arguments an should return a string which will be used as
 * the log message.
 * @returns undefined
 */
const addLoggedCommand = ({
  name,
  logName,
  command,
  getLogMessage,
  options = {},
}) =>
  Cypress.Commands.add(name, options, (...args) => {
    const { log = true, nestedLog = false } = args[args.length - 1] || {}
    const logOptions = {
      name: logName,
      message: getLogMessage(...args),
    }
    const result = command(...args)

    if (!log) {
      return
    }

    if (nestedLog) {
      result.then(($el) => {
        Cypress.log({ ...logOptions, $el })
        return $el
      })
    } else {
      // If we want to avoid the leading dash in the log name, we must
      // instantiate the log outside of .then().
      const _log = Cypress.log(logOptions)
        // This is to avoid creation of a snapshot at this stage
        .end()

      result.then(($el) => {
        _log
          // This will enable highlighting of the selected area
          .set({ $el })
          // This is the stage when we want to make the snapshot
          .snapshot()
        return $el
      })
    }
  })

/**
 * Selects an accessible TabNav's _tablist_ by its label.
 * @param {string} label - The label to look for
 */
addLoggedCommand({
  name: 'dhAriaTablist',
  logName: 'ARIA',
  getLogMessage: (label) => `TABLIST: ${label}`,
  command: (label) =>
    cy.get(`[role=tablist][aria-label=${label}]`, { log: false }),
})

/**
 * Selects the _tabpanel_ of an accessible TabNav
 * @param {string} label - The TabNav label to look for
 */
addLoggedCommand({
  name: 'dhAriaTablistTabpanel',
  logName: 'ARIA',
  getLogMessage: (label) => `TABPANEL: ${label}`,
  command: (label, options) =>
    cy
      .dhAriaTablist(label, { ...options, nestedLog: true })
      .parent(options)
      .find('[role=tabpanel]', options),
})

/**
 * Selects an accessible TabNav's _tab_ by its label regardless of the
 * _tablist_ it belongs to.
 * @param {string} label - The label to look for
 */
addLoggedCommand({
  name: 'dhAriaTab',
  logName: 'ARIA',
  getLogMessage: (label) => `TAB: ${label}`,
  command: (label, { verbose } = {}) =>
    cy.get(`[role=tab]:contains(${label})`, { log: !!verbose }),
})

/**
 * Selects a _tab_ of a particular accessible TabNav's _tablist_,
 * both by their labels.
 * @param {string} tabListLabel - The _tablist_ label
 * @param {string} tabLabel - The _tab_ label
 * @param {options} options
 * @param {Boolean} options.log - Whether the command should log
 * @param {Boolean} options.nestedLog - Whether the log name should be prefixed
 * with a dash e.g. `'-GET'` if in a nested context like `.witin()`
 */
Cypress.Commands.add('dhAriaTablistTab', (tablistLabel, tabLabel, options) => {
  cy.dhAriaTablist(tablistLabel, options).within(
    { log: !!options?.verbose },
    () => cy.dhAriaTab(tabLabel, { ...options, nestedLog: true })
  )
})

/**
 * Activates a _tab_ of an accessible TabNav and selects its tabpanel.
 * @param {string} tabListLabel - The _tablist_ label
 * @param {string} tabLabel - The _tab_ label
 * @param {options} options
 * @param {Boolean} options.log - Whether the command should log
 * @param {Boolean} options.nestedLog - Whether the log name should be prefixed
 * @param {Boolean} options.verbose - If true, also logs the underlying commands.
 */
addLoggedCommand({
  name: 'dhAriaActiveTabpanel',
  logName: 'ARIA',
  getLogMessage: (tabListLabel, tabLabel) =>
    `TABPANEL: ${tabListLabel} > ${tabLabel}`,
  command: (tabListLabel, tabLabel, { verbose = false } = {}) => {
    const options = { log: verbose }
    cy.dhAriaTablistTab(tabListLabel, tabLabel, options).click(options)
    return cy.dhAriaTablistTabpanel(tabListLabel, options)
  },
})

/**
 * Asserts that a _tab_ of an accessible TabNav is selected
 * @param {string} tabListLabel - The _tablist_ label
 * @param {string} tabLabel - The _tab_ label
 * @param {options} options
 * @param {Boolean} options.log - Whether the command should log
 * @param {Boolean} options.nestedLog - Whether the log name should be prefixed
 * @param {Boolean} options.verbose - If true, also logs the underlying commands.
 */
addLoggedCommand({
  name: 'dhAriaTablistTabShouldBeSelected',
  logName: 'ARIA',
  getLogMessage: (tabListLabel, tabLabel) =>
    `TAB SELECTED: ${tabListLabel} > ${tabLabel}`,
  command: (tabListLabel, tabLabel, { verbose = false, ...options } = {}) => {
    return cy
      .dhAriaTablistTab(tabListLabel, tabLabel, { log: verbose, ...options })
      .should('have.attr', 'aria-selected', 'true')
  },
})
