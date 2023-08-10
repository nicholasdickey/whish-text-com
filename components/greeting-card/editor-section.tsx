import { styled } from "styled-components";
interface SectionProps {
    darkMode: boolean;
}
const Section = styled.div<SectionProps>`
width:100%;
height:100%;
display:flex;
background:${({darkMode})=>darkMode?'#444':'#eee'};
padding:30px;
//margin-bottom:30px;
//border:1px solid #ccc;
border-radius: 20px;
font-size:6px;
flex-direction:column;
justify-content:flex-start;
text-align:left;
& textarea{
    width:100%;
    overflow:auto;
} 
@media (max-width: 768px) {
    background:inherit; 
    padding:0px;
    border:0px; 
    border-bottom:3px;
    border-radius: 0px;
    //background:${({darkMode})=>darkMode?'#eee':'#333'};
}
`;

export default Section;