import React from 'react'

import ActivityCardNotes from '../../../../../../src/client/components/ActivityFeed/activities/card/ActivityCardNotes'

describe('ActivityCardNotes', () => {
  const Component = (props) => <ActivityCardNotes {...props} />
  const shortNotes =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  const mediumNotes =
    'Nam auctor massa nec nunc efficitur, et egestas arcu volutpat. Aliquam commodo at justo ut gravida. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.'
  const longNotes =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fringilla faucibus commodo. Proin auctor tellus elementum diam dapibus aliquet sed eu orci. Ut sodales urna lectus, ac iaculis urna eleifend eget. In fermentum ligula eu erat imperdiet rutrum. Donec consequat pretium ornare. Maecenas faucibus convallis ligula nec congue'

  context('default max length', () => {
    context('When the notes length is less than max length', () => {
      it('should show the whole note', () => {
        cy.mount(<Component notes={mediumNotes} />)
        cy.get('[data-test="activity-card-notes"]').should(
          'have.text',
          mediumNotes + ' '
        )
      })
    })

    context('When the notes length is greater than the max length', () => {
      it('should show the note cropped at max length', () => {
        cy.mount(<Component notes={longNotes} />)
        cy.get('[data-test="activity-card-notes"]').should(
          'have.text',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fringilla faucibus commodo. Proin auctor tellus elementum diam dapibus aliquet sed eu orci. Ut sodales urna lectus, ac iaculis urna eleifend eget. In fermentum ligula eu erat imperdiet rutrum. ... '
        )
      })
    })
  })
  context('custom max length', () => {
    context('When the notes length is less than max length', () => {
      it('should show the whole note', () => {
        cy.mount(<Component maxLength={100} notes={shortNotes} />)
        cy.get('[data-test="activity-card-notes"]').should(
          'have.text',
          shortNotes + ' '
        )
      })
    })

    context('When the notes length is greater than the max length', () => {
      it('should show the note cropped at max length', () => {
        cy.mount(<Component maxLength={100} notes={mediumNotes} />)
        cy.get('[data-test="activity-card-notes"]').should(
          'have.text',
          'Nam auctor massa nec nunc efficitur, et egestas arcu volutpat. Aliquam commodo at justo ut gravida. ... '
        )
      })
    })
  })
})
