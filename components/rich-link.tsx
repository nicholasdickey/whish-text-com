import React from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export const Container = styled.div`
  margin-top: 10px;
  padding-bottom: 60px;
`;

const Image = styled(CardMedia)`
  width: 100px;
  height: auto;
`;

const AmazonLogo = styled.img`
  height: 20px;
  width: 20px;
  margin-left:20px;
  margin-top:20px;

  opacity: 0.7;
`;


const Title = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
`;


const Price = styled(Typography)`
  color: #fff;
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
`;

const MediaWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 10px;
`;
interface RichLinkProps {
  title: string;
  imageUrl: string;
  price: string;
  link: string;
}
export const RichLink: React.FC<RichLinkProps> = ({ title, imageUrl, price, link }) => {
  return (
   
    <Grid item xs={12} key={`rich-link-${title}`}>
     
        <Card>
        <RichLinkContainer href={link}>
          <MediaWrapper>
            <Image image={imageUrl}  />
          </MediaWrapper>
          <CardContent>
            <Title variant="subtitle1">
              {title}
            </Title>
            <RichLinkContainer href={link}>
              <Price variant="body2">
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
