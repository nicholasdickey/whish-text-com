import React, { useState, useEffect, useCallback } from "react";
import { styled } from "styled-components";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { getGiftsText } from "../lib/api";
import { recordEvent } from '../lib/api'
import AmazonIdeaSearch from "./amazon-idea-search";
import { Options } from "../lib/with-session";
import ToobarGifts from "./toolbar-gifts";
import Typography from '@mui/material/Typography';
import * as ga from '../lib/ga';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const InnerGifts = styled.div`
  font-size: 14px;
  margin-right: 20px;
  margin-top: 10px;
  width: 100%;
  min-height: 140px;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 20px;
  width: 100%;
`;

const OuterWrap = styled.div`
margin-top: 20px;
`;

const GiftSuggesstionHeader = styled.div`
  text-align: center;
  margin-bottom: 10px;
  margin-top: 50px;
`;

const BottomLink = styled.div`
  padding: 10px;
  z-index: 100;
`;

const GeneratingPlaceholder = styled.div`
  font-size: 14px;
  max-width: 400px;
  margin: 80px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const PlaceholderOuterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function splitStringByNumberedSentences(input: string): string[] {
  const regex = /^\d+\.(.*)$/gm;
  const matches = input.match(regex);

  if (!matches) {
    return [];
  }

  return matches.map((match) => match.trim());
}

function extractDoubleQuotedPart(input: string): string {
  const regex = /"([^"]*)"/;
  const match = input.match(regex);

  if (match && match.length >= 2) {
    return match[1];
  }

  return "";
}

interface GiftSuggestion {
  text: string;
  search: string;
}

const processGiftSuggestions = (valueGiftSuggestions: string) => {
  const giftSuggestionsParts = splitStringByNumberedSentences(valueGiftSuggestions);

  return giftSuggestionsParts.map((giftSuggestion, index) => {
    giftSuggestion = giftSuggestion.replaceAll("Amazon search:", "");
    return { text: giftSuggestion, search: extractDoubleQuotedPart(giftSuggestion) };
  });
}

export default function Output({
  loadReady,
  session,
  updateSession2,
  from,
  to,
  occasion,
  reflections,
  interests,
  onInterestsChange
}: {
  loadReady: boolean;
  session: Options;
  updateSession2: any;
  from: string;
  to: string;
  occasion: string;
  reflections: string;
  interests: string;
  onInterestsChange: any;
}) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [oldOccasion, setOldOccasion] = useState(occasion);
  const [giftSuggestions, setGiftSuggestions] = useState<GiftSuggestion[]>(session.giftSuggestions ? processGiftSuggestions(session.giftSuggestions) : []);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getGiftsText({ sessionid: session.sessionid, from, to, occasion, reflections, interests, fresh: value ? true : false });
    setLoading(false);
    if (result != value) {
      const valueGiftSuggestions = result;
    
      setGiftSuggestions(processGiftSuggestions(valueGiftSuggestions));
      setValue(result);
      setTimeout(async ()=>await updateSession2({ giftSuggestions: valueGiftSuggestions }),10);
    }
    ga.event({
      action: "giftSuggestions",
      params: {
        sessionid: session.sessionid,
        result: result,
      }
    });
  }, [from, to, occasion, reflections, interests, value, updateSession2, session.sessionid]);
  useEffect(() => {
    if(oldOccasion&&occasion!=oldOccasion){
      setOldOccasion(occasion);
      load();
    }
  }, [load, oldOccasion, occasion]);
  useEffect(() => {
    if (!session.giftSuggestions&&loadReady && !value) {
      load();
    }
    else
    if (session.giftSuggestions && !value) {
      setValue(session.giftSuggestions);
      setGiftSuggestions(processGiftSuggestions(session.giftSuggestions));
    }
  }, [load, from, to, occasion, reflections, interests, loadReady, value, session.giftSuggestions]);

  const output = !loading && value ? (
    <>
      <GiftSuggesstionHeader>
        <h1>Gift Suggestions:</h1>
      </GiftSuggesstionHeader>
      <div>
        {giftSuggestions.map((suggest: GiftSuggestion, i: number) => (
          <AmazonIdeaSearch
            key={`amazon-idea-search-${i}`}
            session={session}
            search={suggest.search}
            text={suggest.text}
          />
        ))}
      </div>
    </>
  ) : null;

  return (
    <OuterWrap>
      <hr/>
      <Typography>
        {loading ? (
          <PlaceholderOuterContainer>
            <GeneratingPlaceholder>Generating gift suggestions...</GeneratingPlaceholder>
          </PlaceholderOuterContainer>
        ) : output ? (
          <InnerGifts>{output}</InnerGifts>
        ) : null}
      </Typography>

      {value ? (
        <FormContainer>
          <Box sx={{ my: 4 }}>
            <TextField
              sx={{
                width: { xs: 1 },
              }}
              id="to"
              label="Additional Gift Considerations"
              defaultValue={interests}
              onChange={onInterestsChange}
              helperText="For example: &ldquo;a middle-aged woman, likes square dancing, horse riding, sparkling wine.&rdquo;, &ldquo;a 16 year-old girl who likes music.&rdquo; &ldquo;Christian familiy man, loves fishing and hunting.&rdquo; &ldquo;Not Star Trek&rdquo;"
            />
          </Box>
          <ToobarGifts
            onRegenerateClick={async () => {
              if (loading) return;
              await load();
              setTimeout(async ()=>await recordEvent(session.sessionid, 'regenerateGifts',interests),1000);
            }}
          />
        </FormContainer>
      ) : null}
      
    </OuterWrap>
  );
}
