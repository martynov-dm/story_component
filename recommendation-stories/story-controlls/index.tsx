import { ReactNode } from 'react'
import * as Styled from './story-image-layout.styled'

type Props = {
  onLeftClick: () => void
  onRightClick: () => void
  imageContainerHeight: number | undefined
  children: ReactNode
}
export const StoryControlls = ({
  onLeftClick,
  onRightClick,
  imageContainerHeight,
  children,
}: Props) => (
  <Styled.StoryLayoutWrapper>
    <Styled.StoryControllsWrapper imageContainerHeight={imageContainerHeight}>
      <Styled.TapRegionArea onClick={onLeftClick} />
      <Styled.CentralRegionArea />
      <Styled.TapRegionArea onClick={onRightClick} />
    </Styled.StoryControllsWrapper>
    {children}
  </Styled.StoryLayoutWrapper>
)
