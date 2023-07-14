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
import { fetchSession,recordEvent } from '../lib/api'
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Clear';
import { RWebShare } from "react-web-share";
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import Script from 'next/script'
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import LooksThreeOutlinedIcon from '@mui/icons-material/Looks3Outlined';
import LooksFourOutlinedIcon from '@mui/icons-material/Looks4Outlined';
import {
  GetServerSidePropsContext,
} from "next";

import Head from 'next/head'
import axios from "axios";
import Image from 'next/image'
//import { useSession, signIn, signOut } from "next-auth/react"
import { Roboto } from 'next/font/google';
import { withSessionSsr, Options } from '../lib/with-session';

import GreetingOutput from "../components/output";
import GiftsOutput from "../components/gifts";
import AvatarMenu from "../components/avatar-menu";
import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga'
import Combo from "../components/combo-text";
import { light } from '@mui/material/styles/createPalette';
import { isbot } from '../lib/isbot'
import useDarkMode from '../hooks/mode';

const WBLogo=styled.div`
  margin-right:30px;
`;
const Starter = styled.div`
  display:flex;
  justify-content:flex-start;
  font-size:64px;
  align-items:center;
  `;
const StarterMessage = styled.div`
  font-size:24px;
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
`;
const LogoContainer = styled.div`
  //position:absolute;
  //top:0px;
  //right:0px;
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

//margin-top:20px;
  width: auto;
 `;
const ClearButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
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

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v=false;
export default function Home({ utm_medium,isbot,isfb,virgin: startVirgin, virgin2:startVirgin2,naive: startNaive, from: startFrom, to: startTo, occasion: startOccasion, reflections: startReflections, instructions: startInstructions, inastyleof: startInastyleof, language: startLanguage, interests: startInterests, ironsession: startSession }: { utm_medium:string,isbot:boolean,isfb:boolean,virgin: boolean, virgin2:boolean,naive: boolean, from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language: string, interests: string, ironsession: Options }) {
  console.log("CLIENT START SESSION", startSession)
  const [session, setSession] = useState(startSession);
  const [noExplain, setNoExplain] = useState(session.noExplain || false);
  const [occasion, setOccasion] = useState(startOccasion);
  const [virgin, setVirgin] = useState(startVirgin);
  const [virgin2, setVirgin2] = useState(startVirgin2);
  const [naive, setNaive] = useState(startNaive);
  const [reflections, setReflections] = useState(startReflections);
  const [instructions, setInstructions] = useState(startInstructions);
  const [inastyleof, setInastyleof] = useState(startInastyleof);
  const [language, setLanguage] = useState(startLanguage);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [from, setFrom] = useState(startFrom);
  const [to, setTo] = useState(startTo);
  const [interests, setInterests] = useState(startInterests);
  const [loadReady, setLoadReady] = useState(true);
  const [virginEvent,setVirginEvent] = useState(false);
  //const { data: authSession } = useSession();
  const router = useRouter();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [missingOccasion, setMissingOccasion] = useState(false);
  const drawerWidth = 240;
  const navItems = ['Home', 'History', 'Share', 'Contact', 'Login'];
  //const [mode,setMode]=  React.useState('dark');
  const mode=useDarkMode();
 
  if(!virgin&&!virginEvent&&!v&&!isbot){
    v=true; 
    setVirginEvent(true);   
    setTimeout(async ()=>await recordEvent(session.sessionid, 'virgin load',isfb?'facebook:'+utm_medium:utm_medium?utm_medium:''),1000);
  }
  const handleAccordeonChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      ga.event({
        action: "accordion",
        params: {
          sessionid: session.sessionid
        }
      })
    };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleNoExplanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoExplain(event.target.checked);
    updateSession2({ noExplain: event.target.checked });
    ga.event({
      action: "setNoExplain",
      params: {
        sessionid: session.sessionid
      }
    })
  }

  const handleMenuClick = (item: string) => {
    console.log('handleMenuClick', item);
    if (item == 'Login') {
     // signIn();
    }
    else
      router.push(`/${item.toLowerCase()}`);

  }
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        WISH TEXT GENERATOR
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleMenuClick(item)}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = undefined;
  //saves the changes to the session on the local web server. 
  const updateSession2 = useCallback(async (updSession: object) => {
    console.log('===>pdate session:', updSession);
    if (!updSession)
      return;
    const assigned = { ...Object.assign(session, updSession) }

    setSession(assigned);
    await axios.post(`/api/session/save`, { session: assigned });
  }, [session]);
  const updateRoute = useCallback(({ to, from, occasion, naive, reflections, instructions, inastyleof, language, interests }: { to: string, from: string, occasion: string, naive: boolean, reflections: string, instructions: string, inastyleof: string, language: string, interests: string }) => {
    const params = `/${occasion ? '?occasion=' : ''}${occasion ? encodeURIComponent(occasion) : ''}${naive ? `${occasion ? '&' : '?'}naive=${naive}` : ''}${reflections ? `${occasion ? '&' : '?'}reflections=${encodeURIComponent(reflections)}` : ``}${instructions ? `${occasion ? '&' : '?'}instructions=${encodeURIComponent(instructions)}` : ``}${inastyleof ? `${occasion ? '&' : '?'}inastyleof=${encodeURIComponent(inastyleof)}` : ``}${language ? `${occasion ? '&' : '?'}language=${encodeURIComponent(language)}` : ``}${to ? `${occasion ? '&' : '?'}to=${encodeURIComponent(to)}` : ``}${from ? `${occasion ? '&' : '?'}from=${encodeURIComponent(from)}` : ``}${interests ? `${occasion ? '&' : '?'}interests=${encodeURIComponent(interests)}` : ``}`;
    router.push(params, params, { shallow: true })

  }, [router]);

  useEffect(() => {
    updateRoute({ to, from, occasion, naive, reflections, instructions, inastyleof, language, interests });
  }, [to, from, occasion, naive, reflections, instructions, inastyleof, language, interests]);
  useEffect(() => {
    if (!virgin)
      ga.event({
        action: "virgin",
        params: {
          sessionid: session.sessionid,
        }
      })
  }, [session.sessionid, virgin]);
  const onOccasionChange = (id: string, value: string) => {
    setMissingOccasion(false);
    updateRoute({
      from,
      to,
      occasion: value,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,
    })
    setOccasion(value);
    updateSession2({ occasion: value });
  }

  const onNaiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = !event.target.checked;
    updateRoute({
      from,
      to,
      occasion,
      naive: value,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,
    })
    setNaive(value);
    updateSession2({ naive: value });
  }
  const onReflectionsChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections: value,
      instructions,
      inastyleof,
      language,
      interests,
    })
    setReflections(value);
    updateSession2({ reflections: value });
  }
  const onInstructionsChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions: value,
      inastyleof,
      language,
      interests,
    })
    setInstructions(value);
    updateSession2({ instructions: value });
  }
  const onInastyleofChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof: value,
      language,
      interests,
    })
    setInastyleof(value);
    updateSession2({ inastyleof: value });
  }
  const onLanguageChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language: value,
      interests,
    })
    setLanguage(value);
    updateSession2({ language: value });
  }
  const onFromChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from: value,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,

    })
    setFrom(value);
    updateSession2({ from: value });
  }
  const onToChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to: value,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,

    })
    setTo(value);
    updateSession2({ to: value });
  }
  const onInterestsChange = (event: any) => {
    const value = event.target.value;
    updateRoute({
      from,
      to,
      occasion,
      naive,
      reflections,
      instructions,
      inastyleof,
      language,
      interests: value,

    })
    setInterests(value);
    updateSession2({ interests: value });
  }
  console.log("virgin", virgin,virgin2);
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

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={mode?"/wbLogo.png":"/bwLogo.png"} sizes="64x63" type="image/png" />

      </Head>
      <main className={roboto.className} >

        <Container maxWidth="sm">

          <CssBaseline />
          <AppBar position="absolute" component="nav">
            <Toolbar>
              {false ? <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton> : null}
              <WBLogo><Image src="/wbLogo-grey.png" width={32} height={31} alt="Wish Text Composer Logo"/></WBLogo>
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
                sx={{ flexGrow: 1,  display: { xs: 'block', sm: 'none' } }}
              >
                WISH TEXT
              </Typography>
              <Box sx={{ display: { xs: 'block', sm: 'block' } }}>
                <AppMenu color={theme.palette.text.primary}>
                  <RWebShare
                    data={{
                      text: session.greeting || '',
                      url: `/?occasion=${encodeURIComponent(session.occasion || '')}${session.reflections ? `&reflections=${encodeURIComponent(session.reflections)}` : ``}${session.instructions ? `&instructions=${encodeURIComponent(session.instructions)}` : ``}${session.inastyleof ? `&inastyleof=${encodeURIComponent(session.inastyleof)}` : ``}${session.language ? `&language=${encodeURIComponent(session.language)}` : ``}${session.to ? `&to=${encodeURIComponent(session.to)}` : ``}${session.from ? `&from=${encodeURIComponent(session.from)}` : ``}${session.interests ? `&interests=${encodeURIComponent(session.interests)}` : ``}`,
                      title: 'Wish-Text.Com -  Wish Text Composer',
                    }}
                    onClick={() => {
                      console.log("shared successfully!");
                      ga.event({
                        action: "share",
                        params: {
                          sessionid: session.sessionid,
                        }
                      })
                      setTimeout(async ()=>await recordEvent(session.sessionid, 'share',isfb?'facebook:'+utm_medium:utm_medium?utm_medium:''),1000);

                    }}
                  >
                    <Button> <IosShareOutlinedIcon /></Button>
                  </RWebShare>

                </AppMenu>
              </Box>
            
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Toolbar />
          <Logo><LogoContainer><Image

            width={668/4}
            height={868/4}
            alt="Wish Text Composer"
            src={'/wish-text-candle-light.png'} />
          </LogoContainer></Logo>
          {!virgin ? <Box sx={{ my: 0, padding: 1, width: 1, color: noExplain ? 'normal' : 'white', backgroundColor: noExplain ? 'normal' : 'secondary' }}>

            {false&&!noExplain ? <Typography
              variant="body2"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
            >
              <p>Create the &quot;wishing&quot; or greeting text for you to paste into your favorite messaging app.
                AI will provide the helpful suggestions that you can edit by clicking on the suggestion.</p>

              Additionally, Wish Text Composer can generate a &apos;postcard&apos; greeting over an uploaded image. You can download the card and share from any device.
              <p>Utilizing AI, it also provides the gift suggestions.</p>
            </Typography> : null}

            {false ? <FormControlLabel
              label="Do not show the description"
              control={
                <Checkbox
                  sx={{ color: 'white' }}
                  checked={noExplain}
                  onChange={handleNoExplanChange}
                />
              }
            /> : null}
          </Box> : null}

          {virgin ? <ClearButtonContainer><ClearButton onClick={() => {
            updateRoute({
              from: '',
              to: '',
              occasion: '',
              naive: false,
              reflections: '',
              instructions: '',
              inastyleof: '',
              language: '',
              interests: '',

            })
            updateSession2({
              from: '',
              to: '',
              occasion: '',
              virgin: false,
              naive: false,
              reflections: '',
              instructions: '',
              inastyleof: '',
              language: '',
              interests: '',
              greeting: '',
              giftSuggestions: '',
              imagesString: '',
              selectedImage: '',

            });
            setFrom('');
            setTo('');
            setOccasion('');
            setVirgin(false);
            setVirgin2(false);
            setNaive(false);
            setReflections('');
            setInstructions('');
            setInastyleof('');
            setLanguage('');
            setInterests('');

          }}>
            <ClearIcon />
            <ClearText>Reset</ClearText>
          </ClearButton></ClearButtonContainer> : null}
          {!virgin ? <Box sx={{ mt: 5, width: 1,  }}>
            <Starter><LooksOneOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography color="secondary"/*color="#ffee58"*/>To begin, select or type an occasion for the greeting, for example &ldquo;Birthday&ldquo;:</Typography></StarterMessage></Starter></Box> : null}
          <Combo id="occasion"
            label="Occasion"
            value={occasion}
            error={missingOccasion}
            onChange={onOccasionChange}
            helperText="Required for a meaningful result. For example: &ldquo;8th Birthday&rdquo;, &ldquo;Sweet Sixteen&rdquo;, &ldquo;Illness&rdquo; &ldquo;Death in the family&rdquo;, &ldquo;Christmas&rdquo;, &ldquo;Graduation&ldquo;"
          />
          {session.greeting&&virgin&&!virgin2 ? <Box sx={{ mt: 10, width: 1 }}>
            <Starter><LooksThreeOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography color="secondary"/*color="#ffee58"*/>Experiment with inputs to make instructions to AI more specific:</Typography></StarterMessage></Starter></Box> : null}
        
         {virgin&&session.greeting ? <Accordion sx={{ background: theme.palette.background.default }} expanded={expanded === 'custom'} onChange={handleAccordeonChange('custom')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Customize</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{ width: { xs: 1 } }}
                  id="to"
                  label="To (Recepient)"
                  value={to}
                  onChange={onToChange}
                  helperText="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{ width: { xs: 1 } }}
                  id="from"
                  label="From"
                  value={from}
                  onChange={onFromChange}
                  helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
                />
              </Box>
            </AccordionDetails>
          </Accordion> : null}
         
          {virgin &&session.greeting? <Accordion sx={{ background: theme.palette.background.default }} expanded={expanded === 'advanced'} onChange={handleAccordeonChange('advanced')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Advanced Inputs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 4, color: 'primary' }}>
                <FormControlLabel
                  label={<Typography style={{ color: theme.palette.text.secondary }}>Keep it light-hearted, if possible</Typography>}
                  control={
                    <Checkbox
                      sx={{ color: 'secondary' }}
                      checked={!naive}
                      onChange={onNaiveChange}
                    />
                  }
                />
              </Box>
              <Box sx={{ mb: 4 }}>
                <TextField
                  sx={{ width: { xs: 1 } }}
                  id="reflections"
                  label="Additional Reflections,Thoughts"
                  value={reflections}
                  onChange={onReflectionsChange}
                  helperText="Any thoughts that you have about what should be reflected in the greeting. For example: 'Always thinking of you', 'We miss you', 'We are so proud of you', 'We are so happy for you', 'We are so sorry for your loss', 'Say Hi to your family'"
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{ width: { xs: 1 } }}
                  id="instructions"
                  label="Instructions to AI"
                  value={instructions}
                  onChange={onInstructionsChange}
                  helperText="Example: 'Keep it very short', 'Do not wish cake', ' As a methodist prayer', 'As a Hebrew prayer', 'No special day'"
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{ width: { xs: 1 } }}
                  id="inastyleof"
                  label="Use AI to write in the style of"
                  value={inastyleof}
                  onChange={onInastyleofChange}
                  helperText="Example: 'Mark Twain'.'Dr Seuss', 'Shakespeare', 'King David', 'The Simpsons', 'The Bible'. You can upload an image of a character or a person to go with the styled greeting."
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{ width: { xs: 1 } }}
                  id="language"
                  label="Language"
                  value={language}
                  onChange={onLanguageChange}
                  helperText="Example: 'French', 'Ukrainian', 'Middle-English', 'Canadian'"
                />
              </Box>
            </AccordionDetails>
          </Accordion> : null}
          {session.greeting&&virgin&&!virgin2 ? <Box sx={{ mt: 10, width: 1, color: 'white', backgroundColor: 'secondary' }}>
            <Starter><LooksFourOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography color="secondary"/*color="#ffee58"*/>Click or tap on  &quot;Suggest New Wish Text&quot; to regenerate the text. Upload images to create downloadable greeting cards.</Typography></StarterMessage></Starter></Box> : null}
        
          {!virgin&&occasion ? <Box sx={{ mt: 10, width: 1}}>
            <Starter><LooksTwoOutlinedIcon fontSize="inherit" color='success' />
              <StarterMessage><Typography color="secondary"/*color="#ffee58"*/>Click or tap on the &quot;Suggest Wish Text&quot; button:</Typography></StarterMessage></Starter></Box> : null}
          <GreetingOutput onVirgin={async () => { 
            await recordEvent(session.sessionid, 'virgin wish-text request',`occasion:${occasion}`);
            setVirgin(true); 
            updateSession2({ virgin: true }); 
            }} greeting={session.greeting || ''} onVirgin2={async () => { 
              await recordEvent(session.sessionid, 'virgin2 request',`occasion:${occasion}`);
              setVirgin2(true); 
              updateSession2({ virgin2: true }); 
              }} virgin={virgin} virgin2={virgin2} setMissingOccasion={setMissingOccasion} setLoadReady={setLoadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} naive={naive} reflections={reflections} instructions={instructions} inastyleof={inastyleof} language={language} /*authSession={authSession}*/ />
           
          {session.greeting && <GiftsOutput loadReady={loadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections} interests={interests} onInterestsChange={onInterestsChange} />}

          <Copyright> <Sub> <Typography variant="caption" gutterBottom>
            Copyright: Wish-Text.Com
          </Typography></Sub>
            <Sub><Typography variant="caption" gutterBottom>
              Contact: support@hudsonwilde.com
            </Typography></Sub></Copyright>
        </Container>
        <div className="container">
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
      </main>
    </>
  )
}
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      let {fbclid,utm_medium, utm_campaign,utm_content, virgin, virgin2,from, to, occasion, naive, reflections, instructions, inastyleof, language, age, interests, sex }: { fbclid:string,utm_medium:string,utm_campaign:string,utm_content:string,virgin: boolean, virgin2:boolean,from: string, to: string, occasion: string, naive: boolean, reflections: string, instructions: string, inastyleof: string, language: string, age: string, interests: string, sex: string } = context.query as any;
      from = from || '';
      to = to || '';
      occasion = occasion || '';
      age = age || '';
      interests = interests || '';
      sex = sex || '';
      virgin = virgin || false;
      virgin2 = virgin2 || false;
      naive = naive || false;
      reflections = reflections || '';
      instructions = instructions || '';
      inastyleof = inastyleof || '';
      language = language || '';
      utm_medium = utm_medium || '';
      utm_campaign = utm_campaign || '';
      utm_content = utm_content || '';
      fbclid=fbclid||'';
      console.log("naive1=",naive)
      var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      let sessionid = context.req.session?.sessionid || randomstring();
      let startoptions: Options = await fetchSession(sessionid);
      startoptions = startoptions || {
        sessionid,
        dark: -1,
        noExplain: false,
        imagesString: '',
        selectedImage: '',
      };
      console.log("naive2=",naive)
      const ua = context.req.headers['user-agent'];
      const botInfo = isbot({ ua });
      if(botInfo.bot)
        setTimeout(async ()=>await recordEvent(sessionid, 'bot',`{ua:${ua},utm_medium:${utm_medium},utm_campaign:${utm_campaign},utm_content:${utm_content}}`),100);
 
      if (context.req.session.sessionid != sessionid) {
        context.req.session.sessionid = sessionid;
        await context.req.session.save();
      }
      let options: Options = startoptions;

      from = from || options.from || '';
      to = to || options.to || '';
      occasion = occasion || options.occasion || '';
      virgin = options.virgin || false;
      virgin2 = options.virgin2 || false;
      naive = naive || options.naive||false;
      reflections = reflections || options.reflections || '';
      instructions = instructions || options.instructions || '';
      inastyleof = inastyleof || options.inastyleof || '';
      language = language || options.language || '';
      interests = interests || options.interests || '';
      console.log("naive3=",naive)
      return {
        props: {
          from: from,
          to: to,
          occasion: occasion,
          virgin: virgin,
          virgin2: virgin2,
          naive: naive,
          reflections: reflections,
          instructions: instructions,
          inastyleof: inastyleof,
          language: language,
          age: age,
          interests: interests,
          sex: sex,
          ironsession: options,
          isbot: botInfo.bot,
          isfb: botInfo.fb || utm_medium ? 1 : 0,
          utm_medium:`{fbclid:${fbclid},utm_medium:${utm_medium},utm_campaign:${utm_campaign},utm_content:${utm_content}}}}`,
        }
      }
    } catch (x) {
      console.log("FETCH STATIC PROPS ERROR", x);
      context.res.statusCode = 503;
      return {
        props: { error: 503 }
      }
    }
  })
/**
 * 
 * 
 *   {false && authSession && <Box key="login" >
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  aria-haspopup="true"
                >
                  <AvatarMenu authSession={authSession as any} />
                </IconButton>
              </Box>}
 */