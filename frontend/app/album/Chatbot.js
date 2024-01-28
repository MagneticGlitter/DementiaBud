import { useState, useEffect } from "react";
import {botInit, botUpdate} from "./voiceflowController";
import useSpeechRecognition from "./speech";

const Chatbot = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [bgInfo, setBgInfo] = useState("I have a family of 4");     // TODO: setBgInfo from using a fetch
  const [intent, setIntent] = useState(0);
  const [labels, setLabels] = useState([["label1", "https://www.google.ca"], ["label2", "https://www.baidu.com"], ["label3", "https://www.bing.ca"], ["label4", "https://www.google.com/search?sca_esv=d17c57237620b038&sxsrf=ACQVn0_Tn0ANt1R-D2BjqE0SdypvYxGshA:1706366538132&q=funny+pics&tbm=isch&source=lnms&sa=X&ved=2ahUKEwivnvLa5v2DAxVAnWoFHa6dB3AQ0pQJegQIDBAB&biw=1488&bih=708&dpr=1.25"]])  // TODO: setLabels from using a fetch
  const {
      text,
      startListening,
      } = useSpeechRecognition();

  const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
      // Trigger the click event on the submit button
      document.getElementById('submitButton').click();
  }};

  let count = 1

  useEffect(() => {
      // Initialize the interaction when the component mounts
      if (count) {
        initChatbot()
      } 
      count--;
  }, []);

  const initChatbot = async () => {
    // fetch for botInit

    const mssg1 = await botInit();
    const mssg2 = await botUpdate(bgInfo)
  
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { type: "bot", text: mssg1 },
      { type: "bot", text: mssg2 }
    ]);
    

    // TODO: setLabels()
  };
  
  
  const handleSendMessage = async () => {
      if (inputValue.trim() !== ""){
          setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            { type: "user", text: inputValue },
          ]) 
          handleInteract(inputValue)
          setInputValue("");
      }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }


  const detectIntent = (indicator) => {
    
    if (indicator === "*"){
      setIntent(1)
      console.log("=============")
    }
    if (indicator === "$") {
      setIntent(2)
    }
  };


  const handleInteract = async (input) => {
    try {
      setIntent(0)
      // Send user input and get the bot's response
      const list = await botUpdate(input);
      if (list.length > 1) {
        const modified = list[1].replace('2', labels[0][0])
        setChatMessages((prevChatMessages) => [
          ...prevChatMessages,
          { type: "bot", text: list[0].slice(0,-1) },
          { type: "bot", text: modified.slice(0,-1) },
          { type: "bot", text: list[2].slice(0,-1) }
        ]);
      } else {
        setChatMessages((prevChatMessages) => [
          ...prevChatMessages,
          { type: "bot", text: list[0].slice(0,-1) }
        ]);
      }
      

      const last_msg = list[list.length - 1];
      const indicator = last_msg.charAt(last_msg.length - 1);
      detectIntent(indicator)
    } catch (error) {
      console.error("Error updating interaction:", error);
    }
  }

  const emptyButtons = () => {
    setIntent(0)
    botUpdate("yes")
  }

  return (
    <>
<div className="relative h-full w-full flex flex-col">
  {/* Conversation messages */}
  <div className="flex flex-col items-start space-y-2 overflow-y-auto flex-grow max-h-[400px]">
    {chatMessages.map((message, index) => (
      <div
        key={index}
        className={`flex items-start ${message.type === "user" ? "bg-[#FFB6C1] self-end" : "bg-[#F08080]"} p-2 rounded-lg max-h-[900px]`}
      >
        <p
          className={`${
            message.type === "bot" ? "text-white" : "text-white"
          } overflow-hidden break-words max-w-full`}
        >
          {message.text}
        </p>
      </div>
    ))}
    {intent === 1 && 
      <a href={labels[0][1]} onClick={emptyButtons} target="_blank" className="text-xs rounded-full border border-blue-700 text-blue-700 p-1">
        {labels[0][0]}
      </a>
    
    }
    {intent === 2 && 
      (<>
        <a href={labels[1][1]} onClick={emptyButtons} target="_blank" className="text-xs rounded-full border border-blue-700 text-blue-700 p-1">
          {labels[1][0]}
        </a>
        <a href={labels[2][1]} onClick={emptyButtons} target="_blank" className="text-xs rounded-full border border-blue-700 text-blue-700 p-1">
          {labels[2][0]}
        </a>
        <a href={labels[3][1]} onClick={emptyButtons} target="_blank" className="text-xs rounded-full border border-blue-700 text-blue-700 p-1">
          {labels[3][0]}
        </a>
      </>)
    }
  </div>

  {/* Input bar and submit button */}
  <div className="absolute bottom-0 left-0 w-full">
    <div className="flex">
      <div className="flex-1">
        <input
          type="text"
          value={inputValue || text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="border text-black border-gray-300 p-2 rounded-l-lg focus:outline-none w-full"
          placeholder="Type your message..."
        />
      </div>
      <button
        id="submitButton"
        type="button"
        onClick={handleSendMessage}
        className="bg-[#F08080] text-white p-2 rounded-r-lg ml-2"
      >
        Submit
      </button>
    </div>
  </div>
</div>

    </>

  );
}

export default Chatbot;


                              
                  