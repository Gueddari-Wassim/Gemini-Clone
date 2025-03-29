import {createContext, useState}from "react";
import run from "../config/gemini";

export const Context=createContext();

const ContextProvider=(props)=>{


    const [input,setInput]=useState("");
    const [recentPrompt,setRecentPrompt]=useState("");
    const [prevPrompts,setPrevPrompts]=useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading,setLoading]=useState(false);
    const [ResultData,SetResultData]=useState("");


    const delayPara=(index,nextWord)=>{
        setTimeout(function(){
            SetResultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat=()=>{

        setLoading(false)
        setShowResult(false)
    }


    const onSent=async(prompt)=>{
        SetResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if (prompt!== undefined) {
            response= await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            const response =await run(input)
        }
  
        let responseArray=response.split("**")
        let newResponse="";
        for(let i=0;i<responseArray.length;i++)
        {
            if(i===0||i%2 !==1){
                newResponse+=responseArray[i];
            }
            else{
                newResponse+="<br>"+responseArray[i]+"<br>";
            }
        }
        let newResponse2=newResponse.split("*").join("<br>")
        let newResponseArray=newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++)
        {
            const nextWord=newResponseArray[i]
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }
    


    const contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        ResultData,
        input,
        setInput,
        newChat
    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider