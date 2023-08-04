import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { IconButton } from '@mui/material';

import LastPageOutlinedIcon from '@mui/icons-material/LastPageOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import FirstPageOutlinedIcon from '@mui/icons-material/FirstPageOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';

import * as ga from '../lib/ga';
const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  color:red;
 // background-color: red;
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
  num: number;
  max: number;

  onNextClick: () => void;
  onPrevClick: () => void;
  onLastClick: () => void;
  onFirstClick: () => void;

}

const Toolbar: React.FC<ToolbarProps> = ({
  num,
  max,
  onNextClick,
  onPrevClick,
  onLastClick,
  onFirstClick,
}) => {
 
  return (
    <ToolbarContainer>
      <ToolbarButton color="primary" size="large" onClick={onFirstClick} disabled={num==1}>
        <FirstPageOutlinedIcon />
      </ToolbarButton>
      <ToolbarButton color="primary" size="large" onClick={onPrevClick} disabled={num==1}>
       <ChevronLeftOutlinedIcon/>
      </ToolbarButton>
      <ToolbarButton color="primary" size="large" onClick={onNextClick} disabled={num==max}>
        <ChevronRightOutlinedIcon />
      </ToolbarButton>
      <ToolbarButton color="primary" size="large" onClick={onLastClick} disabled={num==max}>
        <LastPageOutlinedIcon />
      </ToolbarButton>
      

     </ToolbarContainer>
  );
};

export default Toolbar;
