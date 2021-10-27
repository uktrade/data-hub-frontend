/* eslint-disable */
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
