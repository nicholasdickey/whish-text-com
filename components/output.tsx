import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Image from "next/image";
import { getWishText, saveToHistory } from "../lib/api";


import { Options } from "../lib/with-session";
import ToolbarAccept from "./toolbar-accept";
import ToolbarGenerate from "./toolbar-generate";
import ImageStrip from "./image-strip";
import ImageData from "../lib/image-data";
import html2canvas from "html2canvas";
//@ts-ignore
import FileSaver from "file-saver";
import TextEditor, { TextEditorProps, ImageProps } from "./text-editor";

const BottomLink = styled.div`
  padding: 10px;

  & a {
    color: white;
    text-decoration: none;
  }
`;

export default function Output({
  setMissingOccasion,
  setLoadReady,
  session,
  updateSession2,
  from,
  to,
  occasion,
  reflections,
  instructions,
  inastyleof,
  language,
  greeting,
  authSession
}: {
  setMissingOccasion: any;
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
  greeting: string;
  authSession: any;

}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [gift, setGift] = useState('');
  const [openLogin, setOpenLogin] = useState(false);
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


  // const [greeting, setGreeting] = useState(session.greeting || "");
  const canvasRef = useRef<HTMLDivElement>(null);
  const horiz: boolean = (selectedImage.width > selectedImage.height) ? true : false
  const convertDivToPng = async (div: any) => {
    const canvas = await html2canvas(div, {
      useCORS: true, logging: true, width: div.width, height: div.height, scale: window.devicePixelRatio,
    });
    const image = canvas.toDataURL("image/png", 1.0);
    return image;
  };


  const stripClickHandler = (image: ImageData | null):void => {
    if (image == null) {
      image = {
        url: '',
        publicId: '',
        height: 0,
        width: 0,
        thumbnailUrl: '',
        original_filename: ''
      }

    }

    setSelectedImage(image);
    if(image?.url)
      updateSession2({ selectedImage: JSON.stringify(image) });

  };

  useEffect(() => {
    console.log("useEffect", greeting)
    if (!greeting && selectedImage?.url){
      console.log("useEffect stripClickHandler null")
      stripClickHandler(null);
    }
  }, [greeting, selectedImage]);

  const handleGenerate = async () => {
    if (loading) return;
    if (!occasion) {
      setMissingOccasion(true);
      return;
    }
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

    if (result !== value&&result) {
      updateSession2({ greeting: result });
      //setGreeting(result);
      setValue(result);
      setLoadReady(true);
    }
  };
  const handleAccept: () => void = async () => {
    let image = '';
    if (selectedImage.url) {
      image = await convertDivToPng(canvasRef.current);
    }
    await saveToHistory(authSession.username, greeting, occasion, to, image, gift);

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
  console.log("selectedImage", selectedImage);
  return (
    <>
      <ToolbarGenerate onGenerateClick={handleGenerate} onUploadClick={onUpload} hasGreeting={session.greeting ? true : false} />
      <Box sx={{ my: 1, width: { xs: 1 } }} textAlign="center">
        <TextEditor text={session.greeting || ''} onChange={(text: string) => { updateSession2({ greeting: text }); }} image={selectedImage} loading={loading} canvasRef={canvasRef} />
        {session.greeting && !loading && <ToolbarAccept text={session.greeting} images={images} onDownloadClick={handleDownload} onAcceptClick={handleAccept} onCopyClick={handleCopy} />}
        {!loading && false && (
          <BottomLink>
            <Link href="https://www.american-outdoorsman.news">Sponsor: www.american-outdoorsman.news</Link>
          </BottomLink>
        )}
      </Box>
      <Box sx={{ my: 4, width: { xs: 1 } }} textAlign="center">
        {images.length > 0 && <ImageStrip images={images} onImageClick={stripClickHandler} />}
      </Box>

    </>
  );
}
