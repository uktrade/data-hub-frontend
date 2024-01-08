import TabNav from '../../TabNav'
import DefaultLayout from '../../Layout/DefaultLayout'

export const InlineTemplate = ({ dismissable, noRetry }) => (
  <DefaultLayout
    heading={<>In heading {dismissable} foo bar baz</>}
    localHeaderdismissable={<>In local header {dismissable} foo bar baz</>}
    breadcrumbs={[
      {
        text: 'Foo',
      },
      {
        text: noRetry,
      },
      {
        text: 'Foo',
      },
    ]}
  >
    <TabNav
      id="example"
      label="Tab nav"
      selectedIndex="bar"
      tabs={{
        foo: { label: 'Foo', content: 'Foo content' },
        bar: {
          label: <>Inside tab {noRetry}</>,
          content: 'Bar content',
        },
        baz: { label: 'Baz', content: 'Baz content' },
      }}
    />
    <h1>Inside H1 {dismissable} foo bar baz</h1>
    <h2>Inside H2 {dismissable} foo bar baz</h2>
    <h3>Inside H3 {dismissable} foo bar baz</h3>
    <h4>Inside H4 {dismissable} foo bar baz</h4>
    <h5>Inside H5 {dismissable} foo bar baz</h5>
    <h6>Inside H6 {dismissable} foo bar baz</h6>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices{' '}
      {dismissable} odio at ultricies semper. Sed fermentum tortor quis ante
      blandit malesuada. Praesent vulputate eget dolor vel luctus. Pellentesque
      id molestie arcu, a eleifend justo.
    </p>
    <ul>
      <li>Inside list item {dismissable} foo bar baz</li>
      <li>Inside list item {dismissable} foo bar baz</li>
      <li>Inside list item {dismissable} foo bar baz</li>
    </ul>
  </DefaultLayout>
)
