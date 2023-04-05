import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import AddPost from "./components/AddPost";
import AddUser from "./components/AddUser";
import Person from "./components/Person";
import ScrollToTop from "./components/ScrollToTop";
import Signup from "./components/Signup";

const firebaseConfig = {
  apiKey: "AIzaSyC-be2hEU-eyyD1bgpEgVRJ5opojfnphqY",
  authDomain: "olympgram.com",
  projectId: "history-cb003",
  storageBucket: "history-cb003.appspot.com",
  messagingSenderId: "340751040194",
  appId: "1:340751040194:web:4998a86b618405fd9a855b",
  measurementId: "G-7XCZRMQBY1",
};

const db: firebase.firestore.Firestore = firebase.firestore();

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const auth = firebase.auth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    // cleanup function
    return () => {
      unsubscribe();
    };
  }, [auth, setUser]);

  return (
    <div className="App">
      {user ? (
        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      ) : null}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <>
                <Header />
                <Home db={db} />
              </>
            ) : (
              <div className="login-signup">
                <Welcome />
                <Login />
              </div>
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <div className="login-signup">
                <Welcome />
                <Login />
              </div>
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <div className="login-signup">
                <Welcome />
                <Signup />
              </div>
            )
          }
        />
        <Route
          path="/guest"
          element={
            <>
              <Header />
              <Home db={db} />
            </>
          }
        />
        <Route
          path="/:id"
          element={
            <>
              <Header />
              <Person />
            </>
          }
        />
        <Route path="/add-user" element={<AddUser db={db} />} />
        <Route path="/add-post" element={<AddPost db={db} />} />
      </Routes>
      <ScrollToTop />
    </div>
  );
}

export default App;
