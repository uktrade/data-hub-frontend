import { InlineTemplate } from './utils'
import ProgressIndicator from '../../ProgressIndicator'

export default {
  title: 'Task/ProgressIndicator',
  component: ProgressIndicator,
}

export const Noun = () => <ProgressIndicator noun="stuff" />

export const Message = () => (
  <ProgressIndicator message="something is in progress" />
)

export const Inline = () => (
  <InlineTemplate
    dismissable={<ProgressIndicator.Inline noun="stuff" />}
    noRetry={<ProgressIndicator.Inline noun="stuff" />}
  />
)
