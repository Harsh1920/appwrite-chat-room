import React, { useEffect, useState } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGE,
} from "../appwriteConfig";

import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessage();
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGE}.documents`,
      (res) => {
        if (
          res.events.includes("databases.*.collections.*.documents.*.create")
        ) {
          console.log("Something is created on DB.", res);
          setMessages((prevState) => [res.payload, ...prevState]);
        }
        if (
          res.events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          console.log("Something is deleted on DB!!!", res);
          setMessages((prevState) =>
            prevState.filter((msg) => msg.$id !== res.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      message_body: messageBody,
    };

    let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      ID.unique(),
      payload
    );

    // console.log("Data inserted!", response);

    // setMessages(() => [response, ...messages]);

    setMessageBody("");
  };

  const getMessage = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      [Query.orderDesc("$createdAt")]
    );
    // console.log("Response", response);
    setMessages(response.documents);
  };

  const deleteMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGE, message_id);
    // setMessages((prevState) =>
    //   messages.filter((msg) => msg.$id !== message_id)
    // );
  };

  //   console.log("Input Message:", messageBody);

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              name=""
              id=""
              placeholder="Say something..."
              maxLength="1000"
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
              required
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((msg) => (
            <div key={msg.$id} className="message--wrapper">
              <div className="message--header">
                <small className="message-timestamp">
                  <p>{new Date(msg.$createdAt).toLocaleString()}</p>
                </small>
                <Trash2
                  className="delete--btn"
                  onClick={() => deleteMessage(msg.$id)}
                />
              </div>
              <div className="message--body">
                <span>{msg.message_body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
