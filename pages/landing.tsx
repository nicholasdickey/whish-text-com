import * as React from 'react';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { AppBar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useCallback, useEffect } from "react"
import { useRouter } from 'next/router'
import { fetchSession, recordEvent, updateSession, deleteSessionHistories, getSessionHistory } from '../lib/api'
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Clear';
import { RWebShare } from "react-web-share";
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import Script from 'next/script'
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import LooksThreeOutlinedIcon from '@mui/icons-material/Looks3Outlined';
import LooksFourOutlinedIcon from '@mui/icons-material/Looks4Outlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';//'@mui/icons-material/LightbulbCircleTwoTone';//'@mui/icons-material/MarkUnreadChatAltOutlined';//'@mui/icons-material/NextPlanOutlined';//'@mui/icons-material/ErrorOutlineOutlined';
import NextPlanOutlinedIcon from '@mui/icons-material/NextPlanOutlined';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import LightbulbCircleTwoToneIcon from '@mui/icons-material/LightbulbCircleTwoTone';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';


import {
    GetServerSidePropsContext,
} from "next";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head'
import { blueGrey } from '@mui/material/colors'
import axios from 'axios';
import Image from 'next/image'
//import { useSession, signIn, signOut } from "next-auth/react"
import { Roboto } from 'next/font/google';
import { withSessionSsr, Options } from '../lib/with-session';

import GreetingOutput from "../components/output";
import GiftsOutput from "../components/gifts";
import AvatarMenu from "../components/avatar-menu";
import * as ga from '../lib/ga'
import Combo from "../components/combo-text";
import { isbot } from '../lib/isbot'
import PlayerToolbar from "../components/toolbar-player";

const ModeSwitch = styled.div`
  position:absolute;
  right:0px;
  top:20px;  
  z-index:100; 
  color:grey; 
  `;
interface BackgroundMode {
    colorDark: string;
    colorLight: string;
}
const Background = styled.div<BackgroundMode>`
  z-index:-100;
  //background2: ${({ colorDark, colorLight }) => `linear-gradient(to top, ${colorDark}, ${colorLight})`};
`;
interface WebShareProps {
    color: string;
}
const WebShare = styled.div<WebShareProps>`
  color:${props => props.color};
`;
const WBLogo = styled.div`
  margin-right:30px;
`;
const Starter = styled.div`
  display:flex;
  justify-content:flex-start;
  font-size:36px;
  align-items:center;
  `;
const StarterMessage = styled.div`
  font-size:14px;
  padding-left:10px;
  padding-right:10px;
  `;
const Logo = styled.div`
  position:relative;
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content: center;
  z-index:20;
`;
const LogoContainer = styled.div`
  margin-top:50px;
  z-index:-1;
  `;
const Copyright = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-wrap: wrap;
  margin-top:20px;
  color:grey;

  `;
const Sub = styled.div`
  margin:20px;
`;
const ClearButton = styled(IconButton)`
  width: auto;
 `;
const ActionContainer = styled.div`
  display: flex;
  justify-content:flex-end;
  width: 100%;
`;
const ClearText = styled.span`
  font-size: 12px;
