import React from 'react'
import { mount } from 'enzyme'

import DefinitionList from '../DefinitionList'

describe('DefinitionList', () => {
  it('should render a list', () => {
    const wrapper = mount(
      <DefinitionList header="test">
        <DefinitionList.Row
          label="Name"
          description="John Doe"
        />
        <DefinitionList.Row
          label="Age"
          description="45"
        />
      </DefinitionList>
    )
    expect(wrapper.text()).to.equal('testNameJohn DoeAge45')
  })
})
