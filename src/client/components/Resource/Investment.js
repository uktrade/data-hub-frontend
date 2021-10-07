import { createCRUDResource } from '.'

export default createCRUDResource({
  name: 'Investment',
  actions: {
    $read: ['get', 'v3/investment/:id'],
    $update: ['patch', 'v3/investment/:id'],
    audit: ['get', `v3/investment/:id/audit`],
  },
})
