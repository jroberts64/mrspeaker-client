import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Docs.css";
import { s3Upload } from "../libs/awsLib";

export default function Docs(props) {
  const file = useRef(null);
  const [doc, setDoc] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    function loadDoc() {
      return API.get("speakToMe", `/docs/${props.match.params.id}`);
    }


    async function onLoad() {
      try {
        const doc = await loadDoc();
        const { content, attachment } = doc;

        if (attachment) {
          doc.attachmentURL = await Storage.vault.get(attachment);
          setPlayer(new Audio(doc.attachmentURL));
        }

        setContent(content);
        setDoc(doc);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);
  
  window.onbeforeunload = function(){
    console.log("unload called")
    player.stopPlaying();
  }

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  function saveDoc(doc) {
    return API.put("speakToMe", `/docs/${props.match.params.id}`, {
      body: doc
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
  
      await saveDoc({
        content,
        attachment: attachment || doc.attachment
      });
      if( attachment && doc.attachment ) {
        Storage.vault.remove( doc.attachment );
      }
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }
  
  function deleteDoc() {
    if( doc.attachment ) {
      Storage.vault.remove( doc.attachment );
    }
    return API.del("speakToMe", `/docs/${props.match.params.id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteDoc();
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }
  
  function playAudio(event) {
      console.log("play file");
      console.log(doc.attachmentURL);
      player.play();
  }

    return (
    <div className="Docs">
      {doc && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {doc.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={doc.attachmentURL}
                >
                  {formatFilename(doc.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          {doc.attachment && (
            <FormGroup>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playAudio}
                >
                  play
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!doc.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}