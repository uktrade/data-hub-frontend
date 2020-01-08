module.exports = (middleware) => {
  return [
    {
      middleware: middleware,
      path: '/step-1',
      type: 'form',
      heading: 'Add something',
      breadcrumbs: [{ text: 'Add something', href: '/url' }],
      macro: () => {
        return { children: [] }
      },
      nextPath: ({ selectedAtStep1 }) => {
        const paths = {
          'step-2-value': '/step-2',
          'step-3-value': '/step-3',
        }
        return paths[selectedAtStep1]
      },
    },
    {
      path: '/step-2',
      type: 'form',
      heading: 'Add something',
      breadcrumbs: [{ text: 'Add something', href: '/url' }],
      macro: () => {
        return { children: [] }
      },
      nextPath: '/finish',
      validateJourney: false,
    },
    {
      path: '/step-3',
      type: 'form',
      heading: 'Add something',
      breadcrumbs: [{ text: 'Add something', href: '/url' }],
      macro: () => {
        return { children: [] }
      },
      nextPath: ({ selectedAtStep3 }) => {
        const paths = {
          'step-4-value': '/step-4',
          'step-5-value': '/step-5',
        }
        return paths[selectedAtStep3]
      },
    },
    {
      path: '/step-4',
      type: 'form',
      heading: 'Add something',
      breadcrumbs: [{ text: 'Add something', href: '/url' }],
      macro: () => {
        return { children: [] }
      },
      nextPath: '/finish',
    },
    {
      path: '/step-5',
      type: 'form',
      heading: 'Add something',
      breadcrumbs: [{ text: 'Add something', href: '/url' }],
      macro: () => {
        return { children: [] }
      },
      nextPath: '/finish',
    },
  ]
}
