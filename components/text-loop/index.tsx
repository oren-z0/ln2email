import styled, { keyframes } from 'styled-components';
import { media } from '@/lib/media';

const Wrapper = styled.span``;


interface TextLoopProps {
  texts: string[];
  animationDuration: number;
}

export default function TextLoop({
  texts, animationDuration,
}: TextLoopProps) {
  const rotate = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 35px, 0);
    position: relative;
  }
  
  ${(15 / texts.length)}%, ${(85 / texts.length)}% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    position: relative;
  }

  ${(100 / texts.length) - 0.1}% {
    opacity: 0;
    transform: translate3d(0, -25px, 0);
    position: relative;
  }
  
  ${(100 / texts.length)}%, 100% {
    opacity: 0;
    transform: translate3d(0, -25px, 0);
    position: absolute;
  }`;

  const LoopedTextPart = styled.div`
  position: absolute;
  opacity: 0;
  animation-name: ${rotate};
  animation-iteration-count: infinite;
  animation-duration: ${animationDuration * texts.length}ms;
  font-size: 18px;
  ${media.tablet`
    font-size: 24px;
  `}
  `;


  return (
    <Wrapper>
      {
        texts.map((text, index) => (
          <LoopedTextPart
            key={index}
            style={{ 
              animationDelay: `${animationDuration * index}ms`,
            }}
          >
            {text}
          </LoopedTextPart>
        ))
      }
    </Wrapper>
  )
}
