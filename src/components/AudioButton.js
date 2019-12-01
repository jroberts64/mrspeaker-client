import React from "react";
import config from "../config";
import { Storage } from "aws-amplify";
import { Button, Glyphicon } from "react-bootstrap";

const AWS = require('aws-sdk'); var url = require('url');
const s3 = new AWS.S3();

var currentlyPlaying = null;

export function AudioButton({
  disabled = false,
  audioElement = null,
  ...props
}) {

  function stopCurrentlyPlayingAudio() {
    if (currentlyPlaying && !currentlyPlaying.ended) {
      currentlyPlaying.pause();
      currentlyPlaying = null;
      return true;
    }
    return false;
  }

  async function playAudio(filename) {

    if (stopCurrentlyPlayingAudio()) return;

    const audioURL = await Storage.vault.get(filename);
    const audioElement = new Audio(audioURL);
    audioElement.play();
    currentlyPlaying = audioElement;
  }

  async function isValidAudio(key) {

    Storage.vault.get(key, function (err, audioUrl) {
      if (err) {
        console.log('ERROR Storage.vault.get: ', err);
        disabled = true;
      }
      else {
        const fullKey = url.parse(audioUrl, true).path.substr(1);
        const headParams = {
          Bucket: config.s3.BUCKET,
          Key: fullKey
        };
        s3.headObject(headParams, function (err, data) {
          if (err) {
            console.log('ERROR headObject err: ', err);
            disabled = true;
          }
          else {
            console.log('headObject: ' + data)
            disabled = false;
          }
        });
      }
    });
  };


  isValidAudio(props.audio);

  return (
    <Button className={props.className} disabled={disabled} onClick={() => { playAudio(props.audio) }}>
      speak
            <Glyphicon glyph="play" />
    </Button >
  );
}
