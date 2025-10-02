import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Get AWS configuration
const config = new pulumi.Config();
const awsConfig = new pulumi.Config("aws");
const region = awsConfig.require("region");


const securityGroup = new aws.ec2.SecurityGroup("web-secgrp", {
  description: "Enable SSH and HTTP access",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 22,
      toPort: 22,
      cidrBlocks: ["0.0.0.0/0"],
    }, // SSH

    {
      protocol: "tcp",
      fromPort: 80,
      toPort: 80,
      cidrBlocks: ["0.0.0.0/0"],
    }, // HTTP
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ], // Allow all outbound traffic
});

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
