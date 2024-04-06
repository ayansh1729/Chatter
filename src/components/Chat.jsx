import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  MoreVert,
  AttachFile,
  SearchOutlined,
  MessageSharp,
} from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "../Firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Picker from "emoji-picker-react";
import { actionTypes } from "../reducer";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import UseWindowDimensions from "../UseWindowDimensions";
import SendIcon from "@material-ui/icons/Send";
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [Emoji, setEmoji] = useState(false);
  const [toggler, setToggler] = useState(true);

  const [{ user, togglerState }, dispatch] = useStateValue();
  const { width } = UseWindowDimensions();
  const [showSend, setshowSend] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      const unsubscribeRoom = onSnapshot(
        doc(db, "rooms", roomId),
        (snapshot) => {
          setRoomName(snapshot.data().name);
        }
      );

      const unsubscribeMessages = onSnapshot(
        query(
          collection(db, "rooms", roomId, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
          scrollToBottom();
        }
      );

      return () => {
        unsubscribeRoom();
        unsubscribeMessages();
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (input.length > 0) {
      setshowSend(true);
    } else {
      setshowSend(false);
    }
  }, [input]);
  

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onEmojiClick = (event, emojiObject) => {
    setInput((prevInput) => prevInput + event.emoji);
    setEmoji(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const messageRef = collection(db, "rooms", roomId, "messages");

      // Fallback value for name if user display name is undefined
      const displayName = user?.displayName || "Anonymous";

      await addDoc(messageRef, {
        message: input,
        name: displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: localStorage.getItem("photoURL"),
      });

      setInput("");
      setEmoji(false);
      setshowSend(false);
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  const handleDrawerToggle = () => {
    setToggler(!toggler);
    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };

  return (
    <>
      {width < 629 ? (
        <div className={togglerState % 2 === 0 ? "chat" : "chat hide_chat"}>
          <div className="chat_header">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`}
            />
            <div className="chat_headerInfo">
              <h3>{roomName}</h3>
              <p>
                last seen{" "}
                {new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()}
              </p>
            </div>
            <div className="chat_headerRight">
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <MoreVert />
              </IconButton>
            </div>
          </div>
          <div className="chat_body">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`chat_message ${
                  message.name === user?.displayName && "chat_receiver"
                }`}
              >
                <span className="chat_name">{message.name}</span>
                {message.message}
                <span className="chat_time">
                  {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat_footer">
            <IconButton onClick={() => setEmoji(!Emoji)}>
              <div className="emoji">
                <InsertEmoticonIcon />
              </div>
            </IconButton>
            {Emoji && <Picker onEmojiClick={onEmojiClick} />}
            <form>
              <input
                type="text"
                value={input}
                onClick={showSend}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit" onClick={sendMessage}>
                Send
              </button>
            </form>
            <IconButton>
              {!showSend && <MicIcon />}
              {showSend && <SendIcon onClick={sendMessage} />}
            </IconButton>
          </div>
        </div>
      ) : (
        <div className="chat">
          <div className="chat_header">
            <Avatar
              src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`}
            />
            <div className="chat_headerInfo">
              <h3>{roomName}</h3>
              <p>
                last seen{" "}
                {new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()}
              </p>
            </div>
            <div className="chat_headerRight">
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <MoreVert />
              </IconButton>
            </div>
          </div>
          <div className="chat_body">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`chat_message ${
                  message.name === user?.displayName && "chat_receiver"
                }`}
              >
                <span className="chat_name">{message.name}</span>
                {message.message}
                <span className="chat_time">
                  {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat_footer">
            <IconButton onClick={() => setEmoji(!Emoji)}>
              <div className="emoji">
                <InsertEmoticonIcon />
              </div>
            </IconButton>
            {Emoji && <Picker onEmojiClick={onEmojiClick} />}
            <form>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
              />
              <button type="submit" onClick={sendMessage}>
                Send
              </button>
            </form>
            <IconButton>
              <MicIcon />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
