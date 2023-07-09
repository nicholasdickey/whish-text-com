import axios from 'axios';
import { Options } from './with-session';


export const getWishText = async ({ style, from, to, occasion, reflections,instructions,inastyleof,language,  fresh,sessionid }: { style: string, from: string, to: string, occasion: string, reflections: string, instructions:string,inastyleof:string,language:string,fresh?: boolean,sessionid?:string }) => {
    from = encodeURIComponent(from || '');
    to = encodeURIComponent(to || '');
    occasion = encodeURIComponent(occasion || '');
    reflections = encodeURIComponent(reflections || '');
    instructions = encodeURIComponent(instructions || '');
    inastyleof = encodeURIComponent(inastyleof || '');
    language = encodeURIComponent(language || '');
    sessionid=encodeURIComponent(sessionid || '');
    fresh = fresh || false;

    if (!from && !to && !occasion)
        return '';
    let url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/openai/wish-text?sessionid=${sessionid}&from=${from}&to=${to}&occasion=${occasion}&reflections=${reflections}&instructions=${instructions}&inastyleof=${inastyleof}&language=${language}${fresh ? '&fresh=1' : ''}`;
    console.log("url:", url);
    let recovery = '';
    while (true) {
        try {
            if (recovery && recovery.length > 0) {
                url = url + recovery;
            }
            const res = await axios.get(url);
            return res.data.result;
        } catch (x) {
            console.log("SLEEP", x);
            await new Promise(r => setTimeout(r, 1000));
            recovery = '&recovery=1';
        }
    }
}
export const getGiftsText = async ({ from, to, occasion, reflections, interests, fresh }:{from:string,to:string,occasion:string,reflections:string,interests:string,fresh?:boolean}) => {
    from = encodeURIComponent(from || '');
    to = encodeURIComponent(to || '');
    occasion = encodeURIComponent(occasion || '');
    reflections = encodeURIComponent(reflections || '');
    interests = encodeURIComponent(interests || '');
   
    fresh = fresh || false;
    if (!from && !to && !occasion && !interests)
        return '';
    let url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/openai/gifts-text?from=${from}&to=${to}&occasion=${occasion}&reflections=${reflections}&interests=${interests}${fresh ? '&fresh=1' : ''}`;
    console.log("url:", url);
    let recovery = '';
    while (true) {
        try {
            if (recovery && recovery.length > 0) {
                url = url + recovery;
            }
            const res = await axios.get(url);
            return res.data.result;
        } catch (x) {
            console.log("SLEEP", x);
            await new Promise(r => setTimeout(r, 1000));
            recovery = '&recovery=1';
        }
    }
}
export interface Item {
    title: string;
    price: string;
    image: string;
    link: string;
}
 export const getAmazonSearch = async ({ search }: { search: string }) => {
    if (!search) return [];
    const url = `/api/amazon-search?search=${encodeURIComponent(search)}`;
    console.log("url:", url);
    const res = await axios.get(url);
    return res.data.items as Item[];
}
/**
 * User Session
 */
export const updateUserSession = async (userslug: string, options: Options) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/updateSession?`
    const res = await axios.post(url, {
        userslug,
        options
    });
    return res.data.userSession;
}
export const getUserSession = async (userslug: string) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/user/fetchSession?`
    const res = await axios.post(url, {
        userslug
    });
    return res.data.userSession;
}
export const updateSession = async (sessionid: string, config: Options) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/updateSession?`
    console.log("updateSession", url,sessionid, config)
    const res = await axios.post(url, {
        sessionid,
        config
    });
    return res.data.success;
}
export const fetchSession = async (sessionid: string) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/session/fetchSession?sessionid=${sessionid} `
    const res = await axios.get(url);
    console.log("fetchSession", sessionid,res.data.session)
    return res.data.session;
}
export const saveToHistory = async (username: string, greeting: string,image:string,to:string,occasion:string,gift:string) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/upsert?username=${username}&greeting=${greeting}&image=${image}&to=${to}&occasion=${occasion}&gift=${gift}`; 
    const res = await axios.get(url);
    console.log("saveToHistory", username,res.data.success);
    return res.data.success;
}
export const deleteHistory = async (username: string,to:string,time:number) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/delete?username=${username}&to=${to}&time=${time}`; 
    const res = await axios.get(url);
    console.log("saveToHistory", username,res.data.success);
    return res.data.success;
}
export const getHistories = async (username: string, page:number,pagesize:number) => {
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/history/get?username=${username}&page=${page}&pagesize=${pagesize}`; 
    const res = await axios.get(url);
    console.log("getHistories", username,res.data.success);
    return res.data;
}
