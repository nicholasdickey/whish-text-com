
import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import { useTheme } from '@mui/material/styles';

//project
import ImageData from "../../lib/image-data";
import CardData from "../../lib/card-data";
import { recordEvent, addSessionImage } from '../../lib/api'
import CardControl from './ui';
//mui
import FormControlLabel from '@mui/material/FormControlLabel';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import TextField from "@mui/material/TextField";
import FormHelperText from '@mui/material/FormHelperText';
import Section from './editor-section'
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import { AnyRecord } from "dns";

/**
 * An editable greeting card. Note that num and greeting are tightly correlated. Num refers to index in session history.
 * @param card:CardData 
 */

const StyledTextareaAutosize = styled(TextareaAutosize)`
    background:inherit;
    color: inherit;
    padding: 10px;  
    overflow:auto;
    width:100%;
    height:100%;
`;
const CursiveEditorBox = styled.div`
    width:100%;
    height:100%;
    display:flex;

    flex-direction:column;
    justify-content:flex-start;
    text-align:left;
    & textarea{
        width:100%;
        overflow:auto;
    } 
`;
const SignatureLabel = styled.div`
    display:flex;
    text-align:left !important;
    justify-content:flex-start;
`;
/********************************************************************************/
interface CardProps extends CardData {
    handleChange: (card: CardData) => void;
    handleCreate: () => void;
    fbclid: string;
    utm_content: string;
    sessionid: string;
    darkMode: boolean;
}
/********************************************************************************/
const Card: React.FC<CardProps> = ({
    linkid,
    signature: startSignature,
    greeting,
    image,
    num,
    handleChange, handleCreate,
    fbclid, utm_content, darkMode,
    sessionid,
}) => {
    const [signature, setSignature] = useState(startSignature);
    const theme = useTheme();
    let filterTimeout: any;
    const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const text = event.target.value;
        setSignature(text);
        clearTimeout(filterTimeout)
        handleChange({
            num,
            image,
            greeting,
            signature: text,
            linkid: ''
        })
    };
    useEffect(() => {
        if (startSignature !== signature)
            setSignature(startSignature);
    }, [startSignature])
    return <Section darkMode={darkMode}>
        <CursiveEditorBox>
            <TextField sx={{ width: 1, m: 0, p: 0 }}
                id="outlined-multiline-static"
                multiline
                rows={3}
                label="Signature Line"
                placeholder="Add a 'handwritten' signature line."
                onChange={handleSignatureChange}
                value={signature}
                variant="outlined"
            />
            <FormHelperText sx={{ width: 1, m: 1, p: 0 }}>For example: Love, Mom &amp; Dad!</FormHelperText>
        </CursiveEditorBox>
    </Section>
}
export default Card;
/**
 * 
 * <StyledTextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Add a 'handwritten' signature line."
                        onChange={handleSignatureChange}
                        value={signature}
                    />
 */