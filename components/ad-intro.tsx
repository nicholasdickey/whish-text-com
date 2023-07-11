import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Typography from '@mui/material/Typography';

// Animation keyframes for line animation
const LineAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled components
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  color: #fff;
  text-decoration: none;
`;

const Line = styled.span<{ animationDelay: number; fontSize: number }>`
  margin: 0px;
  opacity: 0;
  text-decoration: none;
  animation: ${LineAnimation} 0.5s ease-in-out forwards;
  animation-delay: ${({ animationDelay }) => `${animationDelay}s`};
  font-size: ${({ fontSize }) => `${fontSize}px`};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: -20px;
  left: auto;
  padding: 0px;
  z-index: 999;
  font-size: 14px;
  transition: opacity 0.5s ease-in-out;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
`;

const Anchor = styled.a`
  width: '100%';
  position: 'relative';
  text-decoration: none;
`;

interface TextComponentProps {
  ad: {
    text: string[];
    bottomLink: string;
    loadingText: string[];
  };
}

const TextComponent: React.FC<TextComponentProps> = ({ ad }: TextComponentProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(ad.loadingText[0]);
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    // Add lines one by one to the component
    const timer = setInterval(() => {
      if (lines.length < ad.text.length) {
        setLines((prevLines) => [...prevLines, ad.text[prevLines.length]]);
      } else {
        clearInterval(timer);
      }
    }, 1);

    return () => {
      clearInterval(timer);
    };
  }, [lines, ad.text]);

  useEffect(() => {
    // Cycle through loading texts
    const timer = setInterval(() => {
      if (loadingIndex < ad.loadingText.length - 1) {
        setLoadingIndex((prevIndex) => prevIndex + 1);
        setLoading('');
      } else {
        clearInterval(timer);
      }
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [loadingIndex, ad.loadingText]);

  useEffect(() => {
    // Update loading text
    const timer = setInterval(() => {
      setLoading(ad.loadingText[loadingIndex]);
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [loadingIndex, ad.loadingText]);

  return (
    <Anchor target="_sponsor" href={`${ad.bottomLink}`}>
      <TextContainer>
        <LoadingOverlay style={{ opacity: loading !== '' ? 0.5 : 0 }}>{`${loading}...`}</LoadingOverlay>
        {lines.map((line, index) => (
          <Line
            key={index}
            animationDelay={index * 0.5}
            fontSize={index === ad.text.length - 1 ? 12 : 16 + index * 8}
          >
            {line}
          </Line>
        ))}
      </TextContainer>
    </Anchor>
  );
};

export default TextComponent;
