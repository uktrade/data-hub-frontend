import { addons } from '@storybook/addons'
import 'storybook-readme/register'
import '@storybook/addon-actions/register'
import '@storybook/addon-knobs/register'

addons.setConfig({
  panelPosition: 'right',
})
