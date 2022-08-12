import { withAuthenticator } from "@aws-amplify/ui-react"
import { useState, useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { Storage } from "@aws-amplify/storage";
import { Button,Icon,TopNavigation,ColumnLayout,Container,TextContent } from "@awsui/components-react";

function SignIn()
{
    let navigate = useNavigate();
    let files = [];
    let thumbnails = [];
    const [images,setImages] = useState(null);
    const [listItems,setListItems] = useState({});
      useEffect(() => {
        fetchImages();
      },[]);
      async function signOut() {
        try {
            await Auth.signOut();
            navigate("/");
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }
    async function fetchImages(){
      let response = await Storage.list('',{maxKeys:50,level:"private",});
      setListItems(response);
      let listItemImages = await Promise.all(response.results.map(async k => {
      const signedURL = await Storage.get(k.key,{level:"private"});
      return signedURL;
     }));
       setImages(listItemImages);
      } 
      async function nextPages()
      {
        let listItemImages ;
        if(listItems.isTruncated === true) {
         listItems.nextPage().then(data => { 
          setListItems(data);
          listItemImages =  data})
          let imageContent = listItemImages.contents;
          let nextImages = await Promise.all(imageContent.map(async k => {
          const signedURL = await Storage.get(k.key,{level:"private",maxKeys:10});
          return signedURL;
         }));
        setImages(nextImages);
        }else{
          console.log("no next elements");
        }
      }
    async function onChange(e){
     
        for(let i = 0;i< e.target.files.length;i++)
        {
          files.push(e.target.files[i]);
        }
        console.log("Files after change",files);  
        for(let j = 0;j< files.length;j++){
          const reader = new FileReader();
          reader.addEventListener("load",function(event){
            
          })
          reader.readAsDataURL(files[j]);
          thumbnails.push(reader);
          console.log("thumbnails data",thumbnails); 
        }
      }
      
    async function uploadImage()
    {
      try { 
        for(let j = 0;j< files.length;j++){
        const result = await Storage.put(files[j].name, files[j],{level:"private"}); 
        console.log("result ",result);
        console.log("Files after uploading",files);
        }
        files = [];
        thumbnails = [];
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
       fetchImages();
    }
        return(
        <div>
          <TopNavigation
        identity={{
          title: "Welcome to Admin Mode", 
        }}
        utilities={[
          {
          href: "/",
          title: "Welcome to Admin Mode", 
          },
          {
            type: "button",
            text: "Guest Mode",
            iconName: "user-profile",
            href: "/"
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
        <TextContent>&nbsp;<strong><h1>&nbsp;&nbsp;You can upload your images here!! To Disable Admin Mode Click on  <Button variant = "primary" type = "button" onClick={signOut}>Sign Out</Button></h1></strong></TextContent>
     <br></br>&nbsp;&nbsp;&nbsp;&nbsp;<input type = "file" onChange = {onChange} multiple="multiple" />
        <Button variant = "primary" type = "upload" onClick = {uploadImage}>
        <Icon name="upload" /> Upload</Button>
        <p></p><br></br>
          <p></p>
        <ColumnLayout columns={6}>
          {images && images.map(image => (
            <div key = {image} >
              &nbsp;&nbsp;&nbsp;<Container style={{alignContent:"center"}}>
              <img  style ={{ height : 190, width:190 }} src = {image} alt = "from storage"/>
              <br></br>
              </Container>
            </div>
          ))}
          </ColumnLayout>
          <p></p>
          {images && <div>
          <p style = {{textAlign: "center"}}><Button variant="primary" onClick = {nextPages} >Next <Icon name="angle-right" /></Button></p>
           </div>}
      </div>)
}
export default withAuthenticator(SignIn);
