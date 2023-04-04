import firebase from "firebase/compat/app";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type PostProps = {
  username: String;
  location: String;
  text: String;
  year: Number;
  image: String;
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
  db,
}) => {
  const [person, setPerson] = useState({} as Person);
  const [show, setShow] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

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
              ? person.profileUrl
              : "https://cdn.jsdelivr.net/gh/davidbalian/history-media/default-profile.jpeg"
          }
          alt="profile"
        />
        <div className="user-info">
          <div className="user-location">
            <Link to={`/${username}`} className="username serif bold">
              {person.name}
            </Link>
            <p>•</p>
            <p className="location serif">{location}, </p>
            <p className="year serif">{year.toString()} μ.Χ</p>
          </div>
          <p className="status serif">{person.status}</p>
        </div>
        <p ref={infoRef} className="info-icon">
          &#9432;
        </p>
        {show ? (
          <p className="info-icon reference">
            <h3>Πηγές</h3>
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. At
            reiciendis repellendus facilis, odit ab culpa dolorum aperiam
            voluptatem animi alias tempore ullam consequuntur labore iste omnis
            ad suscipit. Corrupti, ab.
          </p>
        ) : null}
      </div>
      <p className="post-text">{text}</p>
      {image ? (
        <img className="post-img" src={image.toString()} alt="" />
      ) : null}
    </div>
  );
};

export default Post;
