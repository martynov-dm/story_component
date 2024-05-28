import { Copy, Image as ImageBase } from '@cxp/library-common-components'
import styled, { css, keyframes } from 'styled-components'

const imageFadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export const StoryOffCanvasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--cxp-spacing-s);
`

export const StoryHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--cxp-spacing-s) 0;
  gap: var(--cxp-spacing-m);
`

export const StoryImageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StoryActionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--cxp-spacing-xs);
  margin-top: calc(var(--cxp-spacing-m) * -1);
  z-index: var(--cxp-z-index-overlay);
  min-height: var(--cxp-spacing-xl);
`

export const CloseButton = styled.button.attrs({
  type: 'button',
})`
  &:focus {
    outline: none;
  }
`

export const StoryProductName = styled(Copy).attrs({
  forwardedAs: 'span',
  variant: 'mediumBold',
  truncate: true,
})``

export const StoryImage = styled(ImageBase)<{
  $isLoaded: boolean
}>`
  image-rendering: -webkit-optimize-contrast;
  :-moz-loading {
    color: transparent;
  }

  ${({ $isLoaded }) => {
    if ($isLoaded) {
      return css`
        animation: ${imageFadeIn} ease 750ms;
      `
    }
    return css`
      opacity: 0;
    `
  }}
`

export const CategoryLabel = styled.div`
  position: absolute;
  left: var(--cxp-spacing-s);
  display: flex;
  padding: var(--cxp-spacing-xs) var(--cxp-spacing-s);
  border-radius: var(--cxp-spacing-m);
  background: var(--cxp-color-background-tertiary-01, #000);
  top: 50%;
  transform: translateY(-50%);
`

export const PriceLabel = styled.div`
  position: absolute;
  bottom: 80px;
  right: var(--cxp-spacing-s);
  padding: var(--cxp-spacing-xs) var(--cxp-spacing-s);
  border-radius: var(--cxp-spacing-m);
  background: var(--cxp-color-background-tertiary-01, #000);
`
