import {
  CxpClient_StoryFieldsFragment,
  useRecommendationStoriesQuery,
} from '@cxp/generated-cxp-client-types'
import { isServer, state, useShopConfiguration } from '@cxp/library-common-app'
import { useLanguageAndCountry } from '@cxp/library-common-app-static-resources'
import {
  determineOneTrustActiveGroups,
  gtmStoriesLoadedEvent,
  trackEvent,
} from '@cxp/library-common-app-tracking'
import { MobileSlider } from '@cxp/library-common-components'
import { PRUDSYS_SESSIONID, RECO_AS_STORIES_SERVICE_NAME } from '@cxp/library-common-utils'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSessionStorage } from 'react-use'
import { selectState } from '../../../../../state'
import { ProductOffCanvasName } from '../../product-off-canvases/type'
import { RecommendationStoriesThumbnail } from '../thumbnail'
import * as Styled from './recommendation-stories-slider.styled'

export type StoriesModuleProps = {
  onOffCanvasOpen: (offCanvasName: ProductOffCanvasName) => void
  categoryIpimId: string
  productIdWithColor?: string
}

export const RecommendationStoriesModule: FC<StoriesModuleProps> = ({
  onOffCanvasOpen,
  categoryIpimId,
  productIdWithColor,
}) => {
  const { prudsysRecommendationGroup, prudsysEnabled } = useShopConfiguration()
  const { setStories, cleanState } = selectState.storyOffCanvasState
  const [prudsysSessionId] = useSessionStorage(PRUDSYS_SESSIONID, '')
  const { language, country } = useLanguageAndCountry()
  const hasTargetingCookies = !isServer
    ? determineOneTrustActiveGroups().hasTargetingCookies
    : false

  const url = useLocation().pathname

  const { data, loading } = useRecommendationStoriesQuery({
    ssr: false,
    skip: !state.user.sessionId || !prudsysEnabled,
    variables: {
      service: RECO_AS_STORIES_SERVICE_NAME,
      categoryId: categoryIpimId,
      productId: productIdWithColor,
      sessionId: (prudsysSessionId || state.user.sessionId) ?? '',
      userId: (state.user.userId || state.user.sessionId) ?? '',
      locationId: `${language}-${country?.toUpperCase()}`,
      recommendation: prudsysRecommendationGroup,
      tracking: hasTargetingCookies,
    },
  })

  const trackStoriesLoad = (stories: CxpClient_StoryFieldsFragment[]) => {
    const storyList = stories.map((_, idx) => `story${idx + 1}`)
    trackEvent(gtmStoriesLoadedEvent(storyList.join(', ')))
  }

  useEffect(() => {
    if (!data || !data.recommendationStories.length) return

    setStories(data.recommendationStories)
    trackStoriesLoad(data.recommendationStories)
  }, [data])

  useEffect(() => {
    if (!url) return

    cleanState()
  }, [url])

  const renderStoriesSkeleton = () =>
    [...Array(4)].map((_, index) => <RecommendationStoriesThumbnail key={index} index={index} />)

  return (
    <Styled.RecommendationStoriesWrapper>
      <MobileSlider gap="s" itemWidth="unset" firstItemMarginLeft="s">
        {loading
          ? renderStoriesSkeleton()
          : data?.recommendationStories.map((story, index) => (
              <RecommendationStoriesThumbnail
                onOffCanvasOpen={onOffCanvasOpen}
                story={story}
                index={index}
                key={index}
              />
            ))}
      </MobileSlider>
    </Styled.RecommendationStoriesWrapper>
  )
}
