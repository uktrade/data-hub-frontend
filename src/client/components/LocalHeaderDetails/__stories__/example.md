### Import

```js
import LocalHeader from '../../LocalHeader/LocalHeader'
import LocalHeaderDetails from 'LocalHeaderDetails'

const items = [
  { label: 'Name', value: 'A name' },
  { label: 'Location', value: 'A location' },
  { label: 'Company', value: 'A company' },
  { label: 'Job', value: 'A job' },
]

<LocalHeader
  breadcrumbs={[{ link: '/', text: 'Home' }, { text: 'Example' }]}
  heading="Example"
>
  <LocalHeaderDetails items={items} />
</LocalHeader>
```

### Output
