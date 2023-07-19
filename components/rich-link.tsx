import React from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga';
export const Container = styled.div`
  margin-top: 10px;
  padding-bottom: 60px;

 
`;

const ProductImage = styled(CardMedia)`
  width: 100px;
  height: auto;
  border-radius: 30px;
`;

const AmazonLogo = styled.img`
  height: 20px;
  width: 20px;
  margin-left:20px;
  margin-top:20px;

  opacity: 0.7;
`;

interface TextProps {
  color: string;
}
const Title = styled(Typography)<TextProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ color }) => (color ? color : "#FFF")};
`;


const Price = styled(Typography)<TextProps>`
   color: ${({ color }) => (color ? color : "#FFF")};
  font-weight: bold;
  margin-right:20px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const RichLinkContainer = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  padding:4px;
 

`;

const MediaWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 10px;
  padding:15px;
 
`;
interface RichLinkProps {
  title: string;
  imageUrl: string;
  price: string;
  link: string;
  session: any;
}
export const RichLink: React.FC<RichLinkProps> = ({ session,title, imageUrl, price, link }) => {
  const theme = useTheme();
  return (
   
    <Grid item xs={12} key={`rich-link-${title}`}>
     
        <Card variant="outlined">
        <RichLinkContainer href={link} onClick={()=>{
           ga.event({
            action: "AmazonClick",
            params : {
              sessionid: session.sessionid,
              title,
              price,
              link 
            }
          })
        }}>
          <MediaWrapper>
            <ProductImage><CardMedia component='img' image={imageUrl}  /></ProductImage>
          </MediaWrapper>
          <CardContent>
            <Title color={theme.palette.primary.main} variant="subtitle1">
              <Typography>{title}</Typography>
            </Title>
            <RichLinkContainer href={link}>
              <Price variant="body2" color={theme.palette.primary.main}>
                {price}
              </Price>
              <AmazonLogo src="https://st3.depositphotos.com/1001860/16375/i/600/depositphotos_163757632-stock-photo-amazon-logo-on-a-white.jpg" />
            </RichLinkContainer>
          </CardContent>
        </RichLinkContainer>
        </Card>
      
    </Grid>
   
  );
};
