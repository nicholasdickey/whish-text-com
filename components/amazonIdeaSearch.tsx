import React, { useState, FormEvent, useEffect } from "react";
import { styled } from "styled-components";
import { getAmazonSearch, Item } from "../lib/api";
import { Container, RichLink } from "./rich-link";
import useSWRImmutable from 'swr/immutable'

const Results = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    width:100%;
    margin-left:15px;
    margin-right:15px;
    `;
const Result = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    width:100%;
    margin-left:15px;
    margin-right:15px;
    max-height:200px;
    `;
const Text = styled.div`
  // width:400px;
    width: 400px;

  @media(min-width: 600px) {
    //font-size:34px;
    width:500px;
  }
  @media(min-width: 900px) {
    
    width:680px;
  }
  @media(min-width: 1200px) {
    width:800px;
  }
   // background-color:#262644;
    padding:40px;
    margin-left:auto;
    margin-right:auto;
    font-size:14px;
    border-radius:10px;
    margin-top:20px;
`
const AmazonIdeaSearch = ({ search, text }: { search: string, text: string }) => {
    let { data: amazonSearch, error }= useSWRImmutable({search},getAmazonSearch);
    return (
    <div>
        <Results><Text>{text}</Text>
            <Container>
                {amazonSearch?.map((s, i) => {
                    return <RichLink key={`rich-link-${s.title}`} imageUrl={s.image} title={s.title} price={s.price} link={s.link} />
                })}
            </Container>
        </Results>
        
    </div>
    );
}
export default AmazonIdeaSearch;