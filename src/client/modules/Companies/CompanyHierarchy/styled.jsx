import { Button, Link, GridCol } from 'govuk-react'
import styled, { css } from 'styled-components'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import {
  GREY_2,
  GREY_4,
  BLACK,
  DARK_BLUE_LEGACY,
  WHITE,
  DARK_GREY,
} from '../../../utils/colours'
import { Tag, ToggleSection } from '../../../components'
import { ToggleButton } from '../../../components/ToggleSection/BaseToggleSection'
import AccessibleLink from '../../../components/Link'

const horizontalLine = css`
  //This is the horizontal line to the left of the div
  content: '';
  background-color: ${GREY_2};
  position: relative;
  width: 100px;
  height: 5px;
  display: block;
  transform: translateZ(-1px);
`
const verticalLine = css`
  //This is the vertical line that stretches between the child companies
  content: '';
  background-color: ${GREY_2};
  position: absolute;
  width: 5px;
  left: -29px;
  display: block;
  transform: translateZ(-1px);
`

export const HierarchyContents = styled.div`
  padding-bottom: 10px;
`

export const HierarchyItemContents = styled.div`
  ${ToggleSection} {
    margin-bottom: 0px;
    padding-bottom: 0px;
    svg {
      width: ${FONT_SIZE.SIZE_16};
      height: ${FONT_SIZE.SIZE_16};
    }
    > div {
      padding: 0px;
    }
    ${ToggleButton} {
      font-size: ${FONT_SIZE.SIZE_16};
      padding: 10px 15px 15px 15px;
      ${({ isRequestedCompanyId }) =>
        isRequestedCompanyId ? `color: ${WHITE};` : ``}
    }
  }

  background-color: ${({ isRequestedCompanyId }) =>
    isRequestedCompanyId ? DARK_BLUE_LEGACY : GREY_4};
  border: 1px solid ${GREY_2};
  min-height: 60px;

  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;

  ${Link} {
    width: fit-content;
    ${({ isRequestedCompanyId }) =>
      isRequestedCompanyId &&
      `
    color: ${WHITE};
  `}
  }
  ${({ hierarchy }) =>
    hierarchy &&
    hierarchy != 1 &&
    `
      transform-style: preserve-3d;

      :before {
        ${horizontalLine}
        background-color: ${GREY_2};
        top: 16px;
        left: -30px;
      }
  `}
`

export const HierarchyItemHeading = styled.div`
  padding: 15px;

  :first-child {
    line-height: 30px;
  }
`

export const SubsidiaryList = styled.ul`
  padding-left: 25px;
  margin-left: 25px;
  margin-top: 20px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  transform-style: preserve-3d;
`
export const StyledButton = styled(Button)``

export const StyledLinkedSubsidiaryButton = styled.div`
  margin-top: 20px;

  transform-style: preserve-3d;

  :before {
    ${horizontalLine}
    top: 22px;
    left: -29px;
  }

  :after {
    ${verticalLine}
    height: 48px;
    top: -21px;
  }
`

export const ToggleSubsidiariesButtonContent = styled.div`
  padding-top: 20px;
  ${StyledButton} {
    ${({ insideTree }) =>
      insideTree &&
      `
      :before {
        content: '';
        background-color: ${GREY_2};
        position: absolute;
        width: 5px;
        height: 64%;
        top: -23px;
        left: 19px;
        display: block;
        transform: translateZ(-1px);
      }

  `}
    z-index: 1;
    margin-bottom: 0px;
    span:nth-child(1) {
      padding-right: 10px;
    }
  }
`

export const HierarchyListItem = styled.li`
  position: relative;
  ${({ globalParent, isFinalItemInLevel }) =>
    !globalParent &&
    `
      :before {
        ${verticalLine}
        background-color: ${GREY_2};
        height: ${isFinalItemInLevel ? '40px' : 'calc(100% + 40px)'};
        top: ${isFinalItemInLevel ? '-20px' : '-18px'};
      }
  `}
`

export const ManuallyLinkedHierarchyListItem = styled.li`
  transform: translateZ(-1px);
`

export const HierarchyHeaderContents = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: bottom;
  border-bottom: 4px solid ${BLACK};
  ${ToggleSubsidiariesButtonContent} {
    padding-top: 0px;
  }
  > h2 {
    margin-bottom: 10px;
    > span {
      font-size: 24px;
    }
  }
`

export const HierarchyTag = styled(Tag)`
  float: right;
  margin-left: ${SPACING.SCALE_3};
  margin-top: ${SPACING.SCALE_1};
`

export const InlineDescriptionList = styled.dl`
  padding: 15px;
  background-color: WHITE;
  border-top: 1px solid ${GREY_2};
  dt,
  dd {
    display: inline;
    font-size: ${FONT_SIZE.SIZE_16};
    font-height: 1;
  }
  dt {
    color: ${DARK_GREY};
  }
  dd:before {
    content: ' ';
  }
  dd:after {
    content: ' ';
    display: block;
  }
`

export const AddCompanyLinkDiv = styled('div')`
  padding: 15px;
`

export const AddCompanyLink = styled(AccessibleLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

export const GridColTags = styled(GridCol)`
  setwidth: one-third;
  float: right;
  width: auto;
`

export const GridColHeader = styled(GridCol)`
  setwidth: two-thirds;
  float: left;
  padding-left: 0px;
`

export const TradingNames = styled.div`
  font-size: ${FONT_SIZE.SIZE_16};
  ${({ isRequestedCompanyId }) =>
    isRequestedCompanyId ? `color: ${WHITE};` : `color: ${DARK_GREY};`}
`
