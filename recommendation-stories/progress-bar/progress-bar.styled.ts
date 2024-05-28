import styled, { css, keyframes } from 'styled-components'

export type StoryProductProgressState = 'active' | 'completed' | 'pending' | undefined

const progressAnimation = keyframes`
  0% { width: 0% }
  100% { width: 100% }
`

export const ProgressBarWrapper = styled.div`
  display: flex;
  padding-bottom: var(--cxp-spacing-s);
`

export const ProgressBarItem = styled.div`
  height: var(--cxp-spacing-xxs);
  flex-grow: 1;
  border-radius: 99px;
  margin: 0 5px;
  display: flex;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.4);
  background-position: 100% 50%;
`

export const ProgressBar = styled.div<{
  animationDelay: string
  animationTime: string
  progressBarState?: StoryProductProgressState
}>`
  height: 100%;
  border-radius: 99px;
  background: var(--cxp-color-background-primary);
  /* Few more states can be modified */
  ${({ animationDelay, animationTime, progressBarState }) => {
    switch (progressBarState) {
      case 'active': {
        return css`
          animation: ${progressAnimation} linear ${animationTime} forwards;
          animation-delay: ${animationDelay};
        `
      }

      case 'completed': {
        return css`
          width: 100%;
        `
      }
      case 'pending':
      default: {
        return css``
      }
    }
  }}
`
