import styled from 'styled-components'

import RoutedDate from '../../../components/RoutedDateField'

export default styled(RoutedDate)({
  paddingBottom: 0,
  marginBottom: 0,
  label: {
    paddingBottom: 2,
  },
  input: {
    width: '100%',
    maxHeight: 38,
  },
})
