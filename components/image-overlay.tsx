import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material/';
import ReactMarkdown from 'react-markdown';

interface ImageOverlayProps {
  text: string;
  image: string;
}

const ImageContainer = styled.div<{ imageUrl: string }>`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 'auto';
  //padding-bottom: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const OverlayText = styled(Typography)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
`;

const ImageOverlay: React.FC<ImageOverlayProps> = ({ text, image }) => {
  return (
    <ImageContainer imageUrl={image}>
      <OverlayText variant="h4" align="center">
      <ReactMarkdown>{text}</ReactMarkdown>
      </OverlayText>
    </ImageContainer>
  );
};

export default ImageOverlay;
