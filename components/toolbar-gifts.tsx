import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';

import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToolbarText = styled.span`
  font-size: 12px;
`;

interface ToolbarProps {
  onRegenerateClick: () => void;

}

const Toolbar: React.FC<ToolbarProps> = ({
  onRegenerateClick,
 
}) => {
  return (
    <ToolbarContainer>
      <ToolbarButton color="primary" onClick={onRegenerateClick}>
        <CardGiftcardIcon />
        <ToolbarText> Regenerate Gift Suggestions</ToolbarText>
      </ToolbarButton>
      
    </ToolbarContainer>
  );
};

export default Toolbar;
