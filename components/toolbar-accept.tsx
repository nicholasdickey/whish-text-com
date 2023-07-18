import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useCopyToClipboard from '../lib/copy-to-clipboard';
import * as ga from '../lib/ga';
const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  font-size: 16px;
`;

interface ToolbarProps {
  text: string;
  onDownloadClick: () => void;
  onCopyClick: () => void;
  onAcceptClick: () => void;
  images: any;
  session: any;
}

const Toolbar: React.FC<ToolbarProps> = ({
  text,
  onDownloadClick,
  onCopyClick,
  onAcceptClick,
  images,
  session
}) => {
  const [copied, setCopied] = React.useState(false);
  const [value, copy] = useCopyToClipboard();
  useEffect(() => {
    // if (content!=text) {
    setTimeout(() => {
      setCopied(false);

    }

      , 2000);

    //}
  }, [copied]);
  return (
    <ToolbarContainer>
      {images && images.length > 0 && <ToolbarButton color="primary" size="large" onClick={onDownloadClick}>
        <CloudDownloadIcon />
        <ToolbarText> Download Card</ToolbarText>
      </ToolbarButton>}

      <ToolbarButton color="primary" onClick={() => {
        ga.event({
          action: "copyToClipboard",
          params: {
            sessionid: session.sessionid,
            value: value,
          }
        })
        setCopied(true);
        onCopyClick();
        copy(text)
      }}>
        {copied ? <FileCopyIcon /> : <ContentCopyIcon />}
        <ToolbarText>Copy Text to Clipboard</ToolbarText>
      </ToolbarButton>

      {false ? <ToolbarButton color="primary" disabled={true} onClick={onAcceptClick}>
        <CheckIcon />
        <ToolbarText>Accept To History</ToolbarText>
      </ToolbarButton> : null}
    </ToolbarContainer>
  );
};

export default Toolbar;
