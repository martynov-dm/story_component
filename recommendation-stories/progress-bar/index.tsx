import { CxpClient_StoryOffCanvasDataFieldsFragment } from '@cxp/generated-cxp-client-types'
import { FC } from 'react'
import { storyOffCanvasState } from '../../../../../state/story-off-canvas-state'
import { getProductUsimWithColor } from '../../../../../utils/get-usim-with-color'
import { PRODUCT_TIME } from '../off-canvas/constants'
import * as Styled from './progress-bar.styled'
import { StoryProductProgressState } from './progress-bar.styled'

export type TimebarProps = {
  currentStoryProducts: CxpClient_StoryOffCanvasDataFieldsFragment[]
  viewedProducts: string[]
  isLoaded: boolean
}

export const ProgressBar: FC<TimebarProps> = ({
  currentStoryProducts,
  viewedProducts,
  isLoaded,
}) => {
  const { currentStoryIndex } = storyOffCanvasState

  const storyProductUsimList: string[] = currentStoryProducts.map(getProductUsimWithColor)

  const currentProgressState = (usimValue: string): StoryProductProgressState => {
    const lastViewedProduct = viewedProducts[viewedProducts.length - 1]
    const isProductLastViewed = lastViewedProduct === usimValue

    if (isProductLastViewed && isLoaded) {
      return 'active'
    }

    if (isProductLastViewed && !isLoaded) {
      return 'pending'
    }

    if (viewedProducts.includes(usimValue) && !isProductLastViewed) {
      return 'completed'
    }

    return undefined
  }

  return (
    <Styled.ProgressBarWrapper>
      {storyProductUsimList.map((storyProductUsim, index) => (
        <Styled.ProgressBarItem key={`${currentStoryIndex}-${index}`}>
          <Styled.ProgressBar
            animationDelay={`${index === 0 ? 0 : 500}ms`}
            animationTime={`${PRODUCT_TIME}ms`}
            progressBarState={currentProgressState(storyProductUsim)}
          />
        </Styled.ProgressBarItem>
      ))}
    </Styled.ProgressBarWrapper>
  )
}
