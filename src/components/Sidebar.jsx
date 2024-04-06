import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import { collection, query, onSnapshot } from "firebase/firestore";
import db from "../Firebase";
import { useStateValue } from "../StateProvider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import { actionTypes } from "../reducer";
import UseWindowDimensions from "../UseWindowDimensions";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [{ user, togglerState }, dispatch] = useStateValue();
  const [sidebarBool, setsidebarBool] = useState(true);
  const [search, setSearch] = useState([]);
  const [input, setInput] = useState("");
  const { width } = UseWindowDimensions();
  const [logout, setLogout] = useState(false);

  const matcher = (s, values) => {
    const re = RegExp(`.*${s.toLowerCase().split("").join(".*")}.*`);
    return values.filter((v) => v.data.name.toLowerCase().match(re));
  };

  const handleChange = (e) => {
    setsidebarBool(false);
    setInput(e.target.value);
  };

  const exitApp = () => {
    localStorage.removeItem("uid");
    window.location.reload();
    setLogout(true);
  };

  useEffect(() => {
    if (rooms.length > 0) {
      setSearch(matcher(input, rooms));
    }
    if (input === "") {
      setsidebarBool(true);
    }
  }, [input]);

  useEffect(() => {
    setToggler(!toggler);
  }, [togglerState]);

  const handleDrawerToggle = () => {
    setToggler(toggler);

    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const photoURL =
    localStorage.getItem("photoURL") !== ""
      ? localStorage.getItem("photoURL")
      : null;

  return (
    <>
      {width < 629 ? (
        <div
          className={
            togglerState % 2 !== 0 ? "sidebar" : "sidebar hide_sidebar"
          }
        >
          <div className="sidebar_wrapper">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className="sidebar__burger"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <div className="sidebar_header">
              <Avatar src={user?.photoURL} />
              <div className="header_right">
                <IconButton>
                  <DonutLargeIcon />
                </IconButton>
                <IconButton>
                  <ChatIcon />
                </IconButton>
                <IconButton>
                  <div onClick={exitApp}>
                    <ExitToAppIcon />
                  </div>
                </IconButton>
              </div>
            </div>
          </div>
          <div className="sidebar_search">
            <div className="search_container">
              <SearchOutlined />
              <input
                placeholder="Search or start new chat"
                value={input}
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>
          {sidebarBool ? (
            <div className="sidebar_chats">
              <SidebarChat addNewChat />
              {rooms.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          ) : (
            <div className="sidebar_chats">
              <SidebarChat addNewChat />
              {search.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="sidebar">
          <div className="sidebar_header">
            <Avatar src={user?.photoURL} />
            <div className="header_right">
              <IconButton>
                <DonutLargeIcon />
              </IconButton>
              <IconButton>
                <ChatIcon />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <div className="sidebar_search">
            <div className="search_container">
              <SearchOutlined />
              <input placeholder="Search or start new chat" type="text" />
            </div>
          </div>
          {sidebarBool ? (
            <div className="sidebar_chats">
              <SidebarChat addNewChat />
              {rooms.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          ) : (
            <div className="sidebar_chats">
              <SidebarChat addNewChat />
              {search.map((room) => (
                <SidebarChat key={room.id} id={room.id} name={room.data.name} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
