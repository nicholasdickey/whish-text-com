import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CldUploadWidget} from 'next-cloudinary';
const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center;
 
  margin-top: 20px;

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
  onGenerateClick: () => void;
  onUploadClick:  (result:any,widget:any) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onGenerateClick,
  onUploadClick,
}) => {
  return (
    <ToolbarContainer data-id="toolbar-generate">
      <ToolbarButton onClick={onGenerateClick}>
     
        <TextFieldsIcon />
        <ToolbarText>Generate Wish Text</ToolbarText>
      </ToolbarButton>
      <CldUploadWidget onUpload={onUploadClick} uploadPreset="pkgopg2z">
          {({ open }) => {
            function handleOnClick(e: any) {
              e.preventDefault();
              open();
            }
            return (
              <ToolbarButton onClick={handleOnClick}>
                <CloudUploadIcon />
                <ToolbarText>Upload Image</ToolbarText>
              </ToolbarButton>
            );
          }}
        </CldUploadWidget>
    </ToolbarContainer>
  );
};

export default Toolbar;
