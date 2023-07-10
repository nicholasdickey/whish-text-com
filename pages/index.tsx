import * as React from 'react';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import { fetchSession } from '../lib/api'
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Clear';
import { RWebShare } from "react-web-share";
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import Script from 'next/script'
import Tooltip from '@mui/material/Tooltip';
import {
  GetServerSidePropsContext,
} from "next";

import Head from 'next/head'
import axios from "axios";
import Image from 'next/image'
import { useSession, signIn, signOut } from "next-auth/react"

//import GlobalStyle from '../components/globalstyles'
//import { ThemeProvider } from 'styled-components'
//import { palette } from '../lib/palette';
import { Roboto } from 'next/font/google';
import { withSessionSsr, Options } from '../lib/with-session';

import GreetingOutput from "../components/output";
import GiftsOutput from "../components/gifts";
import AvatarMenu from "../components/avatar-menu";
import { useTheme } from '@mui/material/styles';
import * as ga from '../lib/ga'
const Copyright =styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-wrap: wrap;
  margin-top:20px;
  color:grey;

  `;
const Sub=styled.div`
  margin:20px;
`;  
const ClearButton = styled(IconButton)`

margin-top:20px;
 // display: flex;
  width: auto;
 
 // flex-direction: column;
  //align-items: center;
 
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


