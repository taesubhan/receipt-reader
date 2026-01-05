import DocumentIntelligence, { getLongRunningPoller, isUnexpected } from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";

// import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.resolve(__dirname, "../img/receipt2.jpg");

// set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
const key: string | undefined = process.env.AZURE_KEY;
const endpoint: string | undefined = process.env.AZURE_ENDPOINT;

// sample document

async function readReceipt(imageBuffer: Buffer) {
    if (!key || !endpoint) {
        throw new Error('Missing Azure environment variables');
    }
    if (!imageBuffer) {
        throw new Error('Missing image');
    }

    const base64: string = imageBuffer.toString('base64'); // Convert Base image object to base64
    const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));


    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-receipt")
      .post({
        contentType: "application/json",
        body: {
          base64Source: base64
        },
       });

    if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
    }

    if (initialResponse.status !== "202") {
        throw new Error(`Operation failed with status: ${initialResponse}`);
    }

    
    const poller: any = await getLongRunningPoller(client, initialResponse);
    // const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    let analyzeResult;
    if ("pollUntilDone" in poller) {
        // checks when Azure Document Intelligence finishes analyzing image
        const result = await poller.pollUntilDone();
        analyzeResult = result.body.analyzeResult;
    } else {
        // It was already finished or returned the result directly
        analyzeResult = (poller as any).body?.analyzeResult;
    }

    const documents = analyzeResult?.documents;

    const document = documents && documents[0];
    if (!document) {
        throw new Error("Expected at least one document in the result.");
    }

    return document;
}

export default readReceipt;

// main().catch((error) => {
//     console.error("An error occurred:", error);
//     process.exit(1);
// });