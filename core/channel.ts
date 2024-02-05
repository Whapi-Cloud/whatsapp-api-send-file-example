import * as fs from "fs";

export class Channel {
  token: string;
  constructor(token: string) {
    this.token = token;
  }

  async checkHealth() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch("https://gate.whapi.cloud/health", options);
    const response = await responseRaw.json();
    if (response.status.text !== "AUTH") throw "Channel not auth";
  }

  async sendLocalPdf(filePath: string, to: string): Promise<number> {
    let media: string;
    const base64 = fs.readFileSync(filePath, "base64"); // file to base64
    if (!base64 || base64 === "") {
      throw "File is empty!";
    }
    console.log(`Encoded file: ${base64}`); // Log base64
    const fileName = filePath.split("/").pop(); // Get fileName from filePath
    media = `data:application/pdf;name=${fileName};base64,${base64}`;
    const options = {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to,
        media,
        mime_type: "application/pdf",
        filename: fileName,
      }),
    };
    const url = "https://gate.whapi.cloud/messages/document";
    const response = await fetch(url, options);
    return response.status;
  }

  async sendPdfViaId(mediaId: string, fileName: string, to: string) {
    const media = mediaId;
    const options = {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to,
        media,
        mime_type: "application/pdf",
        filename: fileName,
      }),
    };
    const url = "https://gate.whapi.cloud/messages/document";
    const response = await fetch(url, options);
    return response.status;
  }

  async uploadMedia(filePath: string): Promise<string> {
    const base64 = fs.readFileSync(filePath, "base64"); // file to base64
    const fileName = filePath.split("/").pop(); // get file name from file path
    if (!base64 || base64 === "") {
      throw "File is empty!";
    }
    // console.log(`Encoded file: ${base64}`); // Log base64
    const body = `data:application/pdf;name=${fileName};base64,${base64}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/pdf",
        authorization: `Bearer ${this.token}`,
      },
      body,
    };
  
    const responseRaw = await fetch("https://gate.whapi.cloud/media", options); // get response from api
    const response = await responseRaw.json(); // convert response to json
    return response.media[0].id; // return mediaId
  }
}
