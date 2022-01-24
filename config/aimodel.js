const { PredictionServiceClient } = require("@google-cloud/aiplatform");
const path = require("path");
const serviceKey = path.join(__dirname, `./${process.env.BUCKET_KEYFILE}`);
const client = new PredictionServiceClient({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID,
});
// const clientOptions = {
//     apiEndpoint:'us-central1-aiplatform-googleapis.com'
// };
// async function predictCustom(){
//     const endpoint = `projects/`
// }
console.log(client);
