import React from "react";
import styled from "styled-components";

import Typography from "@mui/material/Typography";

import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import ReactMarkdown from "react-markdown";
import LinearProgress from '@mui/material/LinearProgress';
import ImageOverlay from "./image-overlay";
import ImageData from "../lib/image-data";

const Headline = styled.div`
  width:100%;
  display:flex;
  justify-content:center;
  font-size: 22px;
  font-weight: 700;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  text-align: center;
  padding: 2px;
  z-index:100;
  @media (max-width: 990px) {
    font-size: 18px;
  
  }
  &.q-h{

    z-index:100;
    position:relative
    
  }
 
  
`;
interface BodyProps {
  l:number;
}
const TextBody = styled.div<BodyProps>`
  width:100%;
  display:flex;
  justify-content:center;
  font-size:18px;
  font-weight: 400;
  line-height: 1.7;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  padding-top:1px;
  padding-bottom:20px;
  margin-bottom: 40px;
  @media (max-width: 990px) {
    font-size:${({l})=>l>600?11:l>400?12:l>300?13:l>200?14:16}px;
  }
`;

interface LargeProps {
  large?: boolean
}
const Image = styled.img<LargeProps>`
    max-width: ${({ large }) => large ? 360 : 240}px;
    max-height: ${({ large }) => large ? 480 : 320}px;
    width:${({ large }) => large ? 50 : 45}vw;
    height: ${({ large }) => large ? 75 : 60}vw;
    @media (min-width: 768px) {
        width:${({ large }) => large ? 60 : 45}vw;
        height: ${({ large }) => large ? 80 : 60}vw;
        
  }
`;
const Card = styled.div<LargeProps>`
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
    transform: translate(-30%, -50%);
    perspective: 3700px;
    transition: all 0.2s ease;
  }
  @media (min-width: 768px) {
    .open .card__container {
      transform: translate(0%, 20%);
      
    }
  }
  .card {
    max-width: ${({ large }) => large ? 360 : 240}px;
    max-height: ${({ large }) => large ? 480 : 320}px;
    width:${({ large }) => large ? 50 : 45}vw;
    height: ${({ large }) => large ? 75 : 60}vw;
    transform-style: preserve-3d;
    transform: rotateX(65deg);
    transition: all 1s ease;
    //transform: translate(0%, 0%);
    @media (min-width: 768px) {
        width:${({ large }) => large ? 60 : 45}vw;
        height: ${({ large }) => large ? 80 : 60}vw;
        
  }
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
const OuterContainer = styled.div`
    position:absolute;
    top:0px;
    display:flex;
    flex-direction:row;
    justify-content:flex-end;
    width:100%;
    height:100%;
    `;
const SidePanel = styled.div`
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
   //padding-top:100px;
   // margin-top: 80px;
   // margin-right:5%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    //padding-left:1%;
    padding-right:4%;
   // padding: 14rem 2rem;
    text-align: center;
    color:#2d2b38;// ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
    background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
    //background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
  //  background-repeat: repeat;
  //  min-height:300px;
    width:100%;
   // background-size: 900px 491px;
`;
const Body = styled.div`
    //padding-top:200px;
    position:absolute;
    display:flex;
    top:4vw;
    flex-direction:column;
    //height:300px;
    //max-height:600px;
    justify-content:space-between;
    z-index:101;
    //height:50vw;
    padding-left:35%;
    
    `;
const Outer = styled.div`
    position:relative;
   
    width:100%;
    height:100%;
    //padding-top:40px;
    min-height: 30vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    //padding-left:40px;
    @media (min-width: 768px) {
        width: 30vw;
        min-height: 15vw;
        
  }
`
const Header = styled.div`
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
position:absolute;
bottom:0px;
right:0px;
width:180px;
 // margin-top: 12rem;
`;
const Inner = styled.div`
    position:relative;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding-bottom:40px;
    padding-left: 20px;
    padding-right: 20px;
    `;
const Signature = styled.div`
    padding:4px;
    font-family:cursive;
    color:#63599d;
    -ms-transform: rotate(-10deg); /* IE 9 */
    -webkit-transform: rotate(-10deg); /* Chrome, Safari, Opera */
    -moz-transform: rotate(-10deg); /*Mozilla */
     transform: rotate(-10deg); 
     padding-top:10px;
     @media (max-width: 769px) {
        padding-top:5px;
        font-size:0.5rem;
    }
    `;
const Greeting = styled(Typography)`
    font-size: 1.0rem;
    padding:4px;
    height:60%;
    padding-bottom:20px;
    //opacity:0;
    .greeting {
        opacity:0;
        //Stransition: opacity 2s;
        //transition: all 1s ease;
    }
    .open .greeting {
        opacity:1;
        //Stransition: opacity 2s;
        //transition: all 1s ease;
    }
    @media (max-width: 769px) {
        font-size:0.5rem;
  }
`;
interface MarkProps {
  image:string;
}
const Mark=styled.div<MarkProps>`
position: ${({image})=>image=="true"?'absolute':'relative'};
bottom:0;
`;

interface BandProps {
  dark: string,
  fbclid: string,
  utm_content: string,
  text: string,
  loading?: boolean,
  large?: boolean,
  image?:ImageData,
  signature?:string,
  startOpen?:boolean
}
const GreetingCard: React.FC<BandProps> = ({ startOpen=false,loading = false, large = false, dark, fbclid, utm_content, text,image,signature }) => {
  const [open, setOpen] = React.useState(startOpen);
  const theme = useTheme();
  const router = useRouter();
  const handleCTAClick = () => {
    router.push(`/?fbclid=${fbclid}&utm_content=${utm_content}`);
  };
  console.log("large=", large, "greeting=", text)
  text = text.replaceAll('\n\n', '\n');
  const tw = text.split('\n');
  const headline = tw.length > 1 ? tw[0] : '';
  const body = tw.length > 1 ? tw.slice(1).join('\n') : tw[0];
  const handleTextClick = () => {
  }
  return (
    <BandContainer darktext={dark}>
      <Outer>
        <Body>

          <Card large={large}>
            <div className={`card__container js-card-opener ${open ? "open" : ""}`}>
              <div className={`card ${open ? "open" : ""}`}>
                <div className={`card__panel card__panel--front ${open ? "open" : ""}`}>
                  {image?.url&&<Image large={large} src={image?.url} />}


                </div>
                <div className={`card__panel card__panel--inside-left ${open ? "open" : ""}`}>

                 {image?.url&&<Image large={large} src={image?.url} />}

                </div>
                <div className={`card__panel card__panel--inside-right ${open ? "open" : ""}`}>
                  {false && <Inner><Greeting className="greeting"><ReactMarkdown>{text}</ReactMarkdown></Greeting><Signature>Keep it up, man! <br />Love, Nick</Signature></Inner>}
                  <Inner><Mark image={"false"} onClick={() => handleTextClick()} >
                    <Headline className="q-h">
                      <ReactMarkdown>
                        {loading ? "" : headline.replace('#', '###').replace('####', '##')}
                      </ReactMarkdown>
                    </Headline>

                    {loading && <LinearProgress />}
                    <TextBody l={text.length} id='wt-output'>
                      <ReactMarkdown>
                        {loading ? "Generating..." : body}
                      </ReactMarkdown>
                    </TextBody>

                  </Mark></Inner>
                </div>
              </div>
              <CTAButton onClick={() => setOpen(!open)}> {`${open ? "Close" : "Open"} Card`}</CTAButton>

            </div>

          </Card>


        </Body>
      </Outer>
    </BandContainer>


  );
};
export default GreetingCard;