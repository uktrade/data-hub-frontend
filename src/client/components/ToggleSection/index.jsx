import React from 'react'
import PropTypes from 'prop-types'

import { VARIANTS } from '../../../common/constants'

import multiInstance from '../../utils/multiinstance'
import { TOGGLE_SECTION__TOGGLE } from '../../actions'

import PrimaryToggleSection from './PrimaryToggleSection'
import SecondaryToggleSection from './SecondaryToggleSection'

const ToggleSection = ({ variant = VARIANTS.PRIMARY, ...props }) =>
  variant === VARIANTS.PRIMARY ? (
    <PrimaryToggleSection {...props} />
  ) : (
    <SecondaryToggleSection {...props} />
  )

ToggleSection.propTypes = {
  id: PropTypes.string,
  variant: PropTypes.string,
  label: PropTypes.string,
  badge: PropTypes.node,
  open: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  major: PropTypes.bool,
}

export default multiInstance({
  name: 'ToggleSection',
  actionPattern: 'TOGGLE_SECTION__',
  dispatchToProps: (dispatch) => ({
    open: (isOpen) =>
      dispatch({
        type: TOGGLE_SECTION__TOGGLE,
        isOpen,
      }),
  }),
  component: ToggleSection,
  reducer: (state = {}, { type, isOpen }) => {
    switch (type) {
      case TOGGLE_SECTION__TOGGLE:
        return {
          ...state,
          isOpen,
        }
      default:
        return state
    }
  },
})
