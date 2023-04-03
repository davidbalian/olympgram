import React from "react";
import firebase from "firebase/compat";

type Props = {
  db: firebase.firestore.Firestore;
};

const AddPost: React.FC<Props> = ({ db }) => {
  return <div>AddPost</div>;
};

export default AddPost;
