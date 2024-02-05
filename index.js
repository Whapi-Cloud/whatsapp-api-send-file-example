const fs = require("fs");
const PDFDocument = require("pdfkit");
const ChannelApi = require("./core/channel").Channel;

const filePath = "output.pdf"; // FIle path
const token = "YOUR TOKEN"; // Channel token
const phone = "PHONE FOR SENDING FILE"; // Phone for sending
const data = "Data"; // Data for sending
const fileName = filePath.split("/").pop(); // Get file name from file path. Or set your file name (via media id only)

const generatePDF = (data) => {
  const doc = new PDFDocument();
  const stream = doc.pipe(fs.createWriteStream(filePath));
  doc.text("Generated PDF with Data: " + JSON.stringify(data));
  doc.end();
  const promise = new Promise((resolve) => {
    stream.on("finish", () => {
      resolve();
    });
  });
  console.log("File is created");
  return promise;
}; // generate pdf from data

async function start() {
  try {
    if (!fs.existsSync(filePath)) await generatePDF(data);
    const channel = new ChannelApi(token);
    await channel.checkHealth();

    // const mediaId = await channel.uploadMedia(filePath); // upload media to api
    // console.log("Media id: ", mediaId)
    // const status = await channel.sendPdfViaId(mediaId, fileName, phone) // send file via media id 

    const status = await channel.sendLocalPdf(filePath, phone)
    console.log(status); // if 200 - OK
  } catch (e) {
    console.log(e)
  }
}
start().then();
