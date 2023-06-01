import React, { useState, useRef, FormEvent, useEffect, use } from "react";
import { styled } from "styled-components";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { getWishText } from "../lib/api";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Options } from "../lib/with-session";
import AdIntro from "./ad-intro";
import Select from 'react-select';
import { IconButton } from '@mui/material';
import ToobarAccept from './toolbar-accept';
import ToolbarGenerate from './toolbar-generate';
import { CldUploadButton } from 'next-cloudinary';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { Anybody } from "next/font/google";
import { toPng } from 'html-to-image'
import ImageStrip,{ImageData} from "./image-strip";
const ToolbarButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ToolbarText = styled.span`
  font-size: 12px;
`;
const Container = styled.div`
    display: flex;
  
    //background-color: aliceblue;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `;

const InnerOutput = styled.div<{ imageUrl?: string, length: number }>`
  position: relative;
  display: flex; /* Use Flexbox */
  flex-direction: column; /* Arrange content vertically */
  align-items: flex-start; /* Align content to the start of the container */

  font-size:${({ length }) => `${length < 400 ? '21' : length < 500 ? '19' : length < 600 ? '16' : '14'}`}px;
  //margin-right: 20px;
  margin-top: 10px;
  width: 100%;
  min-height: 440px;
  //border: 2px solid #ccc;
  border-radius: 30px;
  //padding: 20px;
  /*width: 320px;

  @media (min-width: 600px) {
    width: 400px;
  }
  @media (min-width: 900px) {
    width: 480px;
  }
  @media (min-width: 1200px) {
    width: 520px;
  }*/

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Adjust the opacity as desired */
    border-radius: 30px;
    z-index: 1; /* Set a higher z-index for the pseudo-element */
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //background-image: ${({ imageUrl }) => (imageUrl ? `url(${imageUrl})` : 'none')};
    background-size: cover;
    opacity: 0.9; /* Adjust the opacity as desired */
    border-radius: 30px;
    z-index: 0; /* Set a lower z-index for the image background */
  }

  & p {
    padding:10px;
    opacity:0.8;
    margin-top: auto;
    bottom:0;
   // margin-top: 10px;
    color: white; /* Set the text color to white */
    position: relative;
    z-index: 2; /* Set a higher z-index for the text to appear above the pseudo-element */
  }
  & div#adintro {
    opacity:1.0;
    
    margin-top: 10px;
    color: white; /* Set the text color to white */
    position: relative;
    z-index: 2; /* Set a higher z-index for the text to appear above the pseudo-element */
  }
`;


const ButtonContainer = styled.div`
    position:relative;

    display:flex;
    justify-content:space-around;
    padding:20px;
    width:100%;
    `
/*interface LoadingProps {
  loading: boolean;
}
const Button = styled.button<LoadingProps>`
  background:#048080;
  padding:6px 20px;
  color:${({ loading }) => !loading ? 'white' : 'grey'};
  border-radius:10px;
  &:hover{
    background:${({ loading }) => !loading ? '#037070' : '#048080'};
    cursor:pointer;
  
}
`;*/
const OuterWrap = styled.div`
`;
const BackgroundImage = styled.img`
position:absolute;
top:0;
left:0;
width:100%;
height:100%;
object-fit:cover;
//background-size: cover;
opacity: 0.9; /* Adjust the opacity as desired */
border-radius: 30px;
z-index: 0; /* Set a lower z-index for the image background */
margin-top: 6px;
width: 100%;
min-height: 420px;
//border: 2px solid #ccc;
border-radius: 44px;
padding-right: 10px;
padding-left: 10px;
padding-top:14px;
padding-bottom:17px;
`;
const Buttons = styled.div`
display:flex;
justify-content:space-between;
width:100%;
`;
const BottomLink = styled.div`
//position:absolute;
//bottom:-0;
//background-color:darkgoldenrod;
padding:10px;
z-index:100;
&a{
  color:white;
  text-decoration:none;
}
`
const GeneratingPlaceholder = styled.div`
  font-size: 14px;
  max-width:400px;
  margin:80px;
  `;
const PersonaImage = styled.img`
  width:100%;
  max-width:400px;
  margin:10px;
  `;


