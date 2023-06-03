import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Image from "next/image";
import { getWishText } from "../lib/api";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { Options } from "../lib/with-session";
import AdIntro from "./ad-intro";
import ToolbarAccept from "./toolbar-accept";
import ToolbarGenerate from "./toolbar-generate";
import { toBlob } from "html-to-image";
import ImageStrip, { ImageData } from "./image-strip";
import { CldImage } from 'next-cloudinary';
import html2canvas from "html2canvas";
//@ts-ignore
import FileSaver from "file-saver";

interface InnerOutputProps {
 length: number, height: number, width: number, div: any, horiz?: boolean
}
const InnerOutput = styled.div<InnerOutputProps>`
  position: relative;
  display: flex; 
  flex-direction: column;
  overflow-wrap: break-word;
  //align-items: flex-start;
  font-size: ${({ length, horiz }) =>
    `${length < 600 ? horiz ? "17" : "19" : length < 500 ? horiz ? "18" : "20" : length < 400 ? horiz ? "19" : "21" : horiz ? "16" : "18"}`}px;
  //margin-top: 10px;
  width: 100%;
  @media(max-width:990px){
    font-weight: 400;
    font-size: ${({ length, horiz }) =>
    `${length < 600 ? horiz ? "9" : "14" : length < 500 ? horiz ? "10" : "15" : length < 400 ? horiz ? "11" : "16" : horiz ? "7" : "12"}`}px;
  
  }
  height: ${({ div, width, height }) => {
    const ratio: number = height / width;
    //console.log("ratio1", div ? div.clientWidth : 0, div ? div.clientHeight * ratio : 0, width, height, ratio);
    return div ? div.clientWidth * ratio : height;
  }}px;
  //border-radius: 26px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    //margin-top:-4px;
   // height: ${({ height }) => height}px; //100%

    height: ${({ div, width, height }) => {
    const ratio = height / width;
    //console.log("ratio1", div ? div.clientWidth : 0, div ? div.clientHeight * ratio : 0, width, height, ratio);
    return div ? div.clientWidth * ratio + 1 : height;
  }}px;
    //background-color: rgba(0, 0, 0, 0.2);
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 1.0) 100%);
    //margin-top: 6px;
    //padding:4px;
    width: 100%;
    //border-radius: 26px;
    z-index: 4;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
 
   // background-size: cover;
    //opacity: 0.9;
    //border-radius: 26px;
    z-index: 4;
  }

  & p {
    padding-left: 20px;
    padding-right: 20px;
    padding-top:10px;
    opacity: 0.9;
    margin-top: auto;
    bottom: 0;
    color: white;
    //position: relative;
    z-index: 4;
    overflow-wrap: break-word;
    text-align: left;
    font-family: PingFangSC-Regular, 'Roboto', sans-serif;;
    letter-spacing: 0.01px;
  }

  & div#adintro {
    opacity: 1.0;
    margin-top: 10px;
    color: white;
    position: relative;
    z-index: 4;
  }
`;
const BackgroundWrapper = styled.div`
  //padding:10px;
  //border-radius: 26px;
  width:100%;
`;
interface StyledImageProps {
  height: number;
  width: number;
  div: any
}
const StyledImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  //object-fit: cover;
  //opacity: 0.9;
  //border-radius: 66px;
  z-index: 0;
  margin-top: 6px;
  width: 100%;
  min-height: 420px;
  border-radius: 24px;
  //padding-right: 10px;
  //padding-left: 10px;
  //padding-top: 14px;
  //padding-bottom: 17px;
`;
const BackgroundImage = styled.img<StyledImageProps>`
box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  height:${({ height }) => height}px;
  //object-fit: cover;
  //opacity: 0.9;
  //border-radius: 26px;
  z-index: 1;
  //margin-top: 6px;
  width: 100%;
  height: ${({ div, width, height }) => {
    const ratio = height / width;
    //console.log("ratio3", div ? div.clientWidth : 0, div ? div.clientWidth * ratio : 0, width, height, ratio);
    return div ? div.clientWidth * ratio : height;
  }}px;
  //min-height: 420px;
  //Sborder-radius: 44px;
 // padding-right: 10px;
 // padding-left: 10px;
 // padding-top: 14px;
  //padding-bottom: 17px;
`;
const BackgroundImage1 = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  //opacity: 0.9;
  border-radius: 66px;
  z-index: 1;
  margin-top: 6px;
  width: 100%;
  min-height: 420px;
  border-radius: 44px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 14px;
  padding-bottom: 17px;
`;
const BackgroundImage2 = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  //opacity: 0.9;
  border-radius: 66px;
  z-index: 2;
  margin-top: 6px;
  width: 100%;
  min-height: 420px;
  border-radius: 44px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 14px;
  padding-bottom: 17px;
`;
const BottomLink = styled.div`
  padding: 10px;

  & a {
    color: white;
    text-decoration: none;
  }
