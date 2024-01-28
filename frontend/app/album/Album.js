import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";

import ReactPlayer from "react-player";

const Album = (prop) => {
  const [currLink, setCurrLink] = useState("./A_black_image.jpg.webp")
  const labelToEmoji = {
    "family": '🏠',
    "education": '📚',
    "romance": '❤️',
    "sports": '⚽',
    "accomplishment": '🏆',
  };
  return (
    
<div>
  <div style={{ overflowX: 'hidden' }}>
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
          <div className="flex flex-col items-center" key={row.id}>
            <img
              src='polaroid.png'
              width={180} // Adjust the width to your desired size
              style={{ marginLeft: '50px', marginRight: '50px'}}
            />
            <Button sx={{ color: "lightpink", "&:hover": {backgroundColor: "lightcoral", color: "white"}, }}>
            <a href="#" onClick={() => {setCurrLink(row.link)}}> {labelToEmoji[row.label]} {row.summary}</a>
            </Button>
            </div>
        ))}
    </div>
  </div>
  </div>
  </div>
  
      
  );
};

export default Album;