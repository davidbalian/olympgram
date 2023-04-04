import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";

type Props = {
  db: firebase.firestore.Firestore;
};

export type Person = {
  id: string;
  username: string;
  name: string;
  status: string;
  bio: string;
  profileUrl: string;
  backgroundUrl: string;
};

const AddUser: React.FC<Props> = ({ db }) => {
  const personsRef = db.collection("persons");
  const [persons, setPersons] = useState<Person[]>([]);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");

  const [editUser, setEditUser] = useState<Person | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const person: Person = {
      id,
      username,
      name,
      status,
      bio,
      profileUrl,
      backgroundUrl,
    };

    personsRef
      .add(person)
      .then(() => {
        setUsername("");
        setName("");
        setStatus("");
        setBio("");
        setProfileUrl("");
        setBackgroundUrl("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "name":
        setName(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "bio":
        setBio(value);
        break;
      case "profileUrl":
        setProfileUrl(value);
        break;
      case "backgroundUrl":
        setBackgroundUrl(value);
        break;
      default:
        break;
    }
  };

  const handleDelete = (id: string) => {
    const deleteRef = db.collection("persons").doc(id);

    deleteRef
      .delete()
      .then(() => {
        console.log("Person deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = async (value: string, id: string, fieldName: string) => {
    const docRef = firebase.firestore().collection("persons").doc(id);
    await docRef.update({ [fieldName]: value });
  };

  useEffect(() => {
    const unsubscribe = personsRef.onSnapshot((querySnapshot) => {
      const newPersons: Person[] = [];
      querySnapshot.forEach((doc) => {
        const person: Person = {
          id: doc.id,
          username: doc.data().username,
          name: doc.data().name,
          status: doc.data().status,
          bio: doc.data().bio,
          profileUrl: doc.data().profileUrl,
          backgroundUrl: doc.data().backgroundUrl,
        };
        newPersons.push(person);
      });
      setPersons(newPersons);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <td>
                <h2>Add Person</h2>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="headings">
              <td>
                <label htmlFor="username">Username</label>
              </td>
              <td>
                <label htmlFor="name">Name</label>
              </td>
              <td>
                <label htmlFor="status">Status</label>
              </td>
              <td>
                <label htmlFor="bio">Bio</label>
              </td>
              <td>
                <label htmlFor="profileUrl">Profile Url</label>
              </td>
              <td>
                <label htmlFor="backgroundUrl">Background Url</label>
              </td>
              <td>Actions</td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={status}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="profileUrl"
                  name="profileUrl"
                  value={profileUrl}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  id="backgroundUrl"
                  name="backgroundUrl"
                  value={backgroundUrl}
                  onChange={handleChange}
                />
              </td>
              <td>
                <button type="submit">Add Person</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <table>
        <thead>
          <tr>
            <td>
              <h2>Persons</h2>
            </td>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td>
                <input
                  type="text"
                  defaultValue={person.username}
                  onBlur={(e) =>
                    handleEdit(e.target.value, person.id, "username")
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={person.name}
                  onBlur={(e) => handleEdit(e.target.value, person.id, "name")}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={person.status}
                  onBlur={(e) =>
                    handleEdit(e.target.value, person.id, "status")
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={person.bio}
                  onBlur={(e) => handleEdit(e.target.value, person.id, "bio")}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={person.profileUrl}
                  onBlur={(e) =>
                    handleEdit(e.target.value, person.id, "profileUrl")
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={person.backgroundUrl}
                  onBlur={(e) =>
                    handleEdit(e.target.value, person.id, "backgroundUrl")
                  }
                />
              </td>
              <td>
                <button onClick={() => handleDelete(person.id.toString())}>
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

export default AddUser;
