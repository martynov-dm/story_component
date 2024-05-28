import { PRODUCT_IMAGE_BACKGROUND_COLOR } from '@cxp/library-common-utils'
import styled, { css } from 'styled-components'

const circleSize = '72px'
const imageSize = '64px'
const imagePressedSize = '68px'

export const ThumbnailCircle = styled.button<{ isViewed: boolean }>`
  --circle-size: ${circleSize};
  --border-color: var(--cxp-color-support-success);

  margin: var(--cxp-spacing-s) 0;

  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: var(--circle-size);
  height: var(--circle-size);
  border-radius: var(--cxp-border-radius-full);
  box-shadow: inset 0 0 0 var(--cxp-spacing-xxxs) var(--border-color);
  outline: none;

  ${({ isViewed }) =>
    isViewed &&
    css`
      --border-color: var(--cxp-color-border-secondary);
    `}
`

export const ThumbnailImageWrapper = styled.span<{ isPressed: boolean }>`
  --image-size: ${imageSize};

  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: var(--image-size);
  height: var(--image-size);
  overflow: hidden;
  border-radius: var(--cxp-border-radius-full);
  background-color: #${PRODUCT_IMAGE_BACKGROUND_COLOR};

  ${({ isPressed }) =>
    isPressed &&
    css`
      --image-size: ${imagePressedSize};
    `}
`
