import React from 'react'
import styled from 'styled-components'

interface BannerProps {
  children: React.ReactNode
}

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 0.125rem;
  background-color: ${props => props.theme.colors.gray};
  padding: ${props => props.theme.space[3]};
  width: 100%;
  max-width: 33vw;
  text-align: center;
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes[4]};
  font-family: ${props => props.theme.fonts.heading};
  clip-path: polygon(100% 0, 97.5% 50%, 100% 100%, 0% 100%, 2.5% 50%, 0% 0%);
`

export default function Banner(props: BannerProps) {
  const { children } = props

  return <Wrapper>{children}</Wrapper>
}
