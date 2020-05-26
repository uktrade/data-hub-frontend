### Input
```jsx
import DropdownMenu, { DropdownButton } from '../DropdownMenu'

<DropdownMenu label="View options" open={false} onClick={(nextState: Boolean) => toggleState(nextState)}>
    <DropdownButton buttonColour="#dee0e2" buttonTextColour="#000">
      Add to or remove from list
    </DropdownButton>
    <DropdownButton buttonColour="#dee0e2" buttonTextColour="#000">
      Add to pipeline
    </DropdownButton>
</DropdownMenu>
```

### Output