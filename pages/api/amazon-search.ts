//@ts-ignore-next 
import cheerio from "whacko"
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next"

function truncateString(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }
  
const amazonSearch=async (
    req: NextApiRequest,
    res: NextApiResponse) => {

    let search:string = req.query.search as string;
    const url=`https://www.amazon.com/s?k=${search.replaceAll(' ','+')}&ref=nb_sb_noss_2`;
  
    const response =  await axios.get(url,{
      headers:{
      'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0'
    }});
    const $ = cheerio.load(response.data);
    const results = $('.s-result-item');
    interface Item {
        title: string;
        price: string;
        image: string;
        link: string;
    }
    let items = new Array<Item>();
    results.each((i:any, el:any) => {
        const title = truncateString( $(el).find('h2').text(),96);
        const price = $(el).find('.a-price-symbol').first().text()+$(el).find('.a-price-whole').first().text()+$(el).find('.a-price-fraction').first().text();
        const image = $(el).find('img').attr('src');
        const link = `https://amazon.com`+$(el).find('a').attr('href')+'&tag=qwiket-20';
        items.push({ title, price, image, link });
    });
    // remove items over 3
   
    items=items.filter(i=>i.title && i.price && i.image && i.link);
    items=items.slice(0,3);
    return res.status(200).json({ items })
}
export default amazonSearch;