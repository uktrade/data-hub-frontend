import React from 'react'

const SelectedChips = ({ name, selectedOptions, onOptionRemove }) => (
  <ul id={`${name}-selected`}>
    <span id={`${name}-remove`} style={{ display: 'none' }}>
      remove
    </span>
    {selectedOptions.map((option) => (
      <li key={option.value}>
        <button
          type="button"
          aria-describedby={`${name}-remove`}
          onClick={() => {
            onOptionRemove(option)
          }}
        >
          {option.label}
        </button>
      </li>
    ))}
  </ul>
)

export default SelectedChips
