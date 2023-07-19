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
import Typography from '@mui/material/Typography';
import ReactMarkdown from "react-markdown";
import TextEditor, { TextEditorProps, ImageProps } from "./text-editor";
import { recordEvent } from '../lib/api'
import LooksFiveOutlinedIcon from '@mui/icons-material/Looks5Outlined';
//import ErrorOutlineOutlinedIcon from '@mui/icons-material/NextPlanOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import * as ga from '../lib/ga'
const Starter = styled.div`
  display:flex;
  justify-content:flex-start;
  font-size:36px;
  align-items:center;
  margin-top:4px;
  
  `;
const StarterMessage = styled.div`
  font-size:14px;
  padding-left:10px;
  padding-right:10px;
  `;

const BottomLink = styled.div`
  padding: 10px;

  & a {
    color: white;
    text-decoration: none;
  }
`;

export default function Output({
  setNum,
  setMax,
  num,
  max,
  onVirgin,
  onVirgin2,
  virgin,
  virgin2,
  prompt5,
  prompt6,
  setMissingOccasion,
  setLoadReady,
  session,
  updateSession2,
  from,
  to,
  occasion,
  naive,
  reflections,
  instructions,
  inastyleof,
  language,
  greeting,
  setPrompt5,
  setPrompt6,
  PlayerToolbar,
  sharedImages
 // authSession
}: {
  setNum:any;
  setMax:any;
  num:number;
  max:number;
  onVirgin: any;
  onVirgin2:any;
  virgin:boolean;
  virgin2:boolean;
  prompt5:boolean;
  prompt6:boolean;
  setMissingOccasion: any;
  setLoadReady: any;
  session: Options;
  updateSession2: any;
  from: string;
  to: string;
  occasion: string;
  naive: boolean;
  reflections: string;
  instructions: string;
  inastyleof: string;
  language: string;
  greeting: string;
  setPrompt5: any;
  setPrompt6:any;
  PlayerToolbar: any;
  sharedImages:ImageData[];
//  authSession: any;
}) {
  const [value, setValue] = useState("");
  //const [num,setNum]=useState(0);
  //const [max,setMax]=useState(0);
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
    setPrompt6(true)
    setTimeout(async ()=>await recordEvent(session.sessionid, 'stripClickHandler',image?.url||''),1000);
   // console.log("image-stripClickHandler", image);    
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
   // if (image?.url)
      updateSession2({ selectedImage: JSON.stringify(image) });
  },[updateSession2, session.sessionid]);
 
  useEffect(() => {
    //console.log("useEffect", greeting)
    if (!greeting && selectedImage?.url) {
      //console.log("useEffect stripClickHandler null")
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
    onVirgin();
    if(greeting){
      onVirgin2();
    }
    setTimeout(async ()=>await recordEvent(session.sessionid, 'generate',JSON.stringify({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      fresh: value ? true : false,
      sessionid:session.sessionid,
    },null,4)),1000);
  
    const {content:result,num} = await getWishText({
      style: "",
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      fresh: value ? true : false,
      sessionid:session.sessionid,
    });
    setLoading(false);
    setLoadReady(false);
    //console.log("handleGenerate", result,num);
    if (result !== value && result) {
      updateSession2({ greeting: result,num ,max:num});
      setValue(result);
      setNum(num);
      setMax(num);
     
      setLoadReady(true);
      const elem = document.getElementById('wt-output');
      //elem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(()=>
      /*window.scrollTo({
        top:(elem?.getBoundingClientRect().top),//-200,
        behavior: "smooth",
      })*/ elem?.scrollIntoView({ behavior: 'smooth', block: 'center' }),100); 
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
   // await saveToHistory(authSession.username, greeting, occasion, to, image, gift);
  };
  const onTextEditorClick=()=>{
    setTimeout(async ()=>await recordEvent(session.sessionid, 'clickOnTextEditor',''),1000);
    setPrompt5(true);
    updateSession2({ prompt5: true });
  }
  const handleCopy: () => void = () => {
    // Add your implementation here
    setTimeout(async ()=>await recordEvent(session.sessionid, 'copyToClipboard',''),1000);
    setPrompt5(true);
    updateSession2({ prompt5: true });
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
      setTimeout(async ()=>await recordEvent(session.sessionid, 'download',''),1000);
   
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
    
    onVirgin2();
    
    ga.event({
      action: "upload",
      params : {
        sessionid: session.sessionid,
        url: url,
        original_filename: originalFilename,
      }
    })
    setTimeout(async ()=>await recordEvent(session.sessionid, 'upload',`${originalFilename};${url}`),1000);
   
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
  //console.log('error', occasion?.length>0?false:true)
  return (
    <>
      {occasion&&<ToolbarGenerate error={occasion?.length>0?false:true} onGenerateClick={handleGenerate} onUploadClick={onUpload} hasGreeting={session.greeting ? true : false} />}
     
      <Box sx={{ my: 3,  }} textAlign="center">
      {virgin&&!prompt5&&session.greeting&&!loading  ? <Box sx={{ mt: 0, width: 1 }}>
            <Starter onClick={()=>setPrompt5(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography fontSize="inherit"  color="secondary"/*color="#ffee58"*/>Click or tap on message to manually edit:</Typography></StarterMessage></Starter></Box> : null}
       
      {session.greeting&&PlayerToolbar}
        <TextEditor  onClick={onTextEditorClick} session={session} text={session.greeting || ''} onChange={(text: string) => { updateSession2({ greeting: text }); }} image={selectedImage} loading={loading} canvasRef={canvasRef} />
        <div  />
        {false&&virgin&&!prompt5 && !loading ? <Box sx={{ mt: 0, width: 1 }}>
            <Starter onClick={()=>setPrompt5(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography fontSize="inherit"  color="secondary"/*color="#ffee58"*/>Copy message to clipboard to be used with your favorite messenger or social media app.</Typography></StarterMessage></Starter></Box> : null}
             
        {session.greeting && !loading && <ToolbarAccept session={session} text={session.greeting} images={images} onDownloadClick={handleDownload} onAcceptClick={handleAccept} onCopyClick={handleCopy} />}
        {!loading && false && (
          <BottomLink>
            <Link href="https://www.american-outdoorsman.news">Sponsor: www.american-outdoorsman.news</Link>
          </BottomLink>
        )}
      </Box>
      {!prompt6&&value&&virgin&&!loading  ? <Box sx={{ mt: 0, width: 1 }}>
            <Starter onClick={()=>setPrompt6(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography fontSize="inherit"  color="secondary"/*color="#ffee58"*/>Use stock AI-generated images or upload your own:</Typography></StarterMessage></Starter></Box> : null}
  
 
      <Box sx={{ my: 4, width: { xs: 1 } }} textAlign="center">
        {(images.length > 0 ||sharedImages.length>0)&& session.greeting&&<ImageStrip sharedImages={sharedImages} images={images} onImageClick={stripClickHandler} />}
      </Box>
     
        </>
  );
}
