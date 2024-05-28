import { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'

export type StyledStoryLayoutDivProps = {
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

export type StyledStoryImageLayoutProps = {
  imageContainerHeight: number | undefined
}

export const StoryControllsWrapper = styled.div<StyledStoryImageLayoutProps>`
  display: flex;
  width: 100%;
  left: 0;
  position: fixed;
  z-index: 2;
  ${({ imageContainerHeight }) => css`
    height: ${imageContainerHeight}px;
  `}
`

export const TapRegionArea = styled.div<StyledStoryLayoutDivProps>`
  width: 25%;
  height: 100%;
  :active {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(255, 255, 255, 0) 80%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`

export const CentralRegionArea = styled.div<StyledStoryLayoutDivProps>`
  flex: 1;
  height: 100%;
`

export const StoryLayoutWrapper = styled.div`
  position: relative;
`
