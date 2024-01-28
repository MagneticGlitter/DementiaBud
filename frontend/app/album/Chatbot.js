import { useState, useEffect } from "react";
import {botInit, botUpdate} from "./voiceflowController";
import useSpeechRecognition from "./speech";

const Chatbot = (prop) => {
  const labelToEmoji = {
    "family": '🏠',
    "education": '📚',
    "romance": '❤️',
    "sports": '⚽',
    "accomplishment": '🏆',
  };
  
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [intent, setIntent] = useState(0);
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
    const summaryString = prop.data.map(element => element.summary).join(", ");
    console.log(summaryString)
    console.log("================================");
    const mssg1 = await botInit();
    const mssg2 = await botUpdate(summaryString)
    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      { type: "bot", text: mssg1 },
      { type: "bot", text: mssg2 }
    ]);
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
    }
    if (indicator === "$") {
      setIntent(2)
    }
  };

  let i = 0;
  const handleInteract = async (input) => {
    try {
      setIntent(0)
      // Send user input and get the bot's response
      const list = await botUpdate(input);
      if (list.length == 3) {
        const modified = list[1].replace('2', prop.data[i].summary)
        i++;
        setChatMessages((prevChatMessages) => [
          ...prevChatMessages,
          { type: "bot", text: list[0].slice(0,-1) },
          { type: "bot", text: modified.slice(0,-1) },
          { type: "bot", text: list[2].slice(0,-1) }
        ]);
      } else if (list.length == 2) {
        const modified = list[1].replace('2', prop.data[i].summary)
        i++;
        setChatMessages((prevChatMessages) => [
          ...prevChatMessages,
          { type: "bot", text: list[0].slice(0,-1) },
          { type: "bot", text: modified.slice(0,-1) }
        ]);
          
      } else if (list.length == 1) {
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

  const emptyButtons = async () => {
    handleInteract("yes")
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
    {intent === 1 && (
      <a href={prop.data[0].link} onClick={emptyButtons} target="_blank" className="text-xs rounded-full border border-blue-700 text-blue-700 p-1">
        {labelToEmoji[prop.data[0].label]} {prop.data[0].summary}
      </a>)
    }
    {intent === 2 && prop.data.map((row) => (
        <a href={row.link} onClick={emptyButtons} target="_blank" className="text-xs rounded-full border border-blue-700 text-blue-700 p-1">
          {labelToEmoji[row.label]} {row.summary}
        </a>
      ))}
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


                              
                  