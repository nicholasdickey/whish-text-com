// components/PopoutCard.tsx
import React, { useState } from 'react';
import styled from "styled-components";

import ImageData from "../../../lib/image-data";
import CardData from "../../../lib/card-data";
import EmptyImage from "../empty-image";
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
import Backdrop from '@mui/material/Backdrop';
//@ts-ignore
import SwipeableViews from "react-swipeable-views-react-18-fix";
//import Slider from "react-slick";
import Dialog from '@mui/material/Dialog';
const Popout = styled.div`
    position:fixed;
    top:0px; 
    left:0px;    
    width:100%;
    height:100%;
   // background:inherit;
    //overflow-y:hidden;
    display:flex;
    flex-direction:column;
    justify-content:center;

`;

const Left = styled.div`
//background:red;
height:100%;
width:100%;
max-width: ${3 * 310}px;
max-height: ${4 * 310}px;
`
const Right = styled.div`
background:blue;
height:100%;
width:100%;
max-width: ${3 * 310}px;
max-height: ${4 * 310}px;
//min-height:100%;
`;
const Image = styled.img`
    object-fit: cover;
   // max-width: ${3 * 310}px;
   // max-height: ${4 * 310}px;
    width:100%;
    height:75vh;
    //z-index:101;
   // border-radius: 5px;  
   // transform: rotateY(180deg);  

   
`;
interface PopoutCardProps {
    close: () => void;
    card: {
        text: string;
        image: ImageData;
        signature: string;
    };
}

const PopoutCard = ({ close, card }: PopoutCardProps) => {
    const [isLeftPage, setIsLeftPage] = useState(true);

    const settings = {
        // dots: true,
        //infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // ignoreNativeScroll: true,
    };
    /* const handlers = useSwipeable({
         onSwipedLeft: (eventData) => {
             console.log("User Swiped Left!", eventData);
             setIsLeftPage(true)
         },
         onSwipedRight: (eventData) => {
             console.log("User Swiped Right!", eventData);
             setIsLeftPage(false)
         },
     });*/
    return (
        <Dialog  fullScreen open={true}>
            <Popout onClick={() => close()}>

                <SwipeableViews disableNativeScrolling={true}>
                    <Left>
                        <Image src={card.image.url} />

                    </Left>
                    <Right >
                        RIGHT
                    </Right>
                </SwipeableViews>


            </Popout></Dialog>

    );
};

export default PopoutCard;
