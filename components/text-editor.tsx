import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import AdIntro from "./ad-intro";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga';
import LinearProgress from '@mui/material/LinearProgress';
import ImageOverlay from "./image-overlay";
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
`;
interface BodyProps {
  l:number;
}
const Body = styled.div<BodyProps>`
  width:100%;
  display:flex;
  justify-content:center;
  font-size:18px;
  font-weight: 400;
  line-height: 1.7;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  padding-top:1px;
  padding-bottom:20px;
  margin-bottom: 20px;
  @media (max-width: 990px) {
    font-size:${({l})=>l>600?11:l>400?12:l>300?13:l>200?14:16}px;
  }
`;

const BackgroundWrapper = styled.div`
  width: 100%;
  background-color: #000; /* Add black background color */
  display:flex;
  flex-direction:column;
  height:auto;
  text-overflow:clip;  
`;
const BackgroundFiller = styled.div`
  width: 100%;
  flex-grow: 1;
`;
interface StyledImageProps {
  height: number;
  width: number;
  div: any;
  adjheight: string;
  adjwidth: string;
}

const BackgroundImage = styled.img<StyledImageProps>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  height:auto; 
  width:100%;
  z-index: 1;
`;

interface InnerOutputProps {
  length: number;
  horiz?: string;
  image: string;
  adjheight: string;
  adjwidth: string;
}

const InnerOutput = styled.div<InnerOutputProps>`
  
  position: relative;
  white-space: pre-line;
  justify-content: flex-end;
  overflow-wrap: break-word;
  font-size: ${({ length, horiz }) =>{
    const h=horiz=="true";
    return `${length > 600 ? (h ? '12' : '19') : length > 500 ? (h ? '12' : '20') : length > 100 ? (h? '12' : '12') : h ? '12' : '12'}`}}px;  
  width:'100%';
  height:${({adjheight})=>adjheight};
  @media (max-width: 990px) {
    font-weight: 400;
    font-size: ${({ length, horiz }) =>{
    const h=horiz=="true";
    return `${length < 600 ? (h ? '9' : '14') : length < 500 ? (h ? '10' : '15') : length < 400 ? (h ? '11' : '16') : h ? '7' : '12'}`}}px;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; /* Set the height to 100% */
    background: ${({ image }) => image=="true" ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 1.0) 100%)` : null};
    z-index: 4;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height:100%;
    z-index: 5;
  }
  & p {
    padding-left: ${({image})=>image=="true"?20:4}px;
    padding-right:  ${({image})=>image=="true"?10:4}px;
    padding-top: 10px;
    opacity: 0.9;
    margin-top: auto;
    margin-bottom: 10px; /* Add margin-bottom to prevent text overflow */
    bottom: 0;
    color:${({ image }) => image=="true" ? 'white' : null};
    z-index: 6;
    overflow-wrap: break-word;
    text-align: left;
    font-family: PingFangSC-Regular, 'Roboto', sans-serif;
    letter-spacing: 0.01px;
  }
  & div#adintro {
    opacity: 1.0;
    margin-bottom: 10px;
    color: white;
    position: relative;
    z-index: 4;
  }
`;
export interface ImageProps {
  url: string;
  publicId: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  original_filename: string;
}
export interface TextEditorProps {
  image: ImageProps;
  text: string;
  loading: boolean;
  onChange: (text: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  session: any,
  onClick:any;
}
const editorStyles = {
  color: "#fff", // Text color
  zIndex: 4,
  minHeight: 250,
  overflow: "auto"
};
interface MarkProps {
  image:string;
}
const Mark=styled.div<MarkProps>`
position: ${({image})=>image=="true"?'absolute':'relative'};
bottom:0;
`;
const MarkdownEditorWrap = styled.div`
  position:absolute;
  bottom:0;
  width:100%;
  height:100%;
  & textarea{
    background:  #262644 !important; // Dark background color
    color:#fff !important; // Text color
    overflow:auto;
  }
  &.section-container{
    background:  #262644; // Dark background color
    color:#fff; // Text color
  }
  &section{
    background:  #262644; // Dark background color
    color:#fff; // Text color
    overflow:auto;
  }
