/* eslint-disable prettier/prettier */

const C = [
  {
    id: 'c',
    name: 'C',
  },
  {
    id: 'cc',
    name: 'CC',
  },
  {
    id: 'ccc',
    name: 'CCC',
  },
]
const OPTION_SETS = {
  a: [
    {
      id: 'a',
      name: 'A',
    },
    {
      id: 'aa',
      name: 'AA',
    },
    {
      id: 'aaa',
      name: 'AAA',
    },
  ],
  b: [
    {
      id: 'b',
      name: 'B',
    },
    {
      id: 'bb',
      name: 'BB',
    },
    {
      id: 'bbb',
      name: 'BBB',
    },
  ],
}

export default {
  'task-typeahead-exampe': (payload = 'a', id) => 
    new Promise(resolve => {
      setTimeout(resolve, 2000, [...OPTION_SETS[payload], ...C])
    })
}
