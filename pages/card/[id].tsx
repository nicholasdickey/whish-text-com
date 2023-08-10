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
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
import { useState, useCallback, useEffect } from "react"
import { useRouter } from 'next/router'
import { getSharedCard, fetchSession, recordEvent, updateSession, deleteSessionHistories, getSessionHistory } from '../../lib/api'
import styled from 'styled-components';
import Script from 'next/script'
import ReactMarkdown from "react-markdown";
import CardData from "../../lib/card-data";
import ImageData from "../../lib/image-data";

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
import { withSessionSsr, Options } from '../../lib/with-session';
import { isbot } from '../../lib/isbot';
import Band from '../../components/band';
import Card from '../../components/greeting-card/ui';

const ModeSwitch = styled.div`
  position:absolute;
  right:200px;
  top:20px;  
  z-index:100; 
 // color:white; 
 
  @media (max-width: 700px) {
    top:0px;
    right:0px;
    font-size:3rem;;
    min-height: 120px;
  }
  `;
interface BackgroundMode {
    colorDark: string;
    colorLight: string;
}
interface WebShareProps {
    color: string;
}

const WBLogo = styled.div`
  margin-right:30px;
`;

const Copyright = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-wrap: wrap;

  color:grey;

  `;
const Sub = styled.div`
  margin:20px;
`;


interface FooterProps {
    darkmode: string;
};
const Footer = styled.div<FooterProps>`
    padding:10px 10rem;
    width:100%;
    color:rgb(44, 46, 56);
    background-color: ${({ darkmode }) => darkmode == "true" ? '#252330' : 'rgb(232, 236, 239)'};
    @media (max-width:990px){
        padding:10px;
    }
    `;
const LineContainer = styled.div<FooterProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding:8px;  
    text-align: center;
    color:#2d2b38;
    background-color: ${({ darkmode }) => darkmode == "true" ? '#999' : 'rgb(232, 236, 239)'};
  `;

const BandContainer = styled.div<{ darktext?: string, background?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ darktext }) => (darktext == "true" ? '#fff' : '#2d2b38')};
  background-color: ${({ darktext }) => (darktext == "true" ? '#2d2b38' : '#fff')};
  background-image: ${({ background }) => background ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})` : null}; 
  background-repeat: repeat;
  background-size: 900px 491px;
  min-height:450px;

`;

const Title = styled(Typography)`
  margin-bottom: 1rem;
  @media (max-width: 900px) {
    font-size:2rem;
  }
`;

const Subtitle = styled(Typography)`
  margin-bottom: 2rem;
  text-overflow: wrap;
  padding:10px;
  @media (max-width: 700px) {
    font-size:1rem;;
  }
  
`;

const CTAButton = styled(Button)`
  margin-top: 2rem;
`;

const FirstBandContainer = styled.h1`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  padding: 5rem 0;
  text-align: center;
  background: url('wide-candles.jpg') ; /* Replace with your image URL */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/wide-candles.jpg'); /* Replace with your image URL */
  font-weight:500;
  color: #fff;
  min-height: 380px;
  background-repeat: repeat;

  background-size: 900px 491px;
  font-size:5rem;
  font-size:4rem;
  @media (max-width: 700px) {
    font-size:3rem;
  }
  
`;
const SecondBandContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  background: url('wide-candles.jpg') ; /* Replace with your image URL */
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('wide-christmas-candles.jpg'); /* Replace with your image URL */
 
  color: #fff;
  min-height: 380px;
  background-repeat: repeat;

  background-size: 900px 491px;
  font-size:4rem;
  @media (max-width: 700px) {
    font-size:3rem;
  }
  
`;
const Wide = styled.div`
   position:relative;
   width:100%; 
`;

const ImageDemo = styled.div`
//max-width: 100%;
//padding:60px;
position:relative;
width:${1380 / 3}px;
height:${777 / 3}px;
  
//height:fit-content;
@media (max-width: 700px) {
    width:${1380 / 5}px;
    height:${777 / 5}px;
  }
margin-top:40px;
`;


const Body = styled.div`
  width:100%;
  height:100%;
  min-height:100vh;
  padding-top:10vh;
