export default [
  {
    label: 'Companies',
    module: 'datahub:companies',
    useRouter: true,
    to: {
      pathname: '/companies',
      search:
        '?archived[0]=false&sortby=modified_on:desc&page=1&has_name[0]=true',
    },
  },
  {
    label: 'Contacts',
    module: 'datahub:contacts',
    useRouter: true,
    to: {
      pathname: '/contacts',
      search: '?archived[0]=false&sortby=modified_on:desc&page=1',
    },
  },
  {
    label: 'Events',
    module: 'datahub:events',
    useRouter: true,
    to: {
      pathname: '/events',
      search: '?page=1&sortby=modified_on:desc',
    },
  },
  {
    label: 'Interactions',
    module: 'datahub:interactions',
    useRouter: true,
    to: {
      pathname: '/interactions',
      search: '?sortby=date:desc&page=1',
    },
  },
  {
    label: 'Investments',
    module: 'datahub:investments',
    useRouter: false,
    to: {
      pathname: '/investments',
      search: '?page=1&sortby=created_on:desc',
    },
  },
  {
    label: 'Orders',
    module: 'datahub:orders',
    useRouter: true,
    to: {
      pathname: '/omis',
      search: '?page=1&sortby=created_on:desc',
    },
  },
  {
    label: 'Find exporters',
    module: 'find-exporters',
    useRouter: false,
    to: {
      pathname:
        'https://data.trade.gov.uk/datasets/4a0da123-a933-4250-90b5-df5cde34930b',
    },
  },
  {
    label: 'Market access',
    module: 'market-access',
    useRouter: false,
    to: {
      pathname: 'https://market-access.trade.gov.uk/',
    },
  },
]
