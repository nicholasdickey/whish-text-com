import React, { useState, useRef, useEffect, useCallback } from "react";
import { styled } from "styled-components";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Image from "next/image";
import { getSessionCards, addSessionImage } from "../lib/api";
import { Options } from "../lib/with-session";

import ToolbarUpload from "./toolbar-upload";
import ImageStrip from "./image-strip";
import ImageData from "../lib/image-data";
import CardData from "../lib/card-data";
import html2canvas from "html2canvas";
import FileSaver from "file-saver";
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { recordEvent, recordSessionCard } from '../lib/api'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import * as ga from '../lib/ga'
import CardPlayerToolbar from "../components/toolbar-card-player";
import Card from './card4'

import TextareaAutosize from '@mui/base/TextareaAutosize';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';

const Starter = styled.div`
  display:flex;
  justify-content:flex-start;
  font-size:36px;
  align-items:center;
  margin-top:24px;  
  `;
const StarterMessage = styled.div`
  font-size:14px;
  padding-left:10px;
  padding-right:10px;
  `;

const StyledTextareaAutosize = styled(TextareaAutosize)`
  background:inherit;
  color: inherit;
  padding: 10px;  
  overflow:auto;
  width:100%;
  height:100%;
  `;

const CursiveEditorBox = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  text-align:left;
  & textarea{
    width:100%;
    overflow:auto;
  } 
  `;

  const SignatureLabel = styled.div`
   display:flex;
   text-align:left !important;
  justify-content:flex-start;
  `;
export default function Output({

  num,
  onVirgin2,
  virgin,
  prompt4,
  prompt5,
  prompt6,
  session,
  updateSession2,
  greeting,
  setPrompt5,
  setPrompt6,
  sharedImages,
  fbclid,
  utm_content,
  darkMode,
  startOpen,
  cardNum,
  cardMax,
  setNumPointer,
  loading,
  currentCard,
  newCard,
  setCurrentCard,
  setNewCard,
  setCardNum,
  setCardMax,
  images,
  setImages
  // authSession
}: {

  setMax: any;
  num: number;
  max: number;
  onVirgin: any;
  onVirgin2: any;
  virgin: boolean;
  virgin2: boolean;
  prompt4: boolean;
  prompt5: boolean;
  prompt6: boolean;

  setLoadReady: any;
  session: Options;
  updateSession2: any;
  greeting: string;

  setPrompt5: any;
  setPrompt6: any;
 
  sharedImages: ImageData[];
  sessionid: string;
  fbclid: string;
  utm_content: string;
  darkMode: boolean;
  startOpen?: boolean;
  setNum: (num: number) => void;
  cardNum: number;
  cardMax: number;
  setNumPointer: (num: number) => void;
  loading:boolean;
  currentCard:CardData;
  newCard:CardData;
  setCurrentCard:(card:CardData)=>void;
  setNewCard:(card:CardData)=>void;
  setCardNum:(num:number)=>void;
  setCardMax:(num:number)=>void;
  images:ImageData[];
  setImages:(images:ImageData[])=>void;

  //  authSession: any;
}) {


  const [prevGreeting, setPrevGreeting] = useState<string>(greeting);
  

  const theme = useTheme();
  const canvasRef = useRef<HTMLDivElement>(null);

  // console.log("RENDER output",greeting,value)
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

  useEffect(() => {
    if (greeting !== prevGreeting) {
      updateSession2({currentCardString:JSON.stringify(newCard) });
    }
  }, [greeting]);
  
 
  
  const processCardRecord = async (record: CardData, cardNum: number) => {
    const { image, signature, num, linkid } = record;
    const card={
      num,
      image,
      signature,
      linkid
    }
    setCurrentCard(card);
    setCardNum(cardNum);
    setNumPointer(num);
    updateSession2({ num, cardNum, linkid,currentCardString:JSON.stringify(card)});
  }

  const OutputPlayerToolbar = <>{cardMax > 0 ? <CardPlayerToolbar
    num={cardNum}
    max={cardMax}
    onPrevClick={async () => {
      console.log("onPrevClick2=>", cardNum, cardMax)
      if (cardNum > 0) {
        const { success, record } = await getSessionCards(session.sessionid, cardNum - 1);
        console.log("onPrevClick2", success, record)
        if (success) {
          await processCardRecord(record, cardNum - 1);
        }
      }
    }}
    onNextClick={async () => {
      console.log("onNextClick2=>", cardNum, cardMax)
      if (cardNum < cardMax) {
        const { success, record } = await getSessionCards(session.sessionid, cardNum + 1);
        console.log("onNextClick2", success, record)
        if (success) {
          await processCardRecord(record, cardNum + 1);
        }
      }
      else {await processCardRecord(newCard, cardMax);
      
      }
    }}
    onFirstClick={async () => {

      const { success, record } = await getSessionCards(session.sessionid, 0);
      console.log("onFirstClick2", success, record)
      if (success) {
        await processCardRecord(record, 1);
      }
    }}
    onLastClick={async () => {
      console.log("onLastClick2")
      await processCardRecord(newCard, 1);
    }}
  /> : null}</>
  const stripClickHandler = (image: ImageData | null): void => {
    ga.event({
      action: "stipClickHandler",
      params: {
        sessionid: session.sessionid,
        image: image?.url,
      }
    })
    if (image?.url)
      setPrompt6(true)
    setTimeout(async () => await recordEvent(session.sessionid, 'stripClickHandler', image?.url || ''), 1000);
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
    console.log("render: setSelectedImage", image);
    // setSelectedImage(image);
    const card: CardData = {
      num: newCard?.num,
      image: image,
      signature: newCard?.signature,
      linkid: newCard?.linkid
    }
    setNewCard(card);
    setCurrentCard(card)
   
    // if (image?.url)
    updateSession2({ currentCardString: JSON.stringify(card),newCardString: JSON.stringify(card) });
  };

  useEffect(() => {
    //console.log("useEffect", greeting)
    if (!greeting && newCard?.image?.url) {
      //console.log("useEffect stripClickHandler null")
      stripClickHandler(null);
    }
  }, [greeting, newCard, stripClickHandler]);

  const onTextEditorClick = () => {
    setTimeout(async () => await recordEvent(session.sessionid, 'clickOnTextEditor', ''), 1000);
    setPrompt5(true);
    updateSession2({ prompt5: true });
  }
  const handleCreate: () => void = async () => {
    setTimeout(async () => await recordEvent(session.sessionid, 'create-card', ''), 1000);
    let card: CardData = {
      num: newCard?.num,
      image: newCard?.image,
      signature: newCard?.signature,
      greeting: greeting,
    }
    const { success, linkid, cardNum } = await recordSessionCard(session.sessionid, card);
    card.linkid=linkid;
    if (success) {
      setNewCard(card);
      setCurrentCard(card);
      setCardNum(cardNum);
      setCardMax(cardNum);
      updateSession2({currentCardString: JSON.stringify(card),newCardString: JSON.stringify(card) ,cardNum, cardMax: cardNum });
    }
  }

  const handleDownload = async () => {
    try {
      const data = await convertDivToPng(canvasRef.current);

      var randomstring = () => Math.random().toString(8).substring(2, 7) + Math.random().toString(8).substring(2, 7);

      const filename = `${randomstring()}-wt2.png`;
      ga.event({
        action: "download",
        params: {
          sessionid: session.sessionid,

        }
      })
      setTimeout(async () => await recordEvent(session.sessionid, 'download', ''), 1000);

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
      params: {
        sessionid: session.sessionid,
        url: url,
        original_filename: originalFilename,
      }
    })
    setTimeout(async () => await recordEvent(session.sessionid, 'upload', `${originalFilename};${url}`), 1000);

    const newImage: ImageData = {
      url,
      publicId,
      height,
      width,
      thumbnailUrl,
      original_filename: originalFilename,
    };

    setImages([...images, newImage]);
    //setSelectedImage(newImage);
    setTimeout(async () => {
      const newImagesData=await addSessionImage(session.sessionid, newImage);
     // if(newImagesData.success)
     // setImages(newImages.);)  
    },1);

    const card={
      num: newCard?.num,
      image: newImage,
      signature: newCard?.signature,
      linkid: newCard?.linkid
  
    }
    setCurrentCard(card);
    setNewCard(card);
    updateSession2({ imagesString: JSON.stringify([...images, newImage]),  currentCardString: JSON.stringify(currentCard),  newCardString: JSON.stringify(newCard) });
  };

  
  console.log("RENDER currentCard:", currentCard);
  
  const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = event.target.value;
  
    const card = {
      num: newCard?.num,
      image: currentCard.image,
      signature: text,
      linkid: ''
    }
    setCurrentCard(card);
    setNewCard(card);
    console.log("handleSignatureChange", text);
    setTimeout(() => updateSession2({ currentCardString: JSON.stringify(card), newCardString:JSON.stringify(card) }), 1);

  };
  return (
    <>
      <div>
        {greeting && OutputPlayerToolbar}
      </div>
      <CursiveEditorBox>
        <FormControlLabel
          sx={{ width: 1, m: 0, p: 0 }}
          labelPlacement="top"
          label={<SignatureLabel><Typography sx={{ mb: 2 }} style={{ textAlign:"left",color: theme.palette.text.secondary }}>Add a signature line:</Typography></SignatureLabel>}
          control={
            <StyledTextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Add a 'handwritten' signature line."
              onChange={handleSignatureChange}
              defaultValue={currentCard.signature}
            />
          }
        />
        <FormHelperText sx={{ width: 1, m: 1, p: 0 }}>For example: Love, Mom &amp; Dad!</FormHelperText>
      </CursiveEditorBox>


      <Box sx={{ mt: 2, mb: 2 }} textAlign="center">
        <Card startOpen={startOpen} large={true} fbclid={fbclid} utm_content={utm_content} dark={darkMode ? "true" : "false"} text={greeting || ""} image={currentCard.image} signature={currentCard.signature} />
      </Box>

      {!prompt6 && virgin &&!loading ? <Box sx={{ mt: 0, width: 1 }}>
        <Starter onClick={() => setPrompt6(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
          <StarterMessage><Typography fontSize="inherit" color="secondary"/*color="#ffee58"*/>Use stock AI-generated images or upload your own:</Typography></StarterMessage></Starter></Box> : null}



      <Box sx={{ mt: 18, pr: 0, width: { xs: 1 } }} textAlign="center">
        {(images.length > 0 || sharedImages.length > 0) && session.greeting && <ImageStrip sharedImages={sharedImages} images={images} onImageClick={stripClickHandler} />}
      </Box>
      <ToolbarUpload error={greeting?.length > 0 ? false : true} onUploadClick={onUpload} hasGreeting={session.greeting ? true : false} />
      linkid:{currentCard.linkid}
      {!currentCard.linkid && <Box sx={{ mt: 1, width: 1 }}>
        <Button fullWidth variant="contained" onClick={handleCreate}>Create a public link</Button>

      </Box>
      }


      {!prompt5 && prompt4 && session.greeting && !loading ? <Box sx={{ mt: 10, width: 1 }}>
        <Starter onClick={() => setPrompt5(true)}><ErrorOutlineOutlinedIcon fontSize="inherit" color='success' />
          <StarterMessage><Typography fontSize="inherit" color="secondary"/*color="#ffee58"*/>Click or tap on message to manually edit. </Typography></StarterMessage></Starter></Box> : null}


    </>
  );
}
