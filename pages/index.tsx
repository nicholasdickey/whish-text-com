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
import { useState, useCallback } from "react"
import { useRouter } from 'next/router'
import { fetchSession } from '../lib/api'
import {
  GetServerSidePropsContext,
} from "next";

import Head from 'next/head'
import axios from "axios";
import Image from 'next/image'
import TextTest from '../components/text-test';


//import GlobalStyle from '../components/globalstyles'
//import { ThemeProvider } from 'styled-components'
//import { palette } from '../lib/palette';
import { Roboto } from 'next/font/google';
import { withSessionSsr, Options } from '../lib/with-session';

import GreetingOutput from "../components/output";
import GiftsOutput from "../components/gifts";


const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })


export default function Home({ from: startFrom, to: startTo, occasion: startOccasion, reflections: startReflections, instructions: startInstructions, inastyleof: startInastyleof, language: startLanguage,interests: startInterests, session: startSession }: { from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language:string,interests: string, session: Options }) {
  //console.log("CLIENT START SESSION", startSession)
  const [session, setSession] = useState(startSession);
  const [theme, setTheme] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")
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
  const [loadReady, setLoadReady] = useState(false);
  const router = useRouter();
  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerWidth = 240;
  const navItems = ['Home', 'History', 'About', 'Contact'];

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
            <ListItemButton sx={{ textAlign: 'center' }}>
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
   // console.log('===>pdate session:', updSession);
    const assigned = { ...Object.assign(session, updSession) }
   // console.log('===>pdate session:', assigned);
    setSession(assigned);
    await axios.post(`/api/session/save`, { session: assigned });
  }, [session]);

  const updateRoute = ({ to, from, occasion, reflections, instructions, inastyleof, language,interests }: { to: string, from: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language:string,interests: string }) => {
    const params = `/?occasion=${encodeURIComponent(occasion)}${reflections ? `&reflections=${encodeURIComponent(reflections)}` : ``}${instructions ? `&instructions=${encodeURIComponent(instructions)}` : ``}${inastyleof ? `&inastyleof=${encodeURIComponent(inastyleof)}` : ``}${language ? `&language=${encodeURIComponent(language)}` : ``}${to ? `&to=${encodeURIComponent(to)}` : ``}${from ? `&from=${encodeURIComponent(from)}` : ``}${interests ? `&interests=${encodeURIComponent(interests)}` : ``}`;
    router.push(params, params, { shallow: true })
  }
  const onOccasionChange = (event: any) => {
    const value = event.target.value;
   // console.log('set occasion:', value);
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
  }
  const onReflectionsChange = (event: any) => {
    const value = event.target.value;
  //  console.log('set reflections:', value);
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
  }
  const onInstructionsChange = (event: any) => {
    const value = event.target.value;
   // console.log('set instructions:', value);
    updateRoute({
      from,
      to,
      occasion,
      reflections,
      instructions:value,
      inastyleof,
      language,
      interests,
    })
    setInstructions(value);
  }
  const onInastyleofChange = (event: any) => {
    const value = event.target.value;
   // console.log('set inastyleof:', value);
    updateRoute({
      from,
      to,
      occasion,
      reflections,
      instructions,
      inastyleof:value,
      language,
      interests,
    })
    setInastyleof(value);
  }
  const onLanguageChange = (event: any) => {
    const value = event.target.value;
  //  console.log('set language:', value);
    updateRoute({
      from,
      to,
      occasion,
      reflections,
      instructions,
      inastyleof,
      language:value,
      interests,
    })
    setLanguage(value);
  }



  const onFromChange = (event: any) => {
    const value = event.target.value;
   // console.log(value);
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
  }
  const onToChange = (event: any) => {
    const value = event.target.value;
  //  console.log(value);
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
  }
  const onInterestsChange = (event: any) => {
    const value = event.target.value;
  //  console.log(value);
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
  }
  //const container = window !== undefined ? () => window().document.body : undefined;


 // console.log("occasion", occasion);
  

  // <meta name="theme-color" content={theme == 'dark' ? palette.dark.colors.background : palette.light.colors.background} />

  return (
    <>
      <Head>
        <title>Free Wish Text Generator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className={roboto.className} >


        <Container maxWidth="sm">

          <CssBaseline />
          <AppBar position="fixed" component="nav">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                WISH TEXT
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }}
              >
                WISH TEXT
              </Typography>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {navItems.map((item) => (
                  <Button key={item} sx={{ color: '#fff' }}>
                    {item}
                  </Button>
                ))}
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
          <Box sx={{ padding: 1, width: 1, color: 'white', backgroundColor: 'info.dark' }}>
            {!noExplain ? <Typography
              variant="body2"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
            >
              Create the greeting text for you to paste into your favorite messaging app. AI will provide the helpful suggestions. Additionally, Wish Text can generate a &apos;postcard&apos; greeting over an uploaded image. Utilizing AI, it also provides the gift suggestions. Last but not least, it helps you keep track of all your greetings and gifts to avoid embarrassing repetitions. And the best part, it is free!

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
          <Box sx={{ my: 4 }}>
            <TextField
              sx={{
                width: { xs: 1 },

              }}
              id="occasion"
              label="Occasion"
              defaultValue={occasion}
              onChange={onOccasionChange}
              helperText="Required for a meaningful result. For example: &ldquo;8th Birthday&rdquo;, &ldquo;Sweet Sixteen&rdquo;, &ldquo;Illness&rdquo; &ldquo;Death in the family&rdquo;, &ldquo;Christmas&rdquo;, &ldquo;Graduation&ldquo;"
            />
          </Box>

          <Box sx={{ my: 4 }}>
            <TextField
              sx={{
                width: { xs: 1 },

              }}
              id="to"
              label="To (Recepient)"
              defaultValue={to}
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
              defaultValue={from}
              onChange={onFromChange}
              helperText="Optional: who is the greeting from? For example - Grandma and Grandpa, Your Dad, etc."
            />
          </Box>


          <Accordion expanded={expanded === 'advanced'} onChange={handleAccordeonChange('advanced')}>
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
                  defaultValue={reflections}
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
                  defaultValue={instructions}
                  onChange={onInstructionsChange}
                  helperText="Example: 'Keep it very short','Do not wish cake'"
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="inastyleof"
                  label="Use AI to write in the style of"
                  defaultValue={inastyleof}
                  onChange={onInastyleofChange}
                  helperText="Example: 'Mark Twain'.'Dr Seuss', 'Shakespeare', 'The Simpsons', 'The Bible'. You can upload an image of a character or a person to go with the styled greeting."
                />
              </Box>
              <Box sx={{ my: 4 }}>
                <TextField
                  sx={{
                    width: { xs: 1 },

                  }}
                  id="language"
                  label="Language"
                  defaultValue={language}
                  onChange={onLanguageChange}
                  helperText="Example: 'French', 'Ukrainian'."
                />
              </Box>



            </AccordionDetails>
          </Accordion>
          <GreetingOutput setLoadReady={setLoadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections} instructions={instructions} inastyleof={inastyleof} language={language}/>
          <GiftsOutput loadReady={loadReady} session={session} updateSession2={updateSession2} from={from} to={to} occasion={occasion} reflections={reflections} interests={interests} onInterestsChange={onInterestsChange} />
        </Container>

      </main>
    </>
  )
}
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      let { from, to, occasion, reflections, instructions, inastyleof, language,age, interests, sex }: { from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string,language:string, age: string, interests: string, sex: string } = context.query as any;
      from = from || '';
      to = to || '';
      occasion = occasion || '';
      age = age || '';
      interests = interests || '';
      sex = sex || '';
      reflections = reflections || '';
      instructions = instructions || '';
      inastyleof = inastyleof || '';
      language=language||'';
      var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      let sessionid = context.req.session?.sessionid || randomstring();
    //  console.log("SSR sessionid:", sessionid, context.req.session)
      let startoptions: Options = await fetchSession(sessionid);

    //  console.log("SSR startoptions:", startoptions);
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
      return {
        props: {
          from: from,
          to: to,
          occasion: occasion,
          reflections: reflections,
          instructions: instructions,
          inastyleof: inastyleof,
          language:language,
          age: age,
          interests: interests,
          sex: sex,
          session: options,
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