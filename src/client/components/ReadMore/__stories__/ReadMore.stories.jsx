import ReadMore from '..'

const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

export default {
  title: 'ReadMore',

  parameters: {
    component: ReadMore,
  },
}

export const Default = () => <ReadMore text={content} />

export const Custom = () => (
  <>
    <p>Character limit set to 10</p>
    <ReadMore text={content} count={20} />
  </>
)
