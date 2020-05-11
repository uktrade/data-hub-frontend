import React from 'react'

import PipelineItem from '../PipelineItem'
import defaultReadme from './default.md'
import usageReadme from './usage.md'

export default {
  component: PipelineItem,
  title: 'Pipeline Item',
  parameters: {
    readme: {
      sidebar: usageReadme,
    },
  },
}

const DefaultComponent = () => (
  <PipelineItem
    id={'123'}
    companyId={'123'}
    companyName={'ABC Inc'}
    projectName={'Jam to Sweden'}
    date={'10-04-2015 10:55:02'}
    likelihood={'LOW'}
    sector={'Food and Drink'}
    contact={{ link: '/', name: 'Bob Jones' }}
    exportValue={1800000}
    expectedWinDate={'10-04-2022 10:55:02'}
  />
)

export { DefaultComponent }

DefaultComponent.story = {
  parameters: {
    readme: {
      content: defaultReadme,
    },
  },
}
