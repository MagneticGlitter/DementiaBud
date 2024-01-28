import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
const Album = () => {
  const [folders, setFolders] = useState([]);
  const [link, setLink] = useState("");
  useEffect(() => {
    // Fetch data or set your folder structure here
    const fetchedFolders = [
      { label:"Folder 1", link: "https://www.youtube.com/watch?v=paiO6M2wBqE"},
      { label:"Folder 1", link: "https://www.youtube.com/watch?v=Et7TTfwvBFo"},
      { label:"Folder 1", link: "www.google.com"},
      { label:"Folder 1", link: "www.google.com"},
      { label:"Folder 1", link: "www.google.com"},
      { label:"Folder 1", link: "www.google.com"},
      { label:"Folder 1", link: "www.google.com"},
      { label:"Folder 1", link: "www.google.com"},
      
      // Add more folders as needed
    ];

    setFolders(fetchedFolders);
  }, []);

  return (
    
<>
  <div style={{ overflowX: 'hidden' }}>
    {/* Video Player */}
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url={link}
        width="600px"
        height="300px"
        controls
      />
    </div>


  <div className="overflow-x-auto whitespace-nowrap mt-4">
  <div className="flex p-4 flex-row">
      {folders && folders.map((folder) => (
        <>
        <div className="flex flex-col items-center">
            <img
              src='polaroid.png'
              width={180} // Adjust the width to your desired size
              style={{ marginLeft: '50px', marginRight: '50px'}}
            />
            <Button sx={{ color: "lightpink", "&:hover": {backgroundColor: "lightcoral", color: "white"}, }}>
            <a href="#" onClick={() => {setLink(folder.link)}}>{folder.label}</a>
            </Button>
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
