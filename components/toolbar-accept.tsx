import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check'; 

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  onDownloadClick: () => void;
  onCopyClick: () => void;
  onAcceptClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onDownloadClick,
  onCopyClick,
  onAcceptClick,
}) => {
  return (
    <ToolbarContainer>
      <ToolbarButton onClick={onDownloadClick}>
        <CloudDownloadIcon />
        <ToolbarText>Download</ToolbarText>
      </ToolbarButton>
      <ToolbarButton onClick={onCopyClick}>
        <FileCopyIcon />
        <ToolbarText>Copy to Clipboard</ToolbarText>
      </ToolbarButton>
      <ToolbarButton onClick={onAcceptClick}>
        <CheckIcon />
        <ToolbarText>Accept</ToolbarText>
      </ToolbarButton>
    </ToolbarContainer>
  );
};

export default Toolbar;
