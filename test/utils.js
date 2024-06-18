export const resolve = (options) =>
  new Promise((resolve) => setTimeout(resolve, options.after, options.with))
