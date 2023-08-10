import ImageData from "./image-data";
export default interface CardData {
    image:ImageData;
    signature: string;
    num?: number;  //session_history ordinal
    linkid?:string;
    greeting?:string;
  }
  