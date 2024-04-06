import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import db  from "../Firebase"; // Assuming db is exported from Firebase.js

function SidebarChat({ id, addNewChat, name }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const [{ togglerState }, dispatch] = useStateValue();

  useEffect(() => {
    if (id) {
      const q = query(collection(db, "rooms", id, "messages"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

      return () => unsubscribe();
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Enter room name: ");
    if (roomName) {
      try {
        // Add a new document to the "rooms" collection with the provided roomName
        const docRef = await addDoc(collection(db, "rooms"), {
          name: roomName
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };
  

  const handleChat = () => {
    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <Link to={`/rooms/${id}`} onClick={handleChat}>
        <div className="sidebar_chat">
          <Avatar src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`} />
          <div className="sidebar_chat_info">
            <h2>{name}</h2>
            <p>{messages[0]?.message}</p>
          </div>
        </div>
      </Link>
    </div>
  ) : (
    <div className="sidebar_chat new_chat" onClick={createChat}>
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
