import firebase from "firebase/compat";
import { useEffect, useState } from "react";
import Post from "./Post";
import Loading from "./Loading";

type Props = {
  db: firebase.firestore.Firestore;
};

type Post = {
  username: String;
  location: String;
  text: String;
  year: Number;
  image: String;
};

const Home: React.FC<Props> = ({ db }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectionRef = db.collection("posts");
    const query = collectionRef.orderBy("year");

    query
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = querySnapshot.docs.map((doc) => doc.data() as Post);
          setPosts(data);
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });
  }, [db]);

  return (
    <div className="home">
      <div className="posts">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {posts.map((post) => (
              <Post
                key={post.text.toString()}
                db={db}
                username={post.username}
                location={post.location}
                text={post.text}
                year={post.year}
                image={post.image ? post.image : ""}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
