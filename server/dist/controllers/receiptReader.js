import DocumentIntelligence, { getLongRunningPoller, isUnexpected } from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";
// import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.resolve(__dirname, "../img/receipt2.jpg");
// const buffer: Buffer = await fs.readFile(imagePath);
// const base64: string = buffer.toString("base64");
// set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
const key = process.env.AZURE_KEY;
const endpoint = process.env.AZURE_ENDPOINT;
// sample document
async function readReceipt(imageBuffer) {
    if (!key || !endpoint) {
        throw new Error('Missing Azure environment variables');
    }
    if (!imageBuffer) {
        throw new Error('Missing image');
    }
    const base64 = imageBuffer.toString('base64'); // Convert Base image object to base64
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
    const poller = await getLongRunningPoller(client, initialResponse);
    // const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;
    let analyzeResult;
    if ("pollUntilDone" in poller) {
        // checks when Azure Document Intelligence finishes analyzing image
        const result = await poller.pollUntilDone();
        analyzeResult = result.body.analyzeResult;
    }
    else {
        // It was already finished or returned the result directly
        analyzeResult = poller.body?.analyzeResult;
    }
    const documents = analyzeResult?.documents;
    const document = documents && documents[0];
    if (!document) {
        throw new Error("Expected at least one document in the result.");
    }
    return document;
    // const merchantName = document.fields.MerchantName;
    // const Items = document.fields.Items;
    // const Total = document.fields.Total;
    // console.log('Type:', document.docType);
    // console.log('Merchant:', merchantName && merchantName.valueString);
    // console.log('Items:');
    // for (const { valueObject: item } of (Items && Items.valueArray) || []) {
    //     console.log(item);
    // }
    // console.log('Total:', Total)
}
export default readReceipt;
// main().catch((error) => {
//     console.error("An error occurred:", error);
//     process.exit(1);
// });
//# sourceMappingURL=receiptReader.js.map