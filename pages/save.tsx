import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSession, signIn, signOut } from "next-auth/react"
import { withSessionSsr, Options } from '../lib/with-session';
import { getWishText,saveToHistory } from "../lib/api";
import ImageData  from "../lib/image-data";
import {
    GetServerSidePropsContext,
  } from "next";
import { fetchSession } from '../lib/api'  
import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton,
} from 'react-social-login-buttons';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ResponsiveButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ResponsiveButton = styled.div`
  width: 100%;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

export default function Home({ from: startFrom, to: startTo, occasion: startOccasion, reflections: startReflections, instructions: startInstructions, inastyleof: startInastyleof, language: startLanguage, interests: startInterests, ironsession: startSession }: { from: string, to: string, occasion: string, reflections: string, instructions: string, inastyleof: string, language: string, interests: string, ironsession: Options }) {
    const selectedImage=session.s
    const { data: session } = useSession()
    useEffect(() => {
        let image='';
        if(selectedImage.url){
          image = await convertDivToPng(canvasRef.current);
        }
        await saveToHistory(authSession.username,greeting,occasion,to,image,gift);
    
    }, [session])
    if (session) {
        return (
          <>
            Signed in as {session?.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )
      }
  return (
    <Container>
      <ResponsiveButtonContainer>
        <ResponsiveButton>
          <FacebookLoginButton onClick={() => signIn()}/>
        </ResponsiveButton>
        <ResponsiveButton>
          <GoogleLoginButton />
        </ResponsiveButton>
        <ResponsiveButton>
          <TwitterLoginButton />
        </ResponsiveButton>
      </ResponsiveButtonContainer>
    </Container>
  );
};



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