`;

export default function Output({
  setLoadReady,
  session,
  updateSession2,
  from,
  to,
  occasion,
  reflections,
  instructions,
  inastyleof,
  language
}: {
  setLoadReady: any;
  session: Options;
  updateSession2: any;
  from: string;
  to: string;
  occasion: string;
  reflections: string;
  instructions: string;
  inastyleof: string;
  language: string;

}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData>({
    url: '',
    publicId: '',
    height: 0,
    width: 0,
    thumbnailUrl: '',
    original_filename: ''
  });
  const [images, setImages] = useState<ImageData[]>([]);
  const [convertedImage, setConvertedImage] = useState('');
  const [greeting, setGreeting] = useState(session.greeting || "");
  const canvasRef = useRef(null);
  const horiz:boolean = (selectedImage.width > selectedImage.height) ? true : false
  const convertDivToPng = async (div: any) => {
    const canvas = await html2canvas(div, {
      useCORS: true, logging: true, width: div.width, height: div.height, scale: window.devicePixelRatio,
    });
    const image = canvas.toDataURL("image/png", 1.0);
    return image;
  };
  const stripClickHandler = (image: ImageData) => {
    setSelectedImage(image);
  };
  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setLoadReady(true);
    console.log("handleGenerate clicked", { instructions, reflections, occasion, inastyleof, language })
    const result = await getWishText({
      style: "",
      from,
      to,
      occasion,
      reflections,
      instructions,
      inastyleof,
      language,
      fresh: value ? true : false,
    });
    console.log("getWishText result: ", result);
    setLoading(false);
    setLoadReady(false);

    if (result !== value) {
      updateSession2({ greeting: result });
      setGreeting(result);
      setValue(result);
    }
  };
  const handleAccept: () => void = () => {
  }
  const handleCopy: () => void = () => {
  }

  const handleDownload = async () => {
    try {
      const data = await convertDivToPng(canvasRef.current);

      var randomstring = () => Math.random().toString(8).substring(2, 7) + Math.random().toString(8).substring(2, 7);

      const filename = `${randomstring()}-wt2.png`;
      //@ts-ignore
      if (window.saveAs) {
        //@ts-ignore
        window.saveAs(data, 'a' + filename);
      } else {
        //@ts-ignore
        FileSaver.saveAs(data, filename);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onUpload = (result: any, widget: any) => {
    const { secure_url: url, public_id: publicId, height, width, thumbnail_url: thumbnailUrl, original_filename: originalFilename } = result.info;

    const newImage: ImageData = {
      url,
      publicId,
      height,
      width,
      thumbnailUrl,
      original_filename: originalFilename,
    };

    setImages([...images, newImage]);
    setSelectedImage(newImage);
    updateSession2({ imagesString: JSON.stringify([...images, newImage]), selectedImage: JSON.stringify(newImage) });
  };

  useEffect(() => {
    setImages(session.imagesString ? JSON.parse(session.imagesString) : []);
    setSelectedImage(session.selectedImage ? JSON.parse(session.selectedImage) : { url: "", publicId: "" });
  }, [session.imagesString, session.selectedImage]);

  return (
    <>
      <ToolbarGenerate onGenerateClick={handleGenerate} onUploadClick={onUpload} hasGreeting={greeting ? true : false} />
      <Box sx={{ my: 1, width: { xs: 1 } }} textAlign="center">
        <div>
          <div style={{ position: "relative" }} ref={canvasRef} >
            <InnerOutput className="inner-output" div={canvasRef.current} height={selectedImage.height} width={selectedImage.width} data-id="GreetingsOutput:InnerOutput" length={greeting.length} horiz={horiz}>
              {!loading ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{loading ? "Generating..." : greeting}</ReactMarkdown>
              ) : (
                <div style={{ width: "100%", position: "relative" }} id="adintro">
                  <AdIntro
                    ad={{
                      text: [
                        "This Amazing AI experience",
                        "Brought to you",
                        "By",
                        "THE",
                        "AMERICAN",
                        "OUDOORSMAN",
                        "NEWS",
                        "www.american-outdoorsman.news",
                      ],
                      bottomLink: "https://www.american-outdoorsman.news",
                      loadingText: [
                        "Preparing the inputs",
                        "Connecting to the NSA supercomputer in Provo, UT",
                        "Inserting rods",
                        "Cooling jets",
                        "Turning the crankshaft",
                        "Waiting for the blinking lights",
                        "Negotiating the protocol",
                        "Streaming the response",
                      ],
                    }}
                  />
                </div>
              )}

            </InnerOutput>
            {false ? <StyledImage src={selectedImage.url} width={400} height={800} alt={'background image'} /> : null}
             <BackgroundWrapper><BackgroundImage div={canvasRef.current} height={selectedImage.height} width={selectedImage.width} src={selectedImage.url || "https://res.cloudinary.com/dhmqojhnk/image/upload/v1685538545/kauoss2fzcq8wokfkwdf.jpg"} /></BackgroundWrapper>

          </div>
        </div>
        {greeting && !loading && <ToolbarAccept onDownloadClick={handleDownload} onAcceptClick={handleAccept} onCopyClick={handleCopy} />}
        {!loading && false && (
          <BottomLink>
            <Link href="https://www.american-outdoorsman.news">Sponsor: www.american-outdoorsman.news</Link>
          </BottomLink>
        )}
      </Box>
      <Box sx={{ my: 4, width: { xs: 1 } }} textAlign="center">
        {images.length > 1 && <ImageStrip images={images} onImageClick={stripClickHandler} />}
      </Box>
      <img src={convertedImage} alt="image" style={{ width: "100%" }} />
    </>
  );
}
