import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
const bucket = new aws.s3.Bucket("react-app-bucket", {
  website: {
    indexDocument: "index.html",
  },
});
// Allow public read access
new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: bucket.id,
  policy: bucket.id.apply((id) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${id}/*`],
        },
      ],
    })
  ),
});
export const bucketName = bucket.id;
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
