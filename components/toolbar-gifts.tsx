import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 100;
  margin-bottom:20px;
`;

const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToolbarText = styled.span`
  font-size: 16px;
`;

interface ToolbarProps {
  onRegenerateClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onRegenerateClick,

}) => {
  return (
    <ToolbarContainer>
      <ToolbarButton color="primary" size="large" onClick={
        onRegenerateClick}>
        <CardGiftcardIcon />
        <ToolbarText> Regenerate Gifts</ToolbarText>
      </ToolbarButton>      
    </ToolbarContainer>
  );
};

export default Toolbar;
