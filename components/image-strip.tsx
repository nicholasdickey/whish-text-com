import React from 'react';
import styled from 'styled-components';
import { Box, IconButton } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export interface ImageData {
  url: string;
  publicId: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  original_filename: string;
}

interface ImageStripProps {
  images: ImageData[];
  onImageClick: (image: ImageData) => void;
}

const ImageStripContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 16px;
  margin: 0 -8px;
 // background-color: #eee;
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  margin-right: 16px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Image = styled.img`
  width: 70px;
  height: 60px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: #aaa;
  }
`;

const ArrowButton = styled(IconButton)`
  background-color: #eee;
  border-radius: 50%;

  &:hover {
    background-color: #ddd;
  }
`;

const ArrowLeft = styled(ArrowLeftIcon)`
  color: #888;
`;

const ArrowRight = styled(ArrowRightIcon)`
  color: #888;
`;

const ImageStrip: React.FC<ImageStripProps> = ({ images, onImageClick }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 200; // Adjust the scroll distance as needed
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 200; // Adjust the scroll distance as needed
    }
  };

  const handleImageClick = (image: ImageData) => {
    if (onImageClick) {
      onImageClick(image);
    }
  };

  return (
    <Box>
      <ImageStripContainer ref={scrollContainerRef}>
        {images.map((image) => (
          <ImageContainer key={image.publicId} onClick={() => handleImageClick(image)}>
            <Image src={image.thumbnailUrl} alt={image.publicId} />
          </ImageContainer>
        ))}
      </ImageStripContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={1}>
       {false? <ArrowButton onClick={handleScrollLeft} aria-label="Scroll Left">
          <ArrowLeft />
        </ArrowButton>:null}
        {false?<ArrowButton onClick={handleScrollRight} aria-label="Scroll Right">
          <ArrowRight />
        </ArrowButton>:null}
      </Box>
    </Box>
  );
};

export default ImageStrip;
