import { Button, Link } from 'govuk-react'
import styled, { css } from 'styled-components'
import {
  GREY_2,
  GREY_4,
  BLACK,
  DARK_BLUE_LEGACY,
  WHITE,
} from '../../../utils/colours'
import { Tag } from '../../../components'

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
  display: block;
  transform: translateZ(-1px);
`

export const HierarchyContents = styled.div`
  padding-bottom: 10px;
`

export const HierarchyItemContents = styled.div`
  background-color: ${({ isRequestedCompanyId }) =>
    isRequestedCompanyId ? DARK_BLUE_LEGACY : GREY_4};
  border: 1px solid ${GREY_2};
  min-height: 60px;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  ${({ isRequestedCompanyId }) =>
    isRequestedCompanyId &&
    `
    color: ${WHITE};
  `}
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
      
      :before {
        ${horizontalLine}
        background-color: ${GREY_2};
        top: 16px;
        left: -40px;
      }
  `}
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
    left: -29px;
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
        height: ${isFinalItemInLevel ? '48px' : 'calc(100% + 40px)'};
        top: ${isFinalItemInLevel ? '-20px' : '-18px'};
        left: -29px;
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
  margin-left: 10px;
`
