import { CxpClient_StoryFieldsFragment } from '@cxp/generated-cxp-client-types'
import { gtmStoriesViewedEvent, trackEvent } from '@cxp/library-common-app-tracking'
import {
  Image,
  ImageConfig,
  productImageDefaultTransformations,
} from '@cxp/library-common-components'
import { FC, useState } from 'react'
import { selectState } from '../../../../../state'
import { getProductUsimWithColor } from '../../../../../utils/get-usim-with-color'
import { ProductOffCanvasName } from '../../product-off-canvases/type'
import * as Styled from './recommendation-stories-thumbnail.styled'

export type ThumbnailProps = {
  story?: CxpClient_StoryFieldsFragment
  onOffCanvasOpen?: (offCanvasName: ProductOffCanvasName) => void
  index: number
}

const imageConfig: ImageConfig = {
  xs: {
    ...productImageDefaultTransformations,
    width: 72,
    aspectRatio: '3:4',
  },
}

export const RecommendationStoriesThumbnail: FC<ThumbnailProps> = ({
  story,
  onOffCanvasOpen,
  index,
}) => {
  const { setCurrentProduct, setCurrentStoryIndex, productsHistory, setCurrentProductIndex } =
    selectState.storyOffCanvasState
  const isViewed = !!story?.products.every(product =>
    productsHistory.has(getProductUsimWithColor(product)),
  )

  const [isPressed, setIsPressed] = useState(false)

  const offCanvasData = story?.products[0]
  const selectedVariant = offCanvasData?.selectedVariant

  const image = selectedVariant?.modelImage || selectedVariant?.variantImage

  const handleTouchStart = () => {
    setIsPressed(true)
  }

  const handleTouchEnd = () => {
    if (offCanvasData && onOffCanvasOpen) {
      setCurrentProduct(offCanvasData)
      setCurrentStoryIndex(index)
      setCurrentProductIndex(index)

      onOffCanvasOpen('RecommendationStories')
      setIsPressed(false)

      trackEvent(gtmStoriesViewedEvent(`story${index + 1}`))
    }
  }

  return (
    <Styled.ThumbnailCircle
      isViewed={isViewed}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Styled.ThumbnailImageWrapper isPressed={isPressed}>
        {image && (
          <Image
            file={image.file}
            folder={image.folder}
            config={imageConfig}
            alt={offCanvasData?.name || ''}
          />
        )}
      </Styled.ThumbnailImageWrapper>
    </Styled.ThumbnailCircle>
  )
}
