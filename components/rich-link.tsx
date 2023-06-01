import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  //display: grid;
  //grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  //grid-gap: 50px;
  
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  //margin-left:20px;
  margin-top: 10px;
  padding-bottom: 60px;
 // border: 2px solid #ccc;
 // border-radius: 30px;
  //padding:50px;
`;

const RichLinkContainer = styled.a`
  display: flex;//inline-block;
  //justify-content: space-between;
  position: relative;
  text-decoration: none;
  color: #fff;
  width:300px;
  max-height:260px;
  //border-radius: 30px;
  //align-items: flex-begin;
  background-color: #262644;
  align-items: center;
  border-radius: 30px;
  padding: 10px;
  margin: 20px;

  overflow: hidden;
  @media(min-width: 900px) {
    //font-size:400px;
    width:400px;
  }
  @media(min-width: 1200px) {
   
    width:420px;
  }
  @media(min-width: 2400px) {
    width:480px;
  }
`;

const Image = styled.img`
  //width: 100%;
  //height: auto;
  //max-height: 100px;
  object-fit: cover;
  //position:absolute;
  left:0;
  top:0;
  height:100px;
  width:100px;
  //margin:10px;
  border-left: 2px solid #ccc;
  border-radius: 50%;
  
`;
const AmazonLogo = styled.img`
//position:absolute;
right:0;
bottom:0;
height:20px;
width:20px;
opacity:0.7;
align-self:flex-end;
//margin:50px;
`

const Title = styled.div`
 //position: absolute;
  //top: 0;
  //right: 0;
  //margin: 0;
  flex-grow: 1;
  padding: 10px;
  height:100px;
  width:200px;
  font-size:14px;
  overflow: hidden;
  text-overflow: ellipsis;
  
  //background-color: rgba(32, 32, 32, 0.8);
`;

const Price = styled.p`
 // position: absolute;
 // top: 50%;
 // left: 50%;
 // transform: translate(-50%, -50%);
  //margin: 0;
 // padding: 10px;
 height:80px;
 width:50px;
 color: #fff;
  font-weight: bold;
 // background-color: rgba(0, 0, 0, 0.6);
`;
const Right = styled.div`
padding-right:4px;
display:flex;
flex-direction:column;
justify-content:space-between;
align-items:flex-end;
`
interface RichLinkProps {
  title: string;
  imageUrl: string;
  price: string;
  link: string;
}

export const RichLink: React.FC<RichLinkProps> = ({
  title,
  imageUrl,
  price,
  link,
}) => {
  return (
    <RichLinkContainer href={link}>
      <Image src={imageUrl} alt={title} />
      <Title>{title}</Title>
      <Right><Price>{price}</Price>
      <AmazonLogo src='https://st3.depositphotos.com/1001860/16375/i/600/depositphotos_163757632-stock-photo-amazon-logo-on-a-white.jpg'/>
      </Right>
    </RichLinkContainer>
  );
};

// Example usage:
/*const App: React.FC = () => {
  return (
    <div>
      <RichLink
        title="Example Product"
        imageUrl="https://example.com/image.jpg"
        price="$19.99"
        link="https://example.com/product"
      />
    </div>
  );
};
*/

//export default RichLink;
