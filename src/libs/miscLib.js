import { API, Storage } from "aws-amplify";

export function isValidUri(uri) {
    var request = new XMLHttpRequest();
    request.open('GET', uri, false);
    request.send(); // there will be a 'pause' here until the response to come.
    return request.status === 200;
}

export function deleteDoc(doc) {
    if ( doc.attachment ) {
        Storage.vault.remove( doc.attachment ); 
        Storage.vault.remove(doc.audio);
    }
    return API.del("speakToMe", "/docs/" + doc.docId);
}