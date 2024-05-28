import styled from 'styled-components'

export const RecommendationStoriesWrapper = styled.div`
  --column-start: 1;
  --column-end: 5;

  grid-column-start: var(--column-start);
  grid-column-end: var(--column-end);

  div ul li {
    display: flex;
    align-items: center;
  }
`
