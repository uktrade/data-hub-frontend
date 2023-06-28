import { Button, Link } from 'govuk-react'
import styled from 'styled-components'
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
import { FONT_SIZE } from '@govuk-react/constants'

export const HierarchyContents = styled.div`
  padding-bottom: 10px;
`

export const HierarchyItemContents = styled.div`
  ${ToggleSection} {
    fill: orange;
    margin-bottom: 0px;
    padding-bottom: 0px;
    img {
      width: ${FONT_SIZE.SIZE_16};
      height: ${FONT_SIZE.SIZE_16};
      ${({ isRequestedCompanyId }) =>
        isRequestedCompanyId
          ? `filter: invert(100%); # make the svg the WHITE colour as the text`
          : `filter: invert(34%) sepia(81%) saturate(1079%) hue-rotate(181deg)
        brightness(87%) contrast(87%); # make the svg the BLUE colour as the text`}
    }
    > div {
      padding: 0px;
    }
    ${ToggleButton} {
      font-size: ${FONT_SIZE.SIZE_16};
      padding: 10px 15px 15px 15px;
      ${({ isRequestedCompanyId }) =>
        isRequestedCompanyId ? `color: white;` : ``}
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
    hierarchy != 1 &&
    `
      transform-style: preserve-3d;
      :before { //This is the horizontal line to the left of the div
        content: '';
        background-color: ${GREY_2};
        position: relative;
        width: 100px;
        height: 5px;
        top: 16px;
        left: -30px;
        display: block;
        transform: translateZ(-1px);
      }
  `}
`

export const HierarchyItemHeading = styled.div`
  padding: 15px;
`

export const SubsidiaryList = styled.ul`
  padding-left: 25px;
  margin-left: 25px;
  margin-top: 20px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  transform-style: preserve-3d;
`
export const StyledButton = styled(Button)``

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
        //This is the vertical line that stretches between the child companies
        content: '';
        background-color: ${GREY_2};
        position: absolute;
        width: 5px;
        height: ${isFinalItemInLevel ? '42px' : 'calc(100% + 40px)'};
        top: ${isFinalItemInLevel ? '-20px' : '-18px'};
        left: -29px;
        display: block;
        transform: translateZ(-1px);
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
  margin-left: 15px;
`

export const ToggleSectionHighlighted = styled(ToggleSection)`
  div[data-test='requested-company'] ToggleButton {
    color: white;
  }
`

export const InlineDescriptionList = styled.dl`
  padding: 15px;
  background-color: ${GREY_4};
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
