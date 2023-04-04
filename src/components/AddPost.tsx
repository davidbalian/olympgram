import firebase from "firebase/compat/app";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

type Props = {
  db: firebase.firestore.Firestore;
};

export type Post = {
  id: string;
  username: string;
  text: string;
  location: string;
  year: number;
  image: string;
};

const AddPost: FC<Props> = ({ db }) => {
  const postsRef = db.collection("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState(0);
  const [image, setImage] = useState("");

  const [usernames, setUsernames] = useState<string[]>([] as string[]);

  const handleUsernameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const post: Post = {
      id,
      username,
      text,
      location,
      year,
      image,
    };

    postsRef
      .add(post)
      .then(() => {
        setUsername("");
        setText("");
        setLocation("");
        setYear(0);
        setImage("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "year":
        setYear(parseInt(value));
        break;
      case "image":
        setImage(value);
        break;
      default:
        break;
    }
  };

  const handleDelete = (id: string) => {
    const deleteRef = db.collection("posts").doc(id);

    deleteRef
      .delete()
      .then(() => {
        console.log("Post deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = async (value: string, id: string, fieldName: string) => {
    const docRef = firebase.firestore().collection("posts").doc(id);
    await docRef.update({ [fieldName]: value });
  };

  useEffect(() => {
    const unsubscribe = postsRef.onSnapshot((querySnapshot) => {
      const newPost: Post[] = [];
      querySnapshot.forEach((doc) => {
        const post: Post = {
          id: doc.id,
          username: doc.data().username,
          text: doc.data().text,
          location: doc.data().location,
          year: doc.data().year,
          image: doc.data().image,
        };
        newPost.push(post);
      });
      setPosts(newPost);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      const db = firebase.firestore();
      const snapshot = await db.collection("persons").get();
      const usernames = snapshot.docs.map((doc) => doc.data().username);
      setUsernames(usernames);
    };
    fetchUsernames();
  }, []);

  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <td>
                <h2>Add Post</h2>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="headings">
              <td>
                <label htmlFor="username">Username</label>
              </td>
              <td>
                <label htmlFor="name">Text</label>
              </td>
              <td>
                <label htmlFor="status">Location</label>
              </td>
              <td>
                <label htmlFor="bio">Year</label>
              </td>
              <td>
                <label htmlFor="profileUrl">Image Url</label>
              </td>
              <td>Actions</td>
            </tr>
            <tr>
              <td>
                <select value={username} onChange={handleUsernameChange}>
                  <option value="">Select a username</option>
                  {usernames.map((username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <textarea
                  id="text"
                  name="text"
                  value={text}
                  onChange={handleTextChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={location}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={year}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={image}
                  onChange={handleChange}
                />
              </td>
              <td>
                <button type="submit">Add Post</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <table>
        <thead>
          <tr>
            <td>
              <h2>Posts</h2>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className="headings">
            <td>
              <label htmlFor="username">Username</label>
            </td>
            <td>
              <label htmlFor="name">Text</label>
            </td>
            <td>
              <label htmlFor="status">Location</label>
            </td>
            <td>
              <label htmlFor="bio">Year</label>
            </td>
            <td>
              <label htmlFor="profileUrl">Image Url</label>
            </td>
            <td>Actions</td>
          </tr>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <select
                  defaultValue={post.username}
                  onBlur={(e) =>
                    handleEdit(e.target.value, post.id, "username")
                  }
                >
                  <option value="">Select a username</option>
                  {usernames.map((username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <textarea
                  defaultValue={post.text}
                  onBlur={(e) => handleEdit(e.target.value, post.id, "text")}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={post.location}
                  onBlur={(e) =>
                    handleEdit(e.target.value, post.id, "location")
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  defaultValue={post.year}
                  onBlur={(e) => handleEdit(e.target.value, post.id, "year")}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={post.image}
                  onBlur={(e) => handleEdit(e.target.value, post.id, "image")}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(post.id.toString())}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AddPost;
