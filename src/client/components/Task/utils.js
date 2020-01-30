import _ from 'lodash'

/**
 * A curried function which Decorates a task so, that it's progress will take
 * at least {duration} of milliseconds.
 * @param {Number} duration - Duration of the progress in milliseconds
 * @param {payload => Promise} task - _Task_ to be decorated
 * @returns {payload => Promise} - The decorated _task_
 * @example
 * const task = payload => new Promise(resolve => setTimeout(reslove, 5000))
 * const slowTask = delay(10000)(task) // Will take 10 seconds to resolve
 * const fastTask = delay(100)(task) // Will take 5 seconds to resolve
 */
export const delay = _.curry((duration, task, payload) =>
  Promise.all([
    task(payload),
    new Promise((resolve) => setTimeout(resolve, duration)),
  ]).then(([result]) => result)
)
