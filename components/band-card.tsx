import React from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ReactMarkdown from "react-markdown";

const BandContainer = styled.div<{ darktext?: string, background?: string }>`
    display: flex;
    position:relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    color: ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
    background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
    background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
    background-repeat: repeat;
    background-size: 900px 491px;
`;
const Title = styled(Typography)`
  margin-bottom: 1rem;
  @media (max-width: 900px) {
    font-size:2rem;
  }
`;
const Subtitle = styled(Typography)`
  margin-bottom: 2rem;
  text-overflow: wrap;
  padding:10px;
  @media (max-width: 700px) {
    font-size:1rem;;
  }
  
`;
const CTAButton = styled(Button)`
  margin-top: 2rem;
`;
interface BandProps {
    card:any,
    dark: string,
    fresh: boolean, 
    fbclid: string,
    utm_content: string,
    isbot: number,
    isfb: number,
    sessionid: string,
    title:string,
    subtitle:string,
    cta:string
}
const Band: React.FC<BandProps> = ({card, dark, fresh, fbclid, utm_content, isbot, isfb, sessionid,title,subtitle,cta }) => {
    const theme = useTheme();
    const router = useRouter();
    const handleCTAClick = () => {
        router.push(`/?fbclid=${fbclid}&utm_content=${utm_content}`);
    };
    return (

        <BandContainer darktext={dark}>
            <Title variant="h3">
              {title}
            </Title>
           {subtitle.length>0? <Subtitle variant="h5">
                <ReactMarkdown>{subtitle}</ReactMarkdown>
            </Subtitle>:null}
           
            {card}
            <CTAButton variant="contained" color="primary" onClick={handleCTAClick}>
               {cta}
            </CTAButton>

        </BandContainer>
    );
};
export default Band;