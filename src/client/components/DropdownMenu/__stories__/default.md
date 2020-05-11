### Input

```jsx
import DropdownMenu, { DropdownButton } from '../DropdownMenu'

<DropdownMenu label="View Options" closedLabel="Hide Options" isOpen={false} onClick={(nextState: Boolean) => toggleState(nextState)}>
    <DropdownButton buttonColour="#dee0e2" buttonTextColour={BLACK}>
      Add to or remove from list
    </DropdownButton>
    <DropdownButton buttonColour="#dee0e2" buttonTextColour={BLACK}>
      Add to pipeline
    </DropdownButton>
</DropdownMenu>
```

### Output