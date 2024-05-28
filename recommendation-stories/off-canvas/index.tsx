import { CxpClient_StoryOffCanvasDataFieldsFragment } from '@cxp/generated-cxp-client-types'
import {
  OffCanvas,
  state,
  useGeoLayerContext,
  useTrackPrudsys,
  useWishlistActions,
  WishlistIcon,
  WishlistProps,
} from '@cxp/library-common-app'
import { useGlobalSnippets } from '@cxp/library-common-app-static-resources'
import {
  gtmAddToWishlistEvent,
  gtmStoriesViewedEvent,
  gtmViewItemEventForRecoStories,
  ProductTrackingData,
  trackEvent,
} from '@cxp/library-common-app-tracking'
import {
  Button,
  getSources,
  IconClose,
  ImageTransformations,
  Spacer,
  Spinner,
} from '@cxp/library-common-components'
import { isNotMaybe, PRODUCT_IMAGE_BACKGROUND_COLOR } from '@cxp/library-common-utils'
import { FC, MouseEvent, useEffect, useMemo, useState } from 'react'
import { useToggle, useWindowSize } from 'react-use'
import { useSnapshot } from 'valtio'
import { selectState } from '../../../../../state'
import { ProductWithStoryIndex } from '../../../../../state/story-off-canvas-state'
import { cacheImages } from '../../../../../utils/cache-images'
import { getProductIndex } from '../../../../../utils/get-product-index'
import { getProductUsimWithColor } from '../../../../../utils/get-usim-with-color'
import { ProgressBar } from '../progress-bar'
import { StoryControlls } from '../story-controlls'
import { PRODUCT_TIME } from './constants'
import * as Styled from './recommendation-stories-off-canvas.styled'

export type StoriesOffCanvasProps = {
  onClose: () => void
}

const productImageDefaultTransformations: ImageTransformations = {
  backgroundColor: `rgb:${PRODUCT_IMAGE_BACKGROUND_COLOR}`,
  crop: 'scale',
  aspectRatio: '10:16',
}

