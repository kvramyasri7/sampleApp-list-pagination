import * as React from "react";
import { useState } from "react";
import  {Storage}  from "@aws-amplify/storage";
import { Button,TopNavigation,ColumnLayout,Container,Icon,TextContent } from "@awsui/components-react";

function GuestMode()
{
  const [files, setFiles] = useState();
  const [endOfFiles, setEndOfFiles] = useState(false);
  const [stratOfFiles, setStartOfFiles] = useState(true);
  function fetchFirstPage(){
    callNextPage();
  }

  const [listItems,setListItems] = useState([]);

  const [tokens,setTokens] = useState([]);
  const [nextToken,setNextToken] = useState(undefined);
  const [hastoken,setHasToken] = useState(true);
  const [tokenState,setTokenState] = useState(false);


    async function callNextPage()
    {
      if(hastoken) {
        const data = await Storage.list('',{pageSize: 10, pageToken:nextToken});
        console.log(" Response ",data);
        setListItems(data);
        let listItemfiles =  data;
        let imageContent = listItemfiles;
        let nextImages = await Promise.all(imageContent.results.map(async k => {
        const signedURL = await Storage.get(k.key);
        return signedURL;
       }));
       setHasToken(listItemfiles.hasNextPage)
       setTokens([...tokens,data.nextPageToken])
       setNextToken(data.nextPageToken)
       setFiles(nextImages);
       if(!listItemfiles.hasNextPage)
       { setEndOfFiles(true); }
       setTokenState(true);
       if(nextToken)
       setStartOfFiles(false)
       if(tokens.length === 0)
       setStartOfFiles(true)
    }
  }

  async function callPreviousPage()
  {
    if(tokenState)
    {
      setTokenState(false);
      tokens.pop();
    }
    tokens.pop();
    if(listItems.hasNextPage) {
      const data = await Storage.list('',{ pageSize : 10, pageToken: tokens[tokens.length-1] });
      console.log("Data",data)
      setListItems(data);
      let listItemfiles =  data;
      let imageContent = listItemfiles;
      let nextImages = await Promise.all(imageContent.results.map(async k => {
      const signedURL = await Storage.get(k.key);
      return signedURL;
     }));
     setNextToken(data.nextPageToken);
     setFiles(nextImages);
    if(!listItemfiles.hasNextPage)
    { setEndOfFiles(true); }
    if(tokens.length === 0)
     setStartOfFiles(true)
     if(nextToken === undefined)
     setStartOfFiles(true);
  }
}
  async function callALLFiles()
    {
      if(hastoken) {
        const data = await Storage.list('',);
        setListItems(data);
        let listItemfiles =  data;
        let imageContent = listItemfiles;
        let nextImages = await Promise.all(imageContent.results.map(async k => {
        const signedURL = await Storage.get(k.key);
        return signedURL;
       }));
       setHasToken(listItemfiles.hasNextPage)
       setTokens([...tokens,data.nextPageToken])
       setNextToken(data.nextPageToken)
       setFiles(nextImages);
       if(!listItemfiles.hasNextPage)
       { setEndOfFiles(true); }
       setTokenState(true);
       if(nextToken)
       setStartOfFiles(false)
       if(tokens.length === 0)
       setStartOfFiles(true)
    }
  }
 
    
      return(  
      <div>
        <TopNavigation
      identity={{
        href: "/",
        title: "Welcome to Guest Mode", 
      }}
      utilities={[
        {
        href: "/",
        title: "Welcome to Guest Mode", 
        },
          {
            type: "button",
            iconName: "user-profile",
            text: "Admin Mode",
            href: "/signIn",
          }
      ]}
      i18nStrings={{
        searchIconAriaLabel: "Search",
        searchDismissIconAriaLabel: "Close search",
        overflowMenuTriggerText: "More",
        overflowMenuTitleText: "All",
        overflowMenuBackIconAriaLabel: "Back",
        overflowMenuDismissIconAriaLabel: "Close menu"
      }}
    />
        <TextContent>&nbsp;<strong><h1>&nbsp;&nbsp;&nbsp;&nbsp;To list ALL files in the storage click on <Button variant="primary" onClick={callALLFiles}>ALL Files</Button></h1></strong></TextContent>
        <TextContent>&nbsp;<strong><h1>&nbsp;&nbsp;&nbsp;&nbsp;To list files in the storage click on <Button variant="primary" onClick={fetchFirstPage}>View Files</Button></h1></strong></TextContent>
        &nbsp;
        <ColumnLayout columns={6}>
          {files && files.map(image => (
            <div key = {image} >
              <Container style={{alignContent:"center"}}>
              <img  style ={{ height : 180, width:180 ,}} src = {image} alt = "from storage"/>
              <br></br>
              </Container>
            </div>
          ))}
          </ColumnLayout>
          <p></p>
            {files &&
          <div style = {{textAlign: "center"}}>
          {!stratOfFiles && <span style = {{textAlign: "center"}}><Button variant="primary" onClick = {callPreviousPage} ><Icon name="angle-left" /> Previous </Button></span>}&nbsp;&nbsp;
          {!endOfFiles && <span style = {{textAlign: "center"}}><Button variant="primary" onClick = {callNextPage} >Next <Icon name="angle-right" /></Button></span>}
          </div> }
          {endOfFiles &&  stratOfFiles && <p style = {{textAlign: "center"}}>You do not have any files left in storage</p>}
          
      </div>);
}

export default GuestMode;
