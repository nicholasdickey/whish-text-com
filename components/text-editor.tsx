import React, { useState, useRef,useEffect } from "react";
import { styled } from "styled-components";
import AdIntro from "./ad-intro";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { useTheme } from '@mui/material/styles';
const BackgroundWrapper = styled.div`
  width: 100%;
  //background-color: #000; /* Add black background color */
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
}

const BackgroundImage = styled.img<StyledImageProps>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height, div, width }) => {
    const ratio = height / width;
    return div ? div.clientWidth * ratio : height;
  }}px;
  z-index: 1;
`;

interface InnerOutputProps {
  length: number;
  height: number;
  width: number;
  div: any;
  horiz?: boolean;
  editable: boolean;
  image:string;
}

const InnerOutput = styled.div<InnerOutputProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  justify-content: flex-end;
  overflow-wrap: break-word;
  font-size: ${({ length, horiz }) =>
    `${length < 600 ? (horiz ? '17' : '19') : length < 500 ? (horiz ? '18' : '20') : length < 400 ? (horiz ? '19' : '21') : horiz ? '16' : '18'}`}px;
  width: 100%;

  @media (max-width: 990px) {
    font-weight: 400;
    font-size: ${({ length, horiz }) =>
      `${length < 600 ? (horiz ? '9' : '14') : length < 500 ? (horiz ? '10' : '15') : length < 400 ? (horiz ? '11' : '16') : horiz ? '7' : '12'}`}px;
  }

  height: ${({ div, width, height }) => {
    const ratio: number = height / width;
    return div ? div.clientWidth * ratio : height;
  }}px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; /* Set the height to 100% */
    background: ${({image})=>image?`linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 1.0) 100%)`:null};
    z-index: 4;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 4;
  }

  & p {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    opacity: 0.9;
    margin-top: auto;
    margin-bottom: 10px; /* Add margin-bottom to prevent text overflow */
    bottom: 0;
    color:${({image})=>image?'white':null};
    z-index: 4;
    overflow-wrap: break-word;
    text-align: left;
    font-family: PingFangSC-Regular, 'Roboto', sans-serif;
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
}
const editorStyles = {
 // background:"transparent",// "#262644", // Dark background color
 //backgroundColor:"rgba(0, 0, 0, 0.5);",
  color: "#fff", // Text color
  zIndex:4,
  //marginTop:64,
  minHeight: 200,
  overflow: "auto"
  
};
const MarkdownEditorWrap = styled.div`
  
  & textarea{
   // background: transparent !important;
    //background-color:rgba(0, 0, 0, 0.5);
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
const TextEditor: React.FC<TextEditorProps> = ({ image, text, loading, onChange, canvasRef }) => {
  const horiz: boolean = image.width > image.height;
  const mdParser = new MarkdownIt();
  const [editing, setEditing] = useState(false);
  const theme = useTheme();
  console.log("texteditor",text);
  const handleTextClick = () => {
    setEditing(true);
  };

 /*const handleTextChange = (value: string) => {
    onChange(value);
  };
*/
const handleTextChange = ({ text }: { text: string }) => {
  onChange(text);
};
  let ref=useRef<HTMLDivElement>(null);
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
 text=text.replaceAll('\n\n','\n');
console.log("texteditor",text,image )
  return (
    <div>
      <div style={{ position: "relative" }} ref={canvasRef}>
        <InnerOutput image={image.url} ref={ref} className="inner-output" div={canvasRef.current}  height={image.height +(text.length>400?horiz?150:50:0)} width={image.width} data-id="GreetingsOutput:InnerOutput" length={text.length} horiz={horiz} editable={editing}>
          {!editing ? (
            <div style={{zIndex:4}} onClick={()=>handleTextClick()} >
              <ReactMarkdown>
                {loading ? "Generating..." : text}
              </ReactMarkdown>
            </div>
          ) : (
            <MarkdownEditorWrap><MdEditor
            name={'text-editor'}
            value={text}
            style={editorStyles} // Apply custom editor styles
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleTextChange}
            view={{ menu: false, md: true, html: false}}
          /></MarkdownEditorWrap>
          )}
        </InnerOutput>
        <BackgroundWrapper>{image && <BackgroundImage div={canvasRef.current} height={image.height} width={image.width} src={image.url} />}<BackgroundFiller/></BackgroundWrapper>
      </div>
    </div>
  );
};

export default TextEditor;
