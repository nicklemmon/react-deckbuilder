import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 10rem;
`

export const PortraitImg = styled.div<{ artwork?: string }>`
  position: relative;
  overflow: hidden;
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

export const Name = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  margin-bottom: ${props => props.theme.space[1]};
  letter-spacing: 0.0125rem;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
  text-align: center;
`

export const Flash = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
`

export const FeedbackText = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes[3]};
  color: ${props => props.theme.colors.pink};
  text-shadow: 0 0 15px ${props => props.theme.colors.white},
    0 2px 0 ${props => props.theme.colors.darkPink};
`
