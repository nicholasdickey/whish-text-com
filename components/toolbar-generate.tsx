import React from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CldUploadWidget} from 'next-cloudinary';
const ToolbarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  align-items: center;
 
  margin-top: 20px;

`;

const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size:48px;
  
`;

const ToolbarText = styled.span`
  font-size: 16px;
  
`;

interface ToolbarProps {
  onGenerateClick: () => void;
  onUploadClick:  (result:any,widget:any) => void;
  hasGreeting:boolean,
  error:boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  onGenerateClick,
  onUploadClick,
  hasGreeting,
  error
}) => {
 console.log("Toolbar",hasGreeting)
  return (
    <ToolbarContainer data-id="toolbar-generate">
      <ToolbarButton color={error?"error":"success"} size="large" onClick={onGenerateClick}>
     
        <TextFieldsIcon />
        <ToolbarText>{hasGreeting?'Suggest':'Suggest'} Wish Text</ToolbarText>
      </ToolbarButton>
      {false&&hasGreeting&&<CldUploadWidget onUpload={onUploadClick} uploadPreset="h17xjq8e">
          {({ open }) => {
            function handleOnClick(e: any) {
              e.preventDefault();
              open();
            }
            return (
              <ToolbarButton  color="primary" onClick={handleOnClick}>
                <CloudUploadIcon />
                <ToolbarText>Upload Image</ToolbarText>
              </ToolbarButton>
            );
          }}
        </CldUploadWidget>}
    </ToolbarContainer>
  );
};

export default Toolbar;
