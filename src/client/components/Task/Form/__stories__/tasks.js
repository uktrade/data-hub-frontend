export default {
  'Load initial values': (payload) =>
    new Promise((resolve, reject) =>
      payload === 'reject'
        ? setTimeout(reject, 2000, 'You broke the internet!')
        : setTimeout(resolve, 2000, {
            foo: 'Blah blah',
            bar: 'b',
          })
    ),
  'Submit TaskForm example': (formValues) =>
    new Promise((resolve, reject) =>
      formValues.reject === 'yes'
        ? setTimeout(reject, 2000, 'You broke the internet!')
        : setTimeout(resolve, 2000, {
            task: 'result',
          })
    ),
}
