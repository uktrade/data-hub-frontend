import { storiesOf } from '@storybook/react'

import ReadMore from 'ReadMore'

const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

storiesOf('ReadMore', module)
  .addParameters({ component: ReadMore })
  .add('Default', () => <ReadMore text={content} />)
  .add('Custom', () => (
    <>
      <p>Character limit set to 10</p>
      <ReadMore text={content} count={20} />
    </>
  ))
