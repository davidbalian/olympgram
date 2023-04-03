import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import glogo from "../glogo.png";

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        //eslint-disable-next-line
        const user = result.user;
      })
      .catch((error) => {
        //eslint-disable-next-line
        const errorCode = error.code;
        //eslint-disable-next-line
        const errorMessage = error.message;
      });
  };
  return (
    <button className="btn social-login" onClick={handleGoogleLogin}>
      <img src={glogo} alt="google logo" />
      Continue with Google
    </button>
  );
};

export default GoogleLogin;
