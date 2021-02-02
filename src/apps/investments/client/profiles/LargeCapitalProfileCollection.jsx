import React from 'react'

import Unfiltered from './UnfilteredLargeCapitalProfileCollection'
import Filtered from './FilteredLargeCapitalProfileCollection'

export default ({ filtersFeatureEnabled, ...props }) =>
  filtersFeatureEnabled ? <Filtered {...props} /> : <Unfiltered {...props} />
