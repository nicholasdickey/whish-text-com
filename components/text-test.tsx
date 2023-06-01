import React from 'react';
import { Container, Box, Typography, Button, styled } from '@mui/material';

const TextAreaContainer = styled(Container)({
  display: 'flex',
  marginBottom: 2,
});

const TextArea = styled(Box)({
  flex: 1,
  marginRight: 2,
  marginBottom: 2,
});

const ButtonWrapper = styled(Box)({
  float: 'right',
  shapeOutside: 'polygon(100% 0%, 100% 100%, 0% 100%)',
  marginRight: '-50px',
  marginBottom: '-50px',
});

const ButtonContainer = styled(Box)({
  position: 'relative',
});

const TextAreaWithButton: React.FC = () => {
  return (
    <TextAreaContainer>
      <TextArea>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed erat et nulla ultricies hendrerit. Sed sollicitudin eros eu nunc dapibus interdum. Quisque hendrerit euismod massa, ac egestas erat dignissim at. Curabitur eu semper leo. Nulla pharetra tortor sed est feugiat, in efficitur metus finibus. In in nunc eget risus facilisis pellentesque. Proin sodales consectetur ultrices.
        </Typography>
      </TextArea>
      <ButtonWrapper>
        <ButtonContainer>
          <Button variant="contained" color="primary">
            Button
          </Button>
        </ButtonContainer>
      </ButtonWrapper>
    </TextAreaContainer>
  );
};

export default TextAreaWithButton;
