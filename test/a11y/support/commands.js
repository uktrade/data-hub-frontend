/**
 * Adds a Cypress command with nice logging. In particular, solves the problem
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

Cypress.Commands.add('initA11y', (options = {}) => {
  cy.injectAxe()
  cy.configureAxe(options)
})

Cypress.Commands.add('runA11y', (context = null, options = null) => {
  cy.checkA11y(context, options, (violations) => {
    const hasOneErr = violations.length === 1
    const msg =
      `${violations.length} a11y violation${hasOneErr ? '' : 's'}` +
      `${hasOneErr ? 'was' : 'were'} detected`

    cy.task('log', msg)
    cy.task(
      'log',
      violations.map(({ id, impact, description, help, helpUrl, nodes }) => ({
        id,
        impact,
        description,
        help,
        helpUrl,
        nodes: nodes.length,
      }))
    )
  })
})
