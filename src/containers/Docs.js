import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Label } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Docs.css";
import { s3Upload } from "../libs/awsLib";
import { isValidUri, deleteDoc } from "../libs/miscLib";
import {AudioButton} from "../components/AudioButton";

export default function Docs(props) {
    const file = useRef(null);
    const [doc, setDoc] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [myPlayer, setMyPlayer] = useState(null);

    useEffect(() => {

        function loadDoc() {
            return API.get("speakToMe", "/docs/" + props.match.params.id);
        }

        async function onLoad() {
            try {
                const doc = await loadDoc();
                const { content, attachment, audio } = doc;

                if (attachment) {
                    doc.audioURL = await Storage.vault.get(audio);
                    if (!myPlayer) {
                      var tmp = new Audio(doc.audioURL);
                      setMyPlayer(tmp);
                    }
                }

                setContent(content);
                setDoc(doc);
            } catch (e) {
                alert(e);
            }
        }

        onLoad();
    }, [props.match.params.id, myPlayer]);

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
        let audio;

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
                audio = attachment.substr(0, attachment.lastIndexOf(".")) + ".mp3";
            }
            var bucket = config.s3.BUCKET;
            await saveDoc({
                content,
                attachment: attachment || doc.attachment,
                audio: audio || doc.audio,
                bucket
            });
            if( attachment && doc.attachment ) {
                Storage.vault.remove( doc.attachment );
                if(doc.audio) Storage.vault.remove(doc.audio);
            }
            props.history.push("/");
        } catch (e) {
            alert(e);
            setIsLoading(false);
        }
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm("Are you sure you want to delete this document?");

        if (!confirmed) return;

        setIsDeleting(true);

        try {
            await deleteDoc(doc);
            props.history.push("/");
        } catch (e) {
            alert(e);
            setIsDeleting(false);
        }
    }

    function isAudio() {
        return isValidUri(doc.audioURL);
    }
    return (
        <div className="Docs">
            {doc && (
                <form onSubmit={handleSubmit}>
                    <FormGroup controlId="content">
                        <Label>Name</Label>
                        <FormControl
                            value={content}
                            componentClass="input"
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
                                    {formatFilename(doc.attachment)} <span /> 
                                </a> 
                                {isAudio() && (
                                    <AudioButton
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        audio={doc.audio}
                                    />
                                )}
                                </FormControl.Static>
                        </FormGroup>
                    )}
                    <FormGroup controlId="file">
                        {!doc.attachment && <ControlLabel>Attachment</ControlLabel>}
                        <FormControl onChange={handleFileChange} type="file" accept="text/plain"/>
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