import { useState, useEffect } from "react";
import {botDeleteUser, botUpdate} from "./voiceflowController";
import useSpeechRecognition from "./speech";

const Chatbot = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [bgInfo, setBgInfo] = useState("I have a family of 4");
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
      const initInteraction = async () => {
        await botDeleteUser()
        await handleInteract(bgInfo)
      }
      if (count) {
        initInteraction()
      } 
      count--;
  }, []);

  
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


  const handleInteract = async (input) => {
    try {
      // Send user input and get the bot's response
      const list = await botUpdate(input);
      console.log(input)
      console.log(list)
      // Update state based on previous state using the functional form
      // const indicator = list[list.length-1].charAt(list[list.length-1].length-1)
      // console.log(indicator)
      if (list){
        setChatMessages((prevChatMessages) => [
          ...prevChatMessages,
          ...list.map((message) => ({ type: "bot", text: message })),
        ]);
      }
    } catch (error) {
      console.error("Error updating interaction:", error);
    }
  }

  return (
    <>
<div className="relative h-full w-full flex flex-col">
  {/* Conversation messages */}
  <div className="flex flex-col items-start space-y-2 overflow-y-auto flex-grow max-h-[400px]">
    {chatMessages.map((message, index) => (
      <div
        key={index}
        className={`flex items-start ${message.type === "user" ? "bg-gray-300 self-end" : "bg-blue-700"} p-2 rounded-lg max-h-[900px]`}
      >
        <p
          className={`${
            message.type === "bot" ? "text-white" : "text-black"
          } overflow-hidden break-words max-w-full`}
        >
          {message.text}
        </p>
      </div>
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
        className="bg-blue-700 text-white p-2 rounded-r-lg ml-2"
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


                              
                  