`;
const TextEditor: React.FC<TextEditorProps> = ({ session, image, text, loading, onChange, canvasRef,onClick }) => {
  const horiz: boolean = image.width > image.height;
  const mdParser = new MarkdownIt();
  const [editing, setEditing] = useState(false);
  const theme = useTheme();
  //console.log("texteditor", text);
  const handleTextClick = () => {
    ga.event({
      action: "textClick",
      params: {
        sessionid: session.sessionid,
        text: text,
      }
    })
    setEditing(true);
    onClick();
  };

  /*const handleTextChange = (value: string) => {
     onChange(value);
   };
 */
  const handleTextChange = ({ text }: { text: string }) => {
    ga.event({
      action: "textEditorChange",
      params: {
        sessionid: session.sessionid,
        text: text,
      }
    })
    onChange(text);
  };
  let ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [canvasRef]);
  text = text.replaceAll('\n\n', '\n');
  const tw = text.split('\n');
  const headline=tw.length>1?tw[0]:'';
  const body=tw.length>1?tw.slice(1).join('\n'):tw[0];
 // console.log('tw=>:',tw, headline,body)
 // console.log('headline=>:',headline)
  //console.log('body=>:',body)
 // console.log("texteditor", text, image)
 // console.log("image:",image); 
  const div=canvasRef.current;
  const nominalWidth=div?div.clientWidth>500?div.clientWidth:552:552;
  const {height,width}=image;
  let grow= 1;//div ? div.clientWidth<nominalWidth?nominalWidth/width:1:1;
  if(grow>1)grow=1;
  const ratio = height / width;
  const minWidth=nominalWidth?nominalWidth:div?div.clientWidth:552;
  const adjHeight= image.url?div ? `${Math.ceil(minWidth * ratio*grow)}px` : `${height}px`:'100%';
  const adjWidth=image.url?div ? div.clientWidth<nominalWidth?`${nominalWidth}px`:'100%':'100%':'100%';
  //console.log("image-props:",{minWidth,ratio,grow,nominalWidth,divWidth:div?div.clientWidth:0,adjWidth,adjHeight});
  //console.log("text-image:",text.length,horiz)
 return (
    <div>
      <div data-id="canvas" style={{ position: "relative"}} ref={canvasRef}>
     
        <InnerOutput image={image.url?"true":"false"} ref={ref} className="inner-output" adjheight={adjHeight}  adjwidth={adjWidth} data-id="GreetingsOutput:InnerOutput" length={text.length} horiz={horiz?"true":"false"}>
        
          {!editing ? (
            <Mark image={image.url?"true":"false"} onClick={() => handleTextClick()} >
              <Headline ><ReactMarkdown>
                {loading ? "" : headline}
              </ReactMarkdown></Headline>
              <div />
              {loading&&<LinearProgress />}
             <Body l={text.length}  id='wt-output'> <ReactMarkdown>
                {loading ? "Generating..." : body}
              </ReactMarkdown></Body>
            </Mark>
          ) : (
            <MarkdownEditorWrap><MdEditor
              name={'text-editor'}
              value={text}
              style={editorStyles} // Apply custom editor styles
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleTextChange}
              view={{ menu: false, md: true, html: false }}
            /></MarkdownEditorWrap>
          )}
        </InnerOutput>
        {image.url&&<BackgroundWrapper>{image && <BackgroundImage adjheight={adjHeight} adjwidth={adjWidth} div={canvasRef.current} height={image.height} width={image.width} src={image.url} />}<BackgroundFiller /></BackgroundWrapper>}
      </div>
    </div>
  );
};

export default TextEditor;
/*
 <InnerOutput image={image.url} ref={ref} className="inner-output" div={canvasRef.current} height={image.height + (text.length > 400 ? horiz ? 150 : 50 : 0)} width={image.width} data-id="GreetingsOutput:InnerOutput" length={text.length} horiz={horiz} editable={editing}>
        
          {!editing ? (
            <Mark image={image.url?true:false} onClick={() => handleTextClick()} >
              <Headline ><ReactMarkdown>
                {loading ? "" : headline}
              </ReactMarkdown></Headline>
              <div />
              {loading&&<LinearProgress />}
             <Body id='wt-output'> <ReactMarkdown>
                {loading ? "Generating..." : body}
              </ReactMarkdown></Body>
            </Mark>
          ) : (
            <MarkdownEditorWrap><MdEditor
              name={'text-editor'}
              value={text}
              style={editorStyles} // Apply custom editor styles
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleTextChange}
              view={{ menu: false, md: true, html: false }}
            /></MarkdownEditorWrap>
          )}
        </InnerOutput>


        */