`;

interface ColorProps {
    color: string;
}
const AppMenu = styled.div<ColorProps>`
  display:flex;
  color:${({ color }) => color};
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const BandContainer = styled.div<{ darkText?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 5rem;
  text-align: center;
  color: ${({ darkText }) => (darkText ? '#fff' : '#2d2b38')};
  background-color: ${({ darkText }) => (darkText ? '#2d2b38' : '#fff')};
`;

const Title = styled(Typography)`
  margin-bottom: 1rem;
`;

const Subtitle = styled(Typography)`
  margin-bottom: 2rem;
`;

const CTAButton = styled(Button)`
  margin-top: 2rem;
`;

const FirstBandContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  text-align: center;
  background: url('wide-candles.jpg') ; /* Replace with your image URL */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('wide-candles.jpg'); /* Replace with your image URL */
 
  color: #fff;
  min-height: 380px;
  background-repeat: repeat;

  background-size: 900px 491px;
  font-size:5rem;
  
`;
const SecondBandContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  text-align: center;
  background: url('wide-candles.jpg') ; /* Replace with your image URL */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('wide-christmas-candles.jpg'); /* Replace with your image URL */
 
  color: #fff;
  min-height: 380px;
  background-repeat: repeat;

  background-size: 900px 491px;
  font-size:4rem;
  
`;


const ImageDemo = styled.div`
margin-top:20px;
`;




const Body = styled.div`
  width:100%;
    `;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
export default function Home({ dark, fresh, fbclid, utm_content, isbot, isfb, sessionid }:
    { dark: number, fresh: boolean, fbclid: string, utm_content: string, isbot: number, isfb: number, sessionid: string }) {

    const [darkMode, setDarkMode] = React.useState(true);
    const [systemMode, setSystemMode] = React.useState(false);
    const router = useRouter();
    const handleCTAClick = () => {
        router.push(`/`);
    };

    let theme: any;
    if (darkMode) {
        theme = createTheme({
            palette: {
                mode: 'dark',
                background: {
                    default: '#2d2b38',//' blueGrey[900],
                    paper: blueGrey[600],
                }
            },
        })
    }
    else {
        theme = createTheme({
            palette: {
                mode: 'light',
            },
        })
    }
    useEffect(() => {
        if (dark) {
            setDarkMode(true);
        }
    }, [dark]);
    const modeMe = (e: any) => {
        setDarkMode(!!(e.matches));
        setSystemMode(!!(e.matches));
    };

    React.useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

        if (matchMedia.matches != darkMode) {
            setSystemMode(matchMedia.matches);
            document.body.setAttribute("data-theme", matchMedia.matches ? 'dark' : 'light');
            setDarkMode(!!(matchMedia.matches));
        }
        // setDarkMode(matchMedia.matches);
        matchMedia.addEventListener("change", modeMe);

        return () => matchMedia.removeEventListener("change", modeMe);
    }, [darkMode]);


    return (
        <>
            <Head>
                <title>Wish Text Composer</title>
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@wishtext" />
                <meta name="twitter:title" content="Wish Text Composer" />
                <meta name="twitter:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost."/>
                <meta name="twitter:image" content="https://ucarecdn.com/d2cf70ef-7ffd-40d7-9e25-31e66927086e/wishtextad2.png" />
                <meta name="title" content="Wish Text Composer" />
                <meta property="og:title" content="Wish Text Composer" />
                <meta property="og:image" content="https://ucarecdn.com/d2cf70ef-7ffd-40d7-9e25-31e66927086e/wishtextad2.png" />
                <meta name="description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
                <meta property="og:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
                <link rel="icon" href={systemMode ? "/wbLogo.png" : "/bwLogo.png"} sizes="64x63" type="image/png" />
                <meta name="theme-color" content={theme.palette.background.default} />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />

            </Head>
            <ThemeProvider theme={theme}>
                <main className={roboto.className} >

                    <div>

                        <CssBaseline />
                        <AppBar position="absolute" component="nav">
                            <Toolbar>

                                <WBLogo><Image src="/wbLogo-grey.png" width={32} height={31} alt="Wish Text Composer Logo" /></WBLogo>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                                >
                                    WISH TEXT COMPOSER
                                </Typography>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}
                                >
                                    WISH TEXT
                                </Typography>


                            </Toolbar>
                        </AppBar>

                        <Toolbar />

                    </div>
                    <div >
                        <Script src={`https://www.googletagmanager.com/gtag/js?${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
                        <Script id="google-analytics">
                            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
                        </Script>
                    </div>
                    <Body>
                        <FirstBandContainer>
                            WISH IT? TEXT IT!
                        </FirstBandContainer>
                        <BandContainer darkText>
                            <Title variant="h3">
                                Generate Personalized Messages And Gift Recommendations For Any Occasion
                            </Title>
                            <Subtitle variant="h5">
                                With the assistance of the award winning AI. Optimized for social media and messengers: emoticons!<br /> Best of all: It&apos;s free!
                            </Subtitle>
                            <CTAButton variant="contained" color="primary" onClick={handleCTAClick}>
                                Get Started
                            </CTAButton>

                        </BandContainer>
                        <SecondBandContainer>
                            <Title variant="h3">
                                Messages To Celebrate,<br />
                                To Comfort, To Encourage.
                            </Title>
                            <Subtitle variant="h5">
                                Start by just choosing or free-typing the occasion. <br /> Explore what is possible with advanced customization options.
                            </Subtitle>

                            <CTAButton variant="contained" color="primary" onClick={handleCTAClick}>
                                Start Creating Now!
                            </CTAButton>
                        </SecondBandContainer>

                        <BandContainer>
                            <Title variant="h3">
                                Upload your images and create greeting cards
                            </Title>
                            <Subtitle variant="h5">
                                Download on your device and use in social networks and messengers with the direct upload.
                                <ImageDemo>
                                    <Image src="/demo-card1.png" width={1380 / 3} height={777 / 3} alt="Wish Text Composer Logo" />
                                </ImageDemo>
                                <ImageDemo>
                                    <Image src="/demo-card2.png" width={1380 / 3} height={777 / 3} alt="Wish Text Composer Logo" />
                                </ImageDemo>
                                <ImageDemo>
                                    <Image src="/demo-card3.png" width={1380 / 3} height={777 / 3} alt="Wish Text Composer Logo" />
                                </ImageDemo>

                            </Subtitle>
                            <CTAButton variant="contained" color="primary" onClick={handleCTAClick}>
                               Let us show you how!
                            </CTAButton>
                        </BandContainer>
                    </Body>
                    <Copyright> <Sub> <Typography variant="caption" gutterBottom>
                        Copyright: Wish-Text.Com
                    </Typography></Sub>
                        <Sub><Typography variant="caption" gutterBottom>
                            Contact: support@hudsonwilde.com
                        </Typography></Sub><Sub><Typography variant="caption" gutterBottom>
                            Made in Northern Minnesota, USA.
                        </Typography></Sub></Copyright>
                </main>

            </ThemeProvider>
        </>
    )
}
export const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            let { fbclid, utm_content, dark }:
                { fbclid: string, utm_content: string, dark: number } = context.query as any;

            utm_content = utm_content || '';

            fbclid = fbclid || '';
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });

            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            let sessionid = context.req.session?.sessionid || randomstring();
            const fresh = !context.req.session.sessionid;
            if (!botInfo.bot && fresh) {
                console.log('ssr-landing-init');
                setTimeout(async () => await recordEvent(sessionid, 'ssr-landing-init', `{"fbclid":"${fbclid}",ua:"${ua}","utm_content":"${utm_content}"}`), 100);

            }
            if (botInfo.bot && fresh)
                setTimeout(async () => await recordEvent(sessionid, 'ssr-bot-landing-init', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`), 100);
            if (fresh || context.req.session.sessionid != sessionid) {
                context.req.session.sessionid = sessionid;
                setTimeout(async () =>
                    await context.req.session.save(), 1);
            }
            return {
                props: {
                    sessionid,
                    fresh,
                    fbclid,
                    utm_content,
                    isbot: botInfo.bot,
                    isfb: botInfo.fb || fbclid ? 1 : 0,
                    dark: dark || 0
                }
            }
        } catch (x) {
            console.log("FETCH SSR PROPS ERROR", x);
            context.res.statusCode = 503;
            return {
                props: { error: 503 }
            }
        }
    })
