import React from 'react'
import styled from 'styled-components'

interface BannerProps {
  children: React.ReactNode
}

const BannerWrapper = styled.div`
  z-index: 100;
  width: 100%;
  filter: ${props => `drop-shadow(0 0 ${props.theme.space[5]} ${props.theme.colors.coral})`};
`

const BannerShape = styled.div`
  background: ${props =>
    `linear-gradient(0deg, ${props.theme.colors.darkGray}, rgba(0, 0, 0, 0.7))`};
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

export default function Banner(props: BannerProps) {
  const { children } = props

  return (
    <BannerWrapper>
      <BannerShape>
        <BannerContent>{children}</BannerContent>
      </BannerShape>
    </BannerWrapper>
  )
}
