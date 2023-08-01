import React, { useState, FormEvent, useEffect } from "react";
import { styled } from "styled-components";
import { getAmazonSearch, Item } from "../lib/api";
import { Container, RichLink } from "./rich-link";
import useSWRImmutable from 'swr/immutable';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Results = styled.div`
  // Add your custom styles for the Results component here
`;

const Title = styled(Paper)`
  padding: 20px;
  margin-bottom: 40px;
  margin-top: 40px;
`;

const Text = styled.div`
  width: 400px;

  @media (min-width: 600px) {
    width: 500px;
  }
  @media (min-width: 900px) {
    width: 680px;
  }
  @media (min-width: 1200px) {
    width: 800px;
  }
  
  padding: 40px;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  border-radius: 10px;
  margin-top: 20px;
`;

const AmazonIdeaSearch = ({ session, search, text }: { session: any, search: string; text: string }) => {

  // Fetch Amazon search results using SWR
  const { data: amazonSearch, error } = useSWRImmutable({ search }, getAmazonSearch);

  //console.log("AmazonIdeaSearch", search, text, amazonSearch);

  return (
    <Results>
      <Title elevation={2}><Typography>{text}</Typography></Title>
      
      <Grid container spacing={6}>
        {/* Iterate over each Amazon search result and render a RichLink component */}
        {amazonSearch?.map((s, i) => (
          <RichLink session={session} key={s.title+i} imageUrl={s.image} title={s.title} price={s.price} link={s.link} />
        ))}
      </Grid>
     
    </Results>
  );
};

export default AmazonIdeaSearch;