export default function Output({ setLoadReady, session, updateSession2, from, to, occasion, reflections }: { setLoadReady: any, session: Options, updateSession2: any, from: string, to: string, occasion: string, reflections: string }) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [persona, setPersona] = useState('');
  const [selectedImage, setSelectgedImage] = useState(session.selectedImage ? JSON.parse(session.selectedImage) : { url: '', publicId: '' });

  const [images, setImages] = useState(session.imagesString ? JSON.parse(session.imagesString) : new Array<ImageData>());
  const [greeting, setGreeting] = useState(session.greeting || '');
  const canvasRef = useRef(null);
  console.log("GREETING:", persona, greeting, 'value', value);
  // generate code to parse the value for double quoted strings
  //  
  const text = ['This Amazing AI experience', 'Brought to you', 'By', 'THE', 'AMERICAN', 'OUDOORSMAN', 'NEWS', 'www.american-outdoorsman.news'];
  const loadingText = ['Preparing the inputs', 'Connecting to the NSA supercomputer in Provo, UT', 'Inserting rods', 'Cooling jets', 'Turning the crankshaft', 'Waiting for the blinking lights', 'Negotiating the protocol', 'Streaming the response']

  console.log("images", images)
  const convertDivToPng = async (div: any) => {
    const data = await toPng(div, {
      cacheBust: false,
      canvasWidth: div.clientWidth,
      canvasHeight: div.clientHeight,
    });
    return data;
  };
  const stripClickHandler: (image: ImageData) => void = (image: ImageData) => {
    console.log("stripClickHandler", image);
    setSelectgedImage(image);
  }
  const handleGenerate: () => void = async () => {
    if (loading)
      return;
    console.log("calling api with", from, to, occasion, reflections);
    setLoading(true);
    setLoadReady(true);
    const result = await getWishText({ style: '', from, to, occasion, reflections, fresh: value ? true : false });
    setLoading(false);
    setLoadReady(false);
    console.log("result", result, 'value:', value);
    if (result != value) {
      console.log("setting value", result)
      updateSession2({ greeting: result });
      setGreeting(result);
      setValue(result);
    }
  };

  const handleAccept: () => void = () => {
  }
  const handleCopy: () => void = () => {
  }
  const handleDownload: () => void = async () => {
    try {
      const data = await convertDivToPng(canvasRef.current);
      // console.log("handleDownload:",canvasRef,selectedImage,data);
      if (data) {
        const link = document.createElement("a");
        link.href = data;
        link.download = `${selectedImage.original_filename}-wish-text.png`;
        link.click();
      }
    } catch (e) {
      console.log(e, "ini errornya");
    }
  };


  function onUpload(result: any, widget: any): void {
    console.log("onUpload", result, widget);
    const url = result.info.secure_url;
    const publicId = result.info.public_id;
    const height = result.info.height;
    const width = result.info.width;
    const thumbnailUrl = result.info.thumbnail_url;
    const original_filename = result.info.original_filename;

    console.log("url", url, 'publicId', publicId);
    //setImageUrl(url);
    //setImageId(publicId);
    setImages([...images, { url, publicId, height, width, thumbnailUrl, original_filename }]);
    setSelectgedImage({ url, publicId, height, width, thumbnailUrl, original_filename });
    updateSession2({ imagesString: JSON.stringify([...images, { url, publicId, height, width, thumbnailUrl, original_filename }]), selectedImage: JSON.stringify({ url, publicId, height, width, thumbnailUrl, original_filename }) });

  }
  console.log("SelectedImage:", selectedImage)
  const LeftButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
  return <>

    <ToolbarGenerate onGenerateClick={handleGenerate} onUploadClick={onUpload} />
    <Box sx={{
      my: 1,
      width: { xs: 1 },

    }} textAlign="center" >
      <div style={{ padding: 10, position: "relative" }} ref={canvasRef}>
        <InnerOutput imageUrl={''} data-id="GreetingsOutput:InnerOutput" length={greeting.length}>
          {!loading ? <ReactMarkdown rehypePlugins={[rehypeRaw]} >{loading ? 'Generating...' : greeting}</ReactMarkdown>
            : <div style={{ width: '100%', position: 'relative' }} id="adintro"><AdIntro ad={{ text, bottomLink: 'https://www.american-outdoorsman.news', loadingText }} /> </div>}

        </InnerOutput>
        <BackgroundImage src={selectedImage.url || "https://res.cloudinary.com/dhmqojhnk/image/upload/v1685538545/kauoss2fzcq8wokfkwdf.jpg"} /> </div>
      {greeting ? <ToobarAccept onDownloadClick={handleDownload} onAcceptClick={handleAccept} onCopyClick={handleCopy} /> : null}

      {loading ? null : <BottomLink><Link href="https://www.american-outdoorsman.news">Sponsor: www.american-outdoorsman.news</Link></BottomLink>}
    </Box>
    <Box sx={{
      my: 4,
      width: { xs: 1 },

    }} textAlign="center" >

      {images.length > 1 ? <ImageStrip images={images} onImageClick={stripClickHandler} /> : null}
    </Box>

  </>

}