import React from 'react'
import styled from 'styled-components'

interface AvatarProps {
  children: any
}

const Portrait = styled.div<{ artwork?: string }>`
  height: 10rem;
  width: 10rem;
  padding: 1rem;
  background-image: ${props => `url(${props.artwork})`};
  background-size: cover;
  border-radius: 50%;
  border: ${props => props.theme.space[1]} solid ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows[0]};
  margin-bottom: ${props => props.theme.space[3]};
`

const Stats = styled.div`
  color: ${props => props.theme.colors.darkGray};
  text-align: center;
`

const Stat = styled.div`
  color: ${props => props.theme.colors.gray};
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes[1]};
  margin-top: ${props => props.theme.space[1]};
`

const Name = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: 0.0125rem;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
`

function Avatar(props: AvatarProps) {
  const { children } = props

  return <div>{children}</div>
}

Portrait.displayName = 'Avatar.Portrait'
Avatar.Portrait = Portrait
Stats.displayName = 'Avatar.Stats'
Avatar.Stats = Stats
Stat.displayName = 'Avatar.Stat'
Avatar.Stat = Stat
Name.displayName = 'Avatar.Name'
Avatar.Name = Name

export default Avatar
