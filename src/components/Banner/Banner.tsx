import React from 'react'
import styled from 'styled-components'
import { lighten } from 'polished'

interface BannerProps {
  children: React.ReactNode
}

const BannerWrapper = styled.div`
  z-index: 100;
  width: 100%;
`

const BannerShape = styled.div`
  position: relative;
  z-index: 2;
  background: ${props =>
    `linear-gradient(0deg, ${props.theme.colors.darkGray}, ${lighten(
      0.125,
      props.theme.colors.darkGray,
    )})`};
  padding: ${props => props.theme.space[3]} ${props => props.theme.space[6]};
  clip-path: polygon(100% 0, 97.5% 50%, 100% 100%, 0% 100%, 2.5% 50%, 0% 0%);
`

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 0.125rem;
  text-align: center;
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes[4]};
  font-family: ${props => props.theme.fonts.heading};
`

const BannerShadow = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 50%;
  width: 85%;
  height: 100%;
  transform: translateX(-50%);
  box-shadow: 0 0 ${props => props.theme.space[5]} ${props => props.theme.colors.coral};
`

export default function Banner(props: BannerProps) {
  const { children } = props

  return (
    <BannerWrapper>
      <BannerShape>
        <BannerContent>{children}</BannerContent>
      </BannerShape>

      <BannerShadow />
    </BannerWrapper>
  )
}
