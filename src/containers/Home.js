import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";

export default function Home(props) {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }
  
      try {
        const docs = await loadDocs();
        setDocs(docs);
      } catch (e) {
        alert(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [props.isAuthenticated]);
  
  function loadDocs() {
    return API.get("notes", "/notes");
  }

  function renderDocsList(docs) {
    return [{}].concat(docs).map((doc, i) =>
      i !== 0 ? (
        <LinkContainer key={doc.noteId} to={`/notes/${doc.noteId}`}>
          <ListGroupItem header={doc.content.trim().split("\n")[0]}>
            {"Created: " + new Date(doc.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new document
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Mr Speaker</h1>
        <p>A simple docunent speaking app. Login to view your documents or signup!</p>
      </div>
    );
  }

  function renderDocs() {
    return (
      <div className="docs">
        <PageHeader>Your Docs</PageHeader>
        <ListGroup>
          {!isLoading && renderDocsList(docs)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderDocs() : renderLander()}
    </div>
  );
}