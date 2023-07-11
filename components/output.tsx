import React, { useState, useRef, useEffect, useCallback } from "react";
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
import FileSaver from "file-saver";
import TextEditor, { TextEditorProps, ImageProps } from "./text-editor";
import * as ga from '../lib/ga'

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

  const canvasRef = useRef<HTMLDivElement>(null);
  const horiz: boolean = selectedImage.width > selectedImage.height;

  const convertDivToPng = async (div: any) => {
    const canvas = await html2canvas(div, {
      useCORS: true,
      logging: true,
      width: div.width,
      height: div.height,
      scale: window.devicePixelRatio,
    });
    const image = canvas.toDataURL("image/png", 1.0);
    return image;
  };

  const stripClickHandler = useCallback((image: ImageData | null): void => {
    ga.event({
      action: "stipClickHandler",
      params : {
        sessionid: session.sessionid,
        image: image?.url,
      }
    })
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
    if (image?.url)
      updateSession2({ selectedImage: JSON.stringify(image) });
  },[updateSession2, session.sessionid]);
 
  useEffect(() => {
    console.log("useEffect", greeting)
    if (!greeting && selectedImage?.url) {
      console.log("useEffect stripClickHandler null")
      stripClickHandler(null);
    }
  }, [greeting, selectedImage, stripClickHandler]);

  const handleGenerate = async () => {
    if (loading) return;
    if (!occasion) {
      setMissingOccasion(true);
      return;
    }
    setLoading(true);
    setLoadReady(true);
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
      sessionid:session.sessionid,
    });
    setLoading(false);
    setLoadReady(false);

    if (result !== value && result) {
      updateSession2({ greeting: result });
      setValue(result);
      setLoadReady(true);
    }
    ga.event({
      action: "generate",
      params : {
        sessionid: session.sessionid,
        greeting: result,
        occasion,
        from,
        to,
        reflections,
        instructions,
        inastyleof,
        language,
        fresh: value ? true : false,
      }
    })
  };

  const handleAccept: () => void = async () => {
    let image = '';
    if (selectedImage.url) {
      image = await convertDivToPng(canvasRef.current);
    }
    await saveToHistory(authSession.username, greeting, occasion, to, image, gift);
  };

  const handleCopy: () => void = () => {
    // Add your implementation here
  };

  const handleDownload = async () => {
    try {
      const data = await convertDivToPng(canvasRef.current);

      var randomstring = () => Math.random().toString(8).substring(2, 7) + Math.random().toString(8).substring(2, 7);

      const filename = `${randomstring()}-wt2.png`;
      ga.event({
        action: "download",
        params : {
          sessionid: session.sessionid,
      
        }
      })
      if (window.saveAs) {
        window.saveAs(data, 'a' + filename);
      } else {
        FileSaver.saveAs(data, filename);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onUpload = (result: any, widget: any) => {
    const { secure_url: url, public_id: publicId, height, width, thumbnail_url: thumbnailUrl, original_filename: originalFilename } = result.info;
    ga.event({
      action: "upload",
      params : {
        sessionid: session.sessionid,
        url: url,
        original_filename: originalFilename,
      }
    })
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
      <ToolbarGenerate onGenerateClick={handleGenerate} onUploadClick={onUpload} hasGreeting={session.greeting ? true : false} />
      <Box sx={{ my: 1, width: { xs: 1 } }} textAlign="center">
        <TextEditor session={session} text={session.greeting || ''} onChange={(text: string) => { updateSession2({ greeting: text }); }} image={selectedImage} loading={loading} canvasRef={canvasRef} />
        {session.greeting && !loading && <ToolbarAccept session={session} text={session.greeting} images={images} onDownloadClick={handleDownload} onAcceptClick={handleAccept} onCopyClick={handleCopy} />}
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
