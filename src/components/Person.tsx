import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";
import Loading from "./Loading";

const firebaseConfig = {
  apiKey: "AIzaSyC-be2hEU-eyyD1bgpEgVRJ5opojfnphqY",
  authDomain: "olympgram.com",
  projectId: "history-cb003",
  storageBucket: "history-cb003.appspot.com",
  messagingSenderId: "340751040194",
  appId: "1:340751040194:web:4998a86b618405fd9a855b",
  measurementId: "G-7XCZRMQBY1",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

type Person = {
  username: String;
  name: String;
  status: String;
  bio: String;
  profileUrl: string;
  backgroundUrl: String;
};

type Post = {
  username: String;
  location: String;
  text: String;
  year: Number;
  image: String;
};

const Person = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [person, setPerson] = useState<Person>({} as Person);
  const [isLoading, setIsLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    const collectionRef = db.collection("persons");
    const postsRef = db.collection("posts");

    collectionRef
      .where("username", "==", `${id}`)
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

    postsRef
      .where("username", "==", `${id}`)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Get the first document that matches the query and save it in state
          const data = querySnapshot.docs.map((doc) => doc.data());
          setPosts(data as Post[]);
          setIsLoading(false);
        } else {
          console.log("No documents found.");
        }
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });
  }, [id]);

  return (
    <div>
      {person && (
        <>
          <div className="profile-page">
            <div
              className="profile-background"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,0)), url(${
                  person.backgroundUrl
                    ? person.backgroundUrl
                    : "https://images.unsplash.com/photo-1643843207818-1bc6fc99b65f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                })`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="picture-user-status">
              <img
                src={`${
                  person.profileUrl
                    ? person.profileUrl
                    : "https://cdn.jsdelivr.net/gh/davidbalian/history-media/default-profile.jpeg"
                }`}
                alt="profile"
                className="profile-page-picture"
              />
              <div>
                <p className="username-profile">{person.name}</p>
                <p className="username-status">{person.status}</p>
                <p className="bio">{person.bio}</p>
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : (
              <>
                <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                  Posts by {person.name}
                </h2>
                <div className="posts">
                  {posts.map((post) => (
                    <Post
                      key={post.text.toString()}
                      username={post.username}
                      location={post.location}
                      text={post.text}
                      year={post.year}
                      image={post.image ? post.image : ""}
                      db={db}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Person;
