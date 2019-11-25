import React, { useRef, useState } from "react";
import { FormGroup, ControlLabel, Label, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewDoc.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewDoc(props) {
    const file = useRef(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
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
            var attachment = null;
            var audio = null;
            if (file.current) {
                attachment = await s3Upload(file.current);
                audio = attachment.substr(0, attachment.lastIndexOf(".")) + ".mp3";
            }
            var bucket = config.s3.BUCKET;
            console.log({ content, attachment, bucket, audio });
            await createDoc({ content, attachment, bucket, audio });
            props.history.push("/");
        } catch (e) {
            alert(e);
            setIsLoading(false);
        }
    }

    function createDoc(doc) {
        return API.post("speakToMe", "/docs", {
            body: doc
        });
    }

    return (
        <div className="NewDoc">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="content">
                    <Label>Name</Label>
                    <FormControl
                        value={content}
                        componentClass="input"
                        onChange={e => setContent(e.target.value)}
                        label="Name: "
                    />
                </FormGroup>
                <FormGroup controlId="file">
                    <ControlLabel>Attachment</ControlLabel>
                    <FormControl onChange={handleFileChange} type="file" accept="text/plain" />
                </FormGroup>
                <LoaderButton
                    block
                    type="submit"
                    bsSize="large"
                    bsStyle="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
        </LoaderButton>
            </form>
        </div>
    );
}