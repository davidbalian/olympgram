import firebase from "firebase/compat/app";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import InfoPopup from "./InfoPopup";

type PostProps = {
  username: String;
  location: String;
  text: String;
  year: Number;
  image: String;
  references: string;
  db: firebase.firestore.Firestore;
};

type Person = {
  username: String;
  name: String;
  status: String;
  bio: String;
  profileUrl: string;
  backgroundUrl: String;
};

const Post: React.FC<PostProps> = ({
  username,
  location,
  text,
  year,
  image,
  references,
  db,
}) => {
  const [person, setPerson] = useState({} as Person);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const personsRef = db.collection("persons");

    personsRef
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Get the first document that matches the query and save it in state
          const doc = querySnapshot.docs[0];
          setPerson(doc.data() as Person);
        } else {
          console.log("No documents found.");
        }
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });
  }, [username, db]);

  return (
    <div className="post">
      <div className="post-info">
        <img
          className="profile-picture"
          src={
            person.profileUrl
              ? `https://cdn.jsdelivr.net/gh/davidbalian/history-media/${person.profileUrl}`
              : "https://cdn.jsdelivr.net/gh/davidbalian/history-media/default-profile.jpeg"
          }
          alt="profile"
        />
        <div className="user-info">
          <div className="user-location">
            <Link to={`/${username}`} className="username serif">
              {person.name}
            </Link>
            <p>•</p>
            <p className="location">{location}, </p>
            <p className="year">{year.toString()} μ.Χ</p>
          </div>
          <p className="status">{person.status}</p>
        </div>
        {references ? <InfoPopup reference={references.toString()} /> : null}
      </div>
      <p className="post-text">{text}</p>
      {image ? (
        <img className="post-img" src={image.toString()} alt="" />
      ) : null}
    </div>
  );
};

export default Post;