`;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
export default function Home({ id, card, dark, fresh, fbclid, utm_content, isbot, isfb, sessionid,ironsession:startSession }:
    { id: string, card: CardData, dark: number, fresh: boolean, fbclid: string, utm_content: string, isbot: number, isfb: number, sessionid: string,ironsession:Options }) {

    const [session, setSession] = useState(startSession);
    const [systemMode, setSystemMode] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState(startSession.mode);
    const [modeIsSet, setModeIsSet] = React.useState(startSession.modeIsSet);
    const router = useRouter();
    const handleCTAClick = () => {
        router.push(`/?fbclid=${fbclid}&utm_content=${utm_content}`);
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
    
    const updateSession2 = useCallback(async (updSession: object) => {
        if (!updSession)
          return;
        let curSession: any;
        setSession((session) => { curSession = session; return { ...Object.assign(session, updSession) } });
        setTimeout(async () => {
          const s = (): any => curSession;
          const ses = s();
          console.log('===>pdate session:', updSession, "exist session", ses, curSession, session);
    
          await axios.post(`/api/session/save`, { session: ses });
        }, 200);
    
      }, [session]);
      useEffect(() => {
        if (dark && !modeIsSet) {
          setDarkMode(true);
          setModeIsSet(true)
          updateSession2({ mode: true, modeIsSet: true, blah: 'pblah' });
          // setSystemMode(true);
        }
      }, [modeIsSet, dark, session?.mode]);  
      const modeMe = (e: any) => {
        //if(!modeIsSet){
        setDarkMode(!!(e.matches));
        updateSession2({ mode: e.matches, blah: 'bleh', modeIsSet: false });
        setSystemMode(!!(e.matches));
        // }
      };
  
      React.useEffect(() => {
        const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
        setSystemMode(!!(matchMedia.matches));
        if (matchMedia.matches != darkMode) {
          //const assigned = { ...Object.assign(session ? session : {}, { mode: matchMedia.matches }) }
          //  setSystemMode(matchMedia.matches);
          document.body.setAttribute("data-theme", matchMedia.matches ? 'dark' : 'light');
          if (!modeIsSet) {
            setDarkMode(!!(matchMedia.matches));
            updateSession2({ mode: matchMedia.matches, blah: 'blah' });
          }
        }
        // setDarkMode(matchMedia.matches);
        matchMedia.addEventListener("change", modeMe);
    
        return () => matchMedia.removeEventListener("change", modeMe);
      }, [systemMode, darkMode, session?.mode, modeIsSet]);
    const { signature, greeting, image } = card;

    return (
        <>
            <Head>
                <title>Wish Text</title>
                <meta name="name" content="Wish Text" />
                <meta name="slogan" content="Greetings Text" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@wishtext" />
                <meta name="twitter:title" content="Wish Text Composer" />
                <meta name="twitter:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost."/>
                <meta name="twitter:image" content="/demo-card5-small.png" />
                <meta name="title" content="Wish Text Composer" />
                <meta property="og:title" content="Wish Text Composer" />
                <meta property="og:image" content="/demo-card5-small.png" />
                <meta name="description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
                <meta property="og:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
                <link rel="icon" href={systemMode ? "/wbLogo.png" : "/bwLogo.png"} sizes="64x63" type="image/png" />
                <meta name="theme-color" content={theme.palette.background.default} />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

                <meta name="viewport" content="width=device-width" />
                <link rel="canonical" href="https://www.wish-text.com/landing" />

            </Head>
            <ThemeProvider theme={theme}>
                <main className={roboto.className} >

                    <div>

                        <CssBaseline />


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
                       <Wide>
                        <ModeSwitch>
                            <Button color={"inherit"} onClick={() => {
                                setDarkMode(!darkMode);
                                setModeIsSet(true);
                                updateSession2({ mode: !darkMode, modeIsSet: true });
                            }}>
                                {darkMode ? <LightModeTwoToneIcon /> : <ModeNightTwoToneIcon />}
                            </Button>
                        </ModeSwitch>
                        </Wide>
                        <Card delayOpen={true} large={true} signature={signature} fbclid={fbclid} utm_content={utm_content} dark={darkMode ? "true" : "false"} text={greeting || ''} image={image} />
                    </Body>
                    <Footer darkmode={"false"}>
                        <Copyright>


                        </Copyright>
                        <Copyright> <Sub> <Typography variant="caption" gutterBottom>
                            Copyright 2023 Wish-Text.Com, All Rights Reserved
                        </Typography></Sub>
                            <Sub><Typography variant="caption" gutterBottom>
                                Contact: support@hudsonwilde.com
                            </Typography></Sub>
                            <Sub><Typography variant="caption" gutterBottom>
                                Crafted in Northern Minnesota, USA.
                            </Typography></Sub>
                        </Copyright>
                    </Footer>
                </main>

            </ThemeProvider>
        </>
    )
}
export const getServerSideProps = withSessionSsr(
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
        try {
            let { fbclid, utm_content, dark }:
                { fbclid: string, utm_content: string, dark: boolean } = context.query as any;

            let id: string = (context.params?.id || '') as string;
            utm_content = utm_content || '';
            dark = dark || false;
            fbclid = fbclid || '';
            console.log("!!!!!!!!!!!!!!!!!!!!!!")
            const emptyImage: ImageData = {
                url: '',
                publicId: '',
                height: 0,
                width: 0,
                thumbnailUrl: '',
                original_filename: ''
            };
            const ua = context.req.headers['user-agent'];
            const botInfo = isbot({ ua });

            var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            let sessionid = context.req.session?.sessionid || randomstring();
            const data = await getSharedCard(sessionid, id);
            let card: CardData = { signature: '', greeting: '', image: emptyImage };
            if (data?.success) {
                card = data.card;
            }

            const fresh = !context.req.session.sessionid;
            if (!botInfo.bot && fresh) {
                console.log('ssr-landing-init');
                try {
                    recordEvent(sessionid, 'ssr-card-init', `{id:"${id}","fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-landing-init-error', x);
                }
            }

            if (botInfo.bot && fresh) {
                try {
                    await recordEvent(sessionid, 'ssr-bot-card-init', `{{id:"${id}","fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
                } catch (x) {
                    console.log('ssr-bot-landing-init-error', x);
                }
            }

            if (fresh || context.req.session.sessionid != sessionid) {
                context.req.session.sessionid = sessionid;
                await context.req.session.save();
            }
            let ironsession:Options=await fetchSession(sessionid);
            ironsession = ironsession || {
                sessionid,
                noExplain: false,
               
              } as Options;
            console.log('session',ironsession);  
            return {
                props: {
                    sessionid,
                    fresh,
                    fbclid,
                    utm_content,
                    isbot: botInfo.bot,
                    isfb: botInfo.fb || fbclid ? 1 : 0,
                    dark: dark || 0,
                    id,
                    card,
                    ironsession
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
