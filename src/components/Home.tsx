import firebase from "firebase/compat";
import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import Loading from "./Loading";

type Props = {
  db: firebase.firestore.Firestore;
};

type Post = {
  username: string;
  location: string;
  text: string;
  year: number;
  reference?: string;
  image: string;
};

const Home: React.FC<Props> = ({ db }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const collectionRef = db.collection("posts");
  const query = collectionRef.orderBy("year");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cachedPosts = sessionStorage.getItem("posts");
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
      setIsLoading(false);
      return;
    }

    query
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(data);
        sessionStorage.setItem("posts", JSON.stringify(data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
        setIsLoading(false);
      });

    document.title = "Home | Olympgram";
  }, [db]);

  return (
    <div className="home" ref={containerRef}>
      <h2>Start scrolling...</h2>
      <div className="posts">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {posts
              .sort((a, b) => a.year - b.year)
              .map((post) => (
                <Post
                  key={post.text.toString()}
                  db={db}
                  username={post.username}
                  location={post.location}
                  text={post.text}
                  year={post.year}
                  reference={post.reference ? post.reference : ""}
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
