import { Button } from "@material-ui/core";
import React from "react";
import { auth, provider } from "../Firebase";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import {signInWithPopup} from "firebase/auth"
import "./Login.css";

function Login() {
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    signInWithPopup(auth,provider)
        .then((result) => {
          dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
          });
        })
        .catch((error) => alert(error.message));
  };
  return (
    <div className="login">
      <div className="login_container">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG8tgAqt4XgXq2goH78V81ixs-Wdz_OL5FKRcKZWYiqVoQGG0PQ8Wf6ggsIPZvtVTq_Ag&usqp=CAU"></img>
        <div className="login_text">
          <h1>Sign in to Chatter</h1>
        </div>
        <Button className="button" onClick={signIn}>
          Sign In with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
