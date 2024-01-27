import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
const Album = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch data or set your folder structure here
    const fetchedFolders = [
      { id: 1, name: "Folder 1" },
      { id: 2, name: "Folder 2" },
      { id: 3, name: "Folder 3" },
      { id: 4, name: "Folder 1" },
      { id: 5, name: "Folder 2" },
      { id: 6, name: "Folder 3" },
      { id: 7, name: "Folder 1" },
      { id: 8, name: "Folder 2" },
      { id: 9, name: "Folder 3" },
      // Add more folders as needed
    ];

    setFolders(fetchedFolders);
  }, []);

  return (
    
    <>
     <div>
      {/* Video Player */}
      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          url="https://www.youtube.com/watch?v=paiO6M2wBqE"
          width="600px" // Set width to 1920
          height="300px" // Set height to 1080
          controls
        />
      </div>

      {/* Folders */}
      <div className="overflow-x-auto whitespace-nowrap">
        <div className="flex p-4">
          {folders.map((folder) => (
            <div key={folder.id} className="mx-4 bg-pink-500 p-4 flex items-center justify-center text-white font-bold">
              
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Album;
