import { actions } from '@storybook/addon-actions'

import { InlineTemplate } from './utils'
import Err from '../Error'

export default {
  title: 'Task/Error',
  component: Err,
}

export const Dismissable = () => (
  <Err
    {...actions('retry', 'dismiss')}
    errorMessage="Complete meltdown"
    noun="made up thing"
  />
)

export const NonDismissable = () => (
  <Err
    {...actions('retry')}
    errorMessage="Complete meltdown"
    noun="made up thing"
  />
)

const InlineError = (props) => (
  <Err.Inline errorMessage="Complete meltdown" noun="stuff" {...props} />
)

export const Inline = () => (
  <InlineTemplate
    dismissable={<InlineError {...actions('retry')} />}
    noRetry={<InlineError />}
  />
)