export const RecommendationStoriesOffCanvas: FC<StoriesOffCanvasProps> = ({ onClose }) => {
  const { storyOffCanvasState } = useSnapshot(selectState)
  const {
    stories,
    currentStoryIndex,
    currentProduct,
    currentProductIndex,
    getNextProductAndStoryIndex,
    getPreviousProductAndStoryIndex,
    setCurrentStoryIndex,
    setCurrentProduct,
    setCurrentProductIndex,
    setProductsHistory,
  } = storyOffCanvasState

  const { toggleWishlistState: toggleWishlistStateGlobal } = useWishlistActions()

  const [imageContainerRef, setRef] = useState<HTMLDivElement | null>(null)
  const [viewedProducts, setViewedProducts] = useState<string[]>([])
  const [isLoaded, toggleIsLoaded] = useToggle(false)
  const { currency: localCurrency } = useGeoLayerContext()

  const { name, usim, selectedVariant } = currentProduct || {}
  const { uri } = selectedVariant

  const imageContainerHeight = imageContainerRef?.offsetHeight
  const imageConfig = {
    xs: { ...productImageDefaultTransformations, height: imageContainerHeight },
  }
  const { width } = useWindowSize()

  const snippets = useGlobalSnippets('pdp.offcanvas', ['stories_go_to_product'])

  const currentStoryProducts: CxpClient_StoryOffCanvasDataFieldsFragment[] = (
    stories[currentStoryIndex]?.products || []
  ).filter(isNotMaybe)

  const updateStory = (nextOrPreviousStory: ProductWithStoryIndex | null, isPrevious = false) => {
    if (!nextOrPreviousStory?.product) return onClose()

    if (isPrevious) {
      setViewedProducts(
        viewedProducts.filter(item => item !== getProductUsimWithColor(currentProduct)),
      )
    }

    setCurrentProduct(nextOrPreviousStory.product)

    if (currentStoryIndex !== nextOrPreviousStory.storyIndex) {
      toggleIsLoaded(false)
      setCurrentStoryIndex(nextOrPreviousStory.storyIndex)
      trackEvent(gtmStoriesViewedEvent(`story${nextOrPreviousStory.storyIndex + 1}`))
    }
  }

  // Next Story Loading event, used in trigger and useEffect
  const nextStoryTrigger = () => updateStory(getNextProductAndStoryIndex())

  // Previous Story Loading event, used in trigger
  const previousStoryTrigger = () => updateStory(getPreviousProductAndStoryIndex(), true)

  const image = selectedVariant?.modelImage || selectedVariant?.variantImage
  const { grossPriceFormatted } = selectedVariant.price

  const categoryLabel = currentProduct.breadcrumb[currentProduct.breadcrumb.length - 2]?.name

  const isOnWishList = state.wishlist.isOnWishlist(usim, selectedVariant.color.colorCode)
  const toggleWishlistState = (event: MouseEvent, productWishList: WishlistProps) => {
    event.preventDefault()
    event.stopPropagation()
    // eslint-disable-next-line functional/no-expression-statement
    toggleWishlistStateGlobal?.(productWishList.usim, productWishList.colorId)
  }

  // We need to memoize this object to avoid rerenders
  const productImagesSources = useMemo(() => {
    if (imageContainerHeight) {
      return currentStoryProducts.map(product => {
        const imageObject =
          product.selectedVariant.modelImage || product.selectedVariant.variantImage
        if (!imageObject?.file || !imageObject.folder) return undefined
        const { folder, file } = imageObject

        return getSources({ folder, file }, imageConfig)
      })
    }
    return undefined
  }, [currentStoryProducts, imageContainerHeight])

  useEffect(() => {
    if (!productImagesSources) return

    const srcSets = productImagesSources
      .map(sources => sources && sources[0]?.srcSet)
      .filter(isNotMaybe)
    cacheImages(srcSets, toggleIsLoaded)
  }, [productImagesSources])

  // handling landscape case
  useEffect(() => {
    if (width >= 768) {
      return onClose()
    }
  }, [width])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isLoaded) {
      timer = setTimeout(nextStoryTrigger, PRODUCT_TIME)
    }

    return () => clearTimeout(timer)
  }, [currentProduct, viewedProducts, isLoaded])
  const trackPrudsysClick = useTrackPrudsys(
    { skip: true },
    {
      event: 'CLICK',
      pid: `${currentProduct?.usim}-${selectedVariant?.color.colorCode}`,
      trackingtoken: currentProduct.prudsysTrackingToken,
    },
  )
  useEffect(() => {
    // if we open a product it's added to viewed
    setViewedProducts((positions: string[]) =>
      Array.from(new Set([...positions, getProductUsimWithColor(currentProduct)])),
    )
    const currentProductIndexNew = getProductIndex(currentStoryProducts, currentProduct)

    setCurrentProductIndex(currentProductIndexNew)
    setProductsHistory(getProductUsimWithColor(currentProduct))
    // we have to write a logic here to check if the storyIndex reached max we have to reset it to 0
  }, [storyOffCanvasState])

  if (!currentProduct || !selectedVariant || !usim || !uri || !name) return null

  const currentProductSources =
    (productImagesSources && productImagesSources[currentProductIndex]) || []

  return (
    <OffCanvas
      backgroundColor="--cxp-color-background-tertiary-01"
      textColor="--cxp-color-text-inverse"
      variant="mobile-fullwidth"
      onClose={onClose}
      isOpen
    >
      <Styled.StoryOffCanvasWrapper>
        <ProgressBar
          currentStoryProducts={currentStoryProducts}
          viewedProducts={viewedProducts}
          isLoaded={isLoaded}
        />
        <Styled.StoryHeaderWrapper>
          <Spacer size="m" />
          <Styled.StoryProductName>{name}</Styled.StoryProductName>
          <Styled.CloseButton onClick={onClose}>
            <IconClose />
          </Styled.CloseButton>
        </Styled.StoryHeaderWrapper>
        {!isLoaded && <Spinner />}
        <Styled.StoryImageWrapper ref={setRef}>
          <StoryControlls
            onLeftClick={previousStoryTrigger}
            onRightClick={nextStoryTrigger}
            imageContainerHeight={imageContainerHeight}
          >
            {image && imageContainerHeight && currentProductSources && (
              <>
                <Styled.StoryImage
                  $isLoaded={isLoaded}
                  loading="lazy"
                  radius="s"
                  extSources={currentProductSources}
                  alt={name}
                  file=""
                  folder=""
                  config={{}}
                />
                {isLoaded && <Styled.CategoryLabel>{categoryLabel}</Styled.CategoryLabel>}
                {isLoaded && <Styled.PriceLabel>{grossPriceFormatted}</Styled.PriceLabel>}
              </>
            )}
          </StoryControlls>
        </Styled.StoryImageWrapper>
        <Styled.StoryActionsWrapper>
          {isLoaded && (
            <Button
              to={{ type: 'Internal', url: uri }}
              variant="secondary"
              width="auto"
              disabled={!isLoaded}
              label={snippets.stories_go_to_product}
              onClick={() => {
                trackPrudsysClick()
                trackEvent(
                  gtmViewItemEventForRecoStories(
                    currentProduct,
                    selectedVariant,
                    localCurrency ?? 'EUR',
                    `Product_RecoStories${currentStoryIndex + 1}`,
                    currentProductIndex,
                    name,
                  ),
                )
              }}
            />
          )}
          {isLoaded && (
            <Button
              variant="secondary"
              width="xl"
              disabled={!isLoaded}
              onClick={event => {
                trackPrudsysClick()
                toggleWishlistState(event, {
                  usim,
                  colorId: selectedVariant?.color.colorCode || '',
                })

                trackEvent(
                  gtmAddToWishlistEvent(
                    {
                      __typename: 'ProductAndVariant',
                      product: currentProduct as ProductTrackingData,
                      variant: selectedVariant,
                    },
                    localCurrency ?? 'EUR',
                    currentProductIndex,
                    `Product_RecoStories${currentStoryIndex + 1}`,
                    selectedVariant.price.grossPrice ?? 0,
                    undefined,
                    name,
                  ),
                )
              }}
              icon={<WishlistIcon isOnWishlist={isOnWishList} />}
            />
          )}
        </Styled.StoryActionsWrapper>
      </Styled.StoryOffCanvasWrapper>
    </OffCanvas>
  )
}
