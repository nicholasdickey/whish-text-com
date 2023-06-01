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
//@ts-ignore
import FileSaver from "file-saver";
const InnerOutput = styled.div<{ imageUrl?: string; length: number }>`
  position: relative;
  display: flex; 
  flex-direction: column;
  //align-items: flex-start;
  font-size: ${({ length }) =>
    `${length < 600 ? "14" : length < 500 ? "15" : length < 400 ? "16" : "12"}`}px;
  margin-top: 10px;
  width: 100%;
  min-height: 440px;
  border-radius: 30px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //background-color: rgba(0, 0, 0, 0.2);
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 1.0) 100%);
    border-radius: 27px;
    z-index: 4;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    //opacity: 0.9;
    border-radius: 30px;
    z-index: 4;
  }

  & p {
    padding: 10px;
    opacity: 0.8;
    margin-top: auto;
    bottom: 0;
    color: white;
    position: relative;
    z-index: 4;
  }

  & div#adintro {
    opacity: 1.0;
    margin-top: 10px;
    color: white;
    position: relative;
    z-index: 4;
  }
`;
const StyledImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  //opacity: 0.9;
  border-radius: 66px;
  z-index: 0;
  margin-top: 6px;
  width: 100%;
  min-height: 420px;
  border-radius: 44px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 14px;
  padding-bottom: 17px;
`;
const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  //opacity: 0.9;
  border-radius: 66px;
  z-index: 0;
  margin-top: 6px;
  width: 100%;
  min-height: 420px;
  border-radius: 44px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 14px;
  padding-bottom: 17px;
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
}: {
  setLoadReady: any;
  session: Options;
  updateSession2: any;
  from: string;
  to: string;
  occasion: string;
  reflections: string;
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
  const [convertedImage,setConvertedImage]=useState('');
  const [greeting, setGreeting] = useState(session.greeting || "");
  const canvasRef = useRef(null);
/*
  const convertDivToPng = async (div: any) => {
    const data = await toPng(div, {
      cacheBust: true,
      canvasWidth: div.clientWidth,
      canvasHeight: div.clientHeight,
    });
    return data;
  };
*/
const convertDivToPng = async (div: any) => {
  const data = await toBlob(div, {
    cacheBust: true,
    canvasWidth: div.clientWidth,
    canvasHeight: div.clientHeight,
    quality:0.2
  });
  return data;
};
  const stripClickHandler = (image: ImageData) => {
    setSelectedImage(image);
  };

  const handleGenerate = async () => {
    if (loading) return;

    setLoading(true);
    setLoadReady(true);
    console.log("handleGenerate clicked")
    const result = await getWishText({
      style: "",
      from,
      to,
      occasion,
      reflections,
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
/*
      if (data) {
        setConvertedImage(data);
        const link = document.createElement("a");
        link.href = data;
        var randomstring = () => Math.random().toString(8).substring(2, 7) + Math.random().toString(8).substring(2, 7);

        link.download = `${randomstring()}-wish-text.png`;
        link.click();
      }*/
      var randomstring = () => Math.random().toString(8).substring(2, 7) + Math.random().toString(8).substring(2, 7);
     
      const filename = `${randomstring()}-wt2.png`;
      //@ts-ignore
      if (window.saveAs) {
        //@ts-ignore
        window.saveAs(data, 'a'+filename);
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
      <ToolbarGenerate onGenerateClick={handleGenerate} onUploadClick={onUpload} />
      <Box sx={{ my: 1, width: { xs: 1 } }} textAlign="center">
        <div ref={canvasRef} >
          <div style={{ padding: 10, position: "relative" }} >
            <InnerOutput imageUrl="" data-id="GreetingsOutput:InnerOutput" length={greeting.length}>
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
             <StyledImage src={selectedImage.url} width={400} height={800} alt={'background image'}/>       
            {false? <BackgroundImage  src={selectedImage.url || "https://res.cloudinary.com/dhmqojhnk/image/upload/v1685538545/kauoss2fzcq8wokfkwdf.jpg"} />:null}
          
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
      <img src={convertedImage} style={{ width: "100%" }} />
    </>
  );
}
