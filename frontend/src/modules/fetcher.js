const fetcher = async (url,tries)=>{
  if(!tries){
    tries=3;
  }
  tries--;
  try{
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  catch(err){
    console.log("failed to fetch data", err);
    if(tries>0){
      return fetcher(url, tries);
    }
    return {};
  }
}
export default fetcher;
