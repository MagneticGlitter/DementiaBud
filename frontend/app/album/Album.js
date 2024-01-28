import React, { useState } from "react";
import ReactPlayer from "react-player";

const Album = (prop) => {
  const [currLink, setCurrLink] = useState("https://www.youtube.com/watch?v=AjWfY7SnMBI")
  const labelToEmoji = {
    "family": '🏠',
    "education": '📚',
    "romance": '❤️',
    "sports": '⚽',
    "accomplishment": '🏆',
  };
  return (
    
<>
  <div style={{ overflowX: 'hidden' }}>
    {/* Video Player */}
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url={currLink}
        width="600px"
        height="300px"
        controls
      />
    </div>


  <div className="overflow-x-auto whitespace-nowrap mt-4">
  <div className="flex p-4 flex-row">
      {prop.data && prop.data.map((row) => (
        <>
        <div className="flex flex-col items-center" key={row.id}>
            <img
              src={`floppy3.png`}
              width={180} // Adjust the width to your desired size
              style={{ marginLeft: '50px', marginRight: '50px'}}
            />
            <a href="#" onClick={() => { setCurrLink(row.link) }} className="text-md rounded-full border border-blue-700 text-blue-700 p-1">
              {labelToEmoji[row.label]} {row.summary}
            </a>
        </div>
      </>
      ))}
      
  </div>
</div>

  </div>
</>



  );
};

export default Album;
