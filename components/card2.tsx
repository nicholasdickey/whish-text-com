import React from "react";
import styled from "styled-components";

import Typography from "@mui/material/Typography";

import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ReactMarkdown from "react-markdown";
const Image=styled.img`
    max-width: 200px;
    max-height: 300px;
    width: 80vw;
    height: 120vw;
`;
const Card = styled.div`
position:relative;
&body {
    text-align: center;
    background: gray;
  }
  .card__container {
    cursor: pointer;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    perspective: 1400px;
    transition: all 0.2s ease;
  }
  @media (min-width: 768px) {
    .open .card__container {
      transform: translate(0%, -50%);
    }
  }
  .card {
    max-width: 200px;
    max-height: 300px;
    width: 80vw;
    height: 120vw;
    transform-style: preserve-3d;
    transform: rotateX(65deg);
    transition: all 1s ease;
  }
  .open .card {
    transform: rotateX(0deg);
  }
  .card__panel {
    border: 1px solid black;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    transition: all 1s ease;
    backface-visibility: visible;
    transform-origin: left;
    transform-style: preserve-3D;
    transform: rotate3d(0, 1, 0, 0deg);
  }
  .card__panel--front {
    backface-visibility: hidden;
    background: #6288e6;
    z-index: 1;
  }
  .open .card__panel--front {
    transform: rotate3d(0, 1, 0, -170deg);
  }
  .card__panel--inside-left {
    background: #fff;
    z-index: 0;
  }
  .open .card__panel--inside-left {
    transform: rotate3d(0, 1, 0, -170deg);
  }
  .card__panel--inside-right {
    border-left: none;
    background: #fff;
    z-index: -1;
  }
  `;
const OuterContainer=styled.div`
    position:relative;
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    width:100%;
    height:100%;
    `;
const SidePanel=styled.div`
    position:absolute;
    right:20px;
    display:flex;
    flex-direction:column;
    justify-content:flex-end;
    text-align:right;
    `;    
const BandContainer = styled.div<{ darktext?: string, background?: string }>`
    display: flex;
    position:relative;
    margin-top: 80px;
   // margin-right:5%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-left:10%;
   // padding: 14rem 2rem;
    text-align: center;
    color: ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
    background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
    //background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
    background-repeat: repeat;
    min-height:600px;
    width:100%;
   // background-size: 900px 491px;
`;
const Body=styled.div`
    padding-top:200px;
    display:flex;
    flex-direction:column;
    height:100%;
    //max-height:600px;
    justify-content:space-between;
    `;

const Header=styled.div`
    position:relative;
    display:flex;
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
    dark: string,
    fresh: boolean,
    fbclid: string,
    utm_content: string,
    isbot: number,
    isfb: number,
    sessionid: string,
    title: string,
    subtitle: string,
    cta: string
}
const Band: React.FC<BandProps> = ({ dark, fresh, fbclid, utm_content, isbot, isfb, sessionid, title, subtitle, cta }) => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const router = useRouter();
    const handleCTAClick = () => {
        router.push(`/?fbclid=${fbclid}&utm_content=${utm_content}`);
    };
    return (
<OuterContainer>
        <BandContainer darktext={dark}>
           <Body>
          
            <Card>
                <div className={`card__container js-card-opener ${open?"open":""}`}>
                    <div className={`card ${open?"open":""}`}>
                        <div className={`card__panel card__panel--front ${open?"open":""}`}>
                            <Image src="https://res.cloudinary.com/dhmqojhnk/image/upload/v1689787142/fcyz09ojtzofswht9tx3.jpg"/>
                           
                         
                        </div>
                        <div className={`card__panel card__panel--inside-left ${open?"open":""}`}>

                        <Image src="https://res.cloudinary.com/dhmqojhnk/image/upload/v1689787113/ojxxqkjtu1q6hi306qqg.jpg"/>
                          
                        </div>
                        <div className={`card__panel card__panel--inside-right ${open?"open":""}`}>
                            Inside
                        </div>
                    </div>
                </div>
            </Card>
            <Header><CTAButton onClick={()=>setOpen(!open) }> {`Click card to ${open?"close":"open"}`}</CTAButton>
           
            </Header>
           
            </Body>
           
       {false&&<SidePanel>WISH-TEXT.COM<p>Create your own wish card</p></SidePanel>}
        </BandContainer>
      
        </OuterContainer>
    );
};
export default Band;