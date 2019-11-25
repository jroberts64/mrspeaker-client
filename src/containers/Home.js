import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem, Button, Glyphicon  } from "react-bootstrap";
import "./Home.css";
import { API, Storage } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { deleteDoc } from "../libs/miscLib.js";

export default function Home(props) {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //const [currentAudio, setCurrentAudio] = useState(null);
  var currentAudio = null;

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
    return API.get("speakToMe", "/docs");
  }

  async function playAudio(filename) {
    if( currentAudio && !currentAudio.ended ) {
        currentAudio.pause();
        currentAudio = null;
        return;
    }
    console.log("filename = " + filename);
    var audioURL = await Storage.vault.get(filename);
    console.log("URL = " + audioURL);
    currentAudio = new Audio(audioURL);
    await currentAudio.play();
    console.log("Audio.play() didn't wait for me " + currentAudio);
  }

  async function handleDelete(doc) {
    //event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this document?");

    if (!confirmed) return;

    //setIsDeleting(true);

    try {
        await deleteDoc(doc);
        window.location.reload(true);
    } catch (e) {
        alert(e);
        //setIsDeleting(false);
    }
}


  function editDoc(id) {
    window.open("/docs/" + id,"_self")
  }
//         <LinkContainer key={doc.docId} to={`/docs/${doc.docId}`}>
//        <LinkContainer key={doc.docId}>

  function renderDocsList(docs) {
    return [{}].concat(docs).map((doc, i) =>
      i !== 0 ? (
        //<LinkContainer key={doc.docId} to={`/docs/${doc.docId}`}>
          <ListGroupItem key={doc.docId} header={doc.content.trim().split("\n")[0]}>
                {"Created: " + new Date(doc.createdAt).toLocaleString()}
            <span className="pull-rightxxx">
                <Button className="tmp" onClick={() => { playAudio(doc.audio) }}> speak <Glyphicon glyph="play" /> </Button > <span/>
                <Button className="tmp" onClick={() => { editDoc(doc.docId) }}> edit <Glyphicon glyph="edit" /> </Button > <span/>
                <Button className="tmp" bsStyle="danger" onClick={() => { handleDelete(doc) }}><Glyphicon glyph="trash" /> </Button >
            </span>

          </ListGroupItem>
        //</LinkContainer>
      ) : (
        <LinkContainer key="new" to="/docs/new">
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