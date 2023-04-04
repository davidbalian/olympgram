import firebase from "firebase/compat";
import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import Loading from "./Loading";

type Props = {
  db: firebase.firestore.Firestore;
};

type Post = {
  username: String;
  location: String;
  text: String;
  year: number;
  image: String;
};

const Home: React.FC<Props> = ({ db }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const collectionRef = db.collection("posts");
  const query = collectionRef.orderBy("year");

  const containerRef = useRef<HTMLDivElement>(null); // create a ref to the container element

  useEffect(() => {
    // check if posts are cached
    const cachedPosts = sessionStorage.getItem("posts");

    if (cachedPosts) {
      // if posts are cached, use them to set the state of the component
      const posts = JSON.parse(cachedPosts);
      setPosts(posts);
      setIsLoading(false);

      // restore scroll position if available
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        containerRef.current?.scrollTo(0, parseInt(scrollPosition));
      }
    } else {
      // if posts are not cached, fetch them from Firebase and cache them
      query
        .get()
        .then((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data() as Post);
          setPosts(data);
          sessionStorage.setItem("posts", JSON.stringify(data)); // cache posts
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Error getting documents:", error);
        });
    }

    document.title = "Home | Olympgram";
  }, [db]);

  useEffect(() => {
    // add event listener to save scroll position
    const handleScroll = () => {
      sessionStorage.setItem(
        "scrollPosition",
        containerRef.current?.scrollTop.toString() || "0"
      );
    };
    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="home" ref={containerRef}>
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