export default function Home({ from: startFrom, to: startTo, occasion: startOccasion, reflections: startReflections, instructions: startInstructions, inastyleof: startInastyleof, language: startLanguage, interests: startInterests, ironsession: startSession }: { from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language: string, interests: string, ironsession: Options }) {
  console.log("CLIENT START SESSION", startSession)
  const [session, setSession] = useState(startSession);
  //const [theme, setTheme] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")
  const [noExplain, setNoExplain] = useState(session.noExplain || false);
  const [occasion, setOccasion] = useState(startOccasion);
  const [reflections, setReflections] = useState(startReflections);
  const [instructions, setInstructions] = useState(startInstructions);
  const [inastyleof, setInastyleof] = useState(startInastyleof);
  const [language, setLanguage] = useState(startLanguage);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [from, setFrom] = useState(startFrom);
  const [to, setTo] = useState(startTo);
  const [interests, setInterests] = useState(startInterests);
  const [loadReady, setLoadReady] = useState(true);
  const { data: authSession } = useSession();
  const router = useRouter();
  const theme = useTheme();
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [missingOccasion, setMissingOccasion] = useState(false);
  const drawerWidth = 240;
  const navItems = ['Home', 'History', 'Share', 'Contact', 'Login'];

  const handleAccordeonChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleNoExplanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoExplain(event.target.checked);
    updateSession2({ noExplain: event.target.checked });
    ga.event({
      action: "setNoExplain",
      params : {
        sessionid: session.sessionid
      }
    })
  }

  // copilot fix the type to match the onClick signature

  const handleMenuClick = (item: string) => {
    console.log('handleMenuClick', item);
    if (item == 'Login') {
      signIn();
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

  const container = undefined;// window !== undefined ? () => window.document.body : undefined;
  //saves the changes to the session on the local web server. 
  const updateSession2 = useCallback(async (updSession: object) => {
    console.log('===>pdate session:', updSession);
    if (!updSession)
      return;
    const assigned = { ...Object.assign(session, updSession) }
    // console.log('===>pdate session:', assigned);
    setSession(assigned);
    await axios.post(`/api/session/save`, { session: assigned });
  }, [session]);
  const updateRoute = useCallback(({ to, from, occasion, reflections, instructions, inastyleof, language, interests }: { to: string, from: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language: string, interests: string }) => {
    const params = `/?occasion=${encodeURIComponent(occasion)}${reflections ? `&reflections=${encodeURIComponent(reflections)}` : ``}${instructions ? `&instructions=${encodeURIComponent(instructions)}` : ``}${inastyleof ? `&inastyleof=${encodeURIComponent(inastyleof)}` : ``}${language ? `&language=${encodeURIComponent(language)}` : ``}${to ? `&to=${encodeURIComponent(to)}` : ``}${from ? `&from=${encodeURIComponent(from)}` : ``}${interests ? `&interests=${encodeURIComponent(interests)}` : ``}`;
    router.push(params, params, { shallow: true })
  }, [router]);
  //const ur=useCallback(updateRoute, [router])

  useEffect(() => {
    updateRoute({ to, from, occasion, reflections, instructions, inastyleof, language, interests });
  }, [to, from, occasion, reflections, instructions, inastyleof, language, interests]);
  const onOccasionChange = (event: any) => {
    const value = event.target.value;
    // console.log('set occasion:', value);
   /* ga.event({
      action: "occasionChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    }) */
    setMissingOccasion(false);
    updateRoute({
      from,
      to,
      occasion: value,
      reflections,
      instructions,
      inastyleof,
      language,
      interests,
    })
    setOccasion(value);
    updateSession2({ occasion: value });
  }
  const onReflectionsChange = (event: any) => {
    const value = event.target.value;
    //  console.log('set reflections:', value);
   /* ga.event({
      action: "reflectionsChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    })*/
    updateRoute({
      from,
      to,
      occasion,
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
    // console.log('set instructions:', value);
   /* ga.event({
      action: "instructionsChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    })*/
    updateRoute({
      from,
      to,
      occasion,
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
    // console.log('set inastyleof:', value);
    /*ga.event({
      action: "inastyleofChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    })*/
    updateRoute({
      from,
      to,
      occasion,
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
    //  console.log('set language:', value);
   /* ga.event({
      action: "languageChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    })*/
    updateRoute({
      from,
      to,
      occasion,
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
    // console.log(value);
   /* ga.event({
      action: "fromChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    }) */
    updateRoute({
      from: value,
      to,
      occasion,
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
    //  console.log(value);
   /* ga.event({
      action: "toChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    }) */
    updateRoute({
      from,
      to: value,
      occasion,
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
    //  console.log(value);
   /* ga.event({
      action: "interestsChange",
      params : {
        sessionid: session.sessionid,
        occasion: value
      }
    }) */
    updateRoute({
      from,
      to,
      occasion,
      reflections,
      instructions,
      inastyleof,
      language,
      interests: value,

    })
    setInterests(value);
    updateSession2({ interests: value });
  }
  //const container = window !== undefined ? () => window().document.body : undefined;


  // console.log("occasion", occasion);


  // <meta name="theme-color" content={theme == 'dark' ? palette.dark.colors.background : palette.light.colors.background} />

  return (
    <>
      <Head>
        <title>Wish Text Composer</title>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@wishtext" />
        <meta name="twitter:title" content="Wish Text Composer"/>
        <meta name="twitter:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost."/>
        <meta name="twitter:image" content="https://ucarecdn.com/d2cf70ef-7ffd-40d7-9e25-31e66927086e/wishtextad2.png"/>
        <meta name="title" content="Wish Text Composer" />
        <meta property="og:title" content="Wish Text Composer" />
        <meta property="og:image" content="https://ucarecdn.com/d2cf70ef-7ffd-40d7-9e25-31e66927086e/wishtextad2.png" />
        <meta name="description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
        <meta property="og:description" content="Are you tired of struggling to find the right words and perfect gifts for various occasions? Look no further! With WISH-TEXT.COM, our free AI-powered Assistant is here to make your life easier.
Whether it's birthdays, graduations, holidays, or moments of illness or loss, WISH-TEXT.COM provides personalized messages and thoughtful gift recommendations, all at absolutely no cost." />
       
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/w-t-logo.png" />

      </Head>
      <main className={roboto.className} >


        <Container maxWidth="sm">

          <CssBaseline />
          <AppBar position="fixed" component="nav">
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
                WISH TEXT COMPOSER
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
                        params : {
                          sessionid: session.sessionid,
                          
                        }
                      })}
                    
                    }
                  >
                    <Button> <IosShareOutlinedIcon /></Button>
                  </RWebShare>


                </AppMenu>
              </Box>
              {false && authSession && <Box key="login" >
                <IconButton
                  // onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  // aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                >
                  <AvatarMenu authSession={authSession as any} />
                </IconButton>

              </Box>}
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
          <Box sx={{ my: 2, padding: 1, width: 1, color: noExplain ? 'normal' : 'white', backgroundColor: noExplain ? 'normal' : 'secondary' }}>
            {!noExplain ? <Typography
              variant="body2"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
            >
              <p>Create the &quot;wishing&quot; or greeting text for you to paste into your favorite messaging app.
                AI will provide the helpful suggestions that you can edit by clicking on the suggestion.</p>

              Additionally, Wish Text can generate a &apos;postcard&apos; greeting over an uploaded image. You can download the card and share from any device.
              <p>Utilizing AI, it also provides the gift suggestions.</p>

            </Typography> : null}


            <FormControlLabel
              label="Do not show the description"
              control={
                <Checkbox
                  sx={{ color: 'white' }}
                  checked={noExplain}
                  // indeterminate={checked[0] !== checked[1]}
                  onChange={handleNoExplanChange}
                />
              }
            />

          </Box>
          <ClearButtonContainer><ClearButton onClick={() => {
           /* ga.event({
              action: "clearAll",
              params : {
                sessionid: session.sessionid,
             
              }
            })*/
            updateRoute({
              from: '',
              to: '',
              occasion: '',
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
            setReflections('');
            setInstructions('');
            setInastyleof('');
            setLanguage('');
            setInterests('');

          }}>
            <ClearIcon />
            <ClearText>Clear all</ClearText>
          </ClearButton></ClearButtonContainer>
          <Box sx={{ mb: 4, mt: 3, background: theme.palette.background.default }}>
            <TextField
              sx={{
                width: { xs: 1, background: theme.palette.background.default },

              }}
              error={missingOccasion}
              id="occasion"
              label="Occasion"
              value={occasion}
              onChange={onOccasionChange}
              helperText="Required for a meaningful result. For example: &ldquo;8th Birthday&rdquo;, &ldquo;Sweet Sixteen&rdquo;, &ldquo;Illness&rdquo; &ldquo;Death in the family&rdquo;, &ldquo;Christmas&rdquo;, &ldquo;Graduation&ldquo;"
            />
          </Box>
          <Accordion sx={{ background: theme.palette.background.default }} expanded={expanded === 'custom'} onChange={handleAccordeonChange('custom')}>
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
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="to"
                  label="To (Recepient)"
                  value={to}
                  onChange={onToChange}
                  helperText="Examples: &ldquo;Our nephew Billy&rdquo;, &ldquo;My Grandson Evan&rdquo;, &ldquo;My Love&rdquo; &ldquo;Love of My Life&rdquo;, &ldquo;Simpsons&rdquo;, &ldquo;Mr Williams, the postman.&ldquo;"
                />
              </Box>

              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="from"
                  label="From"
                  value={from}
                  onChange={onFromChange}
                  helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
                />
              </Box>

            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ background: theme.palette.background.default }} expanded={expanded === 'advanced'} onChange={handleAccordeonChange('advanced')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Advanced Inputs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="reflections"
                  label="Additional Reflections,Thoughts"
                  value={reflections}
                  onChange={onReflectionsChange}
                  helperText="Any thoughts that you have about what should be reflected in the greeting. For example: 'Always thinking og you', 'We miss you', 'We are so proud of you', 'We are so happy for you', 'We are so sorry for your loss', 'Say Hi to your family'"
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="instructions"
                  label="Instructions to AI"
                  value={instructions}
                  onChange={onInstructionsChange}
                  helperText="Example: 'Keep it very short', 'Do not wish cake', ' As a methodist prayer', 'As a Hebrew prayer', 'No special day'"
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="inastyleof"
                  label="Use AI to write in the style of"
                  value={inastyleof}
                  onChange={onInastyleofChange}
                  helperText="Example: 'Mark Twain'.'Dr Seuss', 'Shakespeare', 'King David', 'The Simpsons', 'The Bible'. You can upload an image of a character or a person to go with the styled greeting."
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="language"
                  label="Language"
                  value={language}
                  onChange={onLanguageChange}
                  helperText="Example: 'French', 'Ukrainian', 'Middle-English', 'Canadian'"
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          <GreetingOutput greeting={session.greeting || ''} setMissingOccasion={setMissingOccasion} setLoadReady={setLoadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections} instructions={instructions} inastyleof={inastyleof} language={language} authSession={authSession} />
          {session.greeting && <GiftsOutput loadReady={loadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections} interests={interests} onInterestsChange={onInterestsChange} />}
                 
                  <Copyright> <Sub> <Typography variant="caption"  gutterBottom>
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
      let { from, to, occasion, reflections, instructions, inastyleof, language, age, interests, sex }: { from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language: string, age: string, interests: string, sex: string } = context.query as any;
      from = from || '';
      to = to || '';
      occasion = occasion || '';
      age = age || '';
      interests = interests || '';
      sex = sex || '';
      reflections = reflections || '';
      instructions = instructions || '';
      inastyleof = inastyleof || '';
      language = language || '';
      var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      let sessionid = context.req.session?.sessionid || randomstring();
      //  console.log("SSR sessionid:", sessionid, context.req.session)
      let startoptions: Options = await fetchSession(sessionid);

      console.log("SSR startoptions:", startoptions);
      startoptions = startoptions || {
        sessionid,
        dark: -1,
        noExplain: false,
        imagesString: '',
        selectedImage: '',
      };
      //  console.log("startoptions:", startoptions);
      /* if (!startoptions) {
         console.log("SSR init startoptions")
         startoptions = {
           sessionid,
           dark: -1,
           noExplain: false,
           imagesString: '',
           selectedImage: '',
         }*/
      if (context.req.session.sessionid != sessionid) {
        context.req.session.sessionid = sessionid;
        await context.req.session.save();
      }
      //}
      let options: Options = startoptions;
      //  console.log("SSR:", options.giftSuggestions)

      from = from || options.from || '';
      to = to || options.to || '';
      occasion = occasion || options.occasion || '';
      reflections = reflections || options.reflections || '';
      instructions = instructions || options.instructions || '';
      inastyleof = inastyleof || options.inastyleof || '';
      language = language || options.language || '';
      interests = interests || options.interests || '';
      return {
        props: {
          from: from,
          to: to,
          occasion: occasion,
          reflections: reflections,
          instructions: instructions,
          inastyleof: inastyleof,
          language: language,
          age: age,
          interests: interests,
          sex: sex,
          ironsession: options,
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

/*
export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js v5-beta with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
*/
/*
         {navItems.map((item) => {
                    if (item == 'Login' && authSession) {
                      return;
                    }
                    if(item=='History'||item=='Share'||item=='Contact'){
                      return <Button key={item} sx={{ color: '#888' }} onClick={() => handleMenuClick(item)}>
                      {item}
                      </Button>
                    }
                    else {
                      return <Button key={item} sx={{ color: '#fff' }} onClick={() => handleMenuClick(item)}>
                        {item}
                      </Button>
                    }
                  }
                  )
                  }*/