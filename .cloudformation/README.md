# CloudFormation

This directory contains the Infrastructure as a Code to deploy the project on AWS, for a minimal cost (near $0).

> Note:
> It only works without SSL and doesn't generate the friendly DNS records. For that purpose, you need to set a CloudFront Distribution that points to the S3 bucket website link as a backend, and redirect all HTTP to HTTPS. You'll also need to generate a Public Hosted Zone and a A (and AAAA) Alias record pointing to the CloudFront distribution. To make SSL work correctly you'll also need to generate a certificate with ACM (Amazon Certificate Manager) and put it in the CloudFront distribution.

## Prequisite

To deploy this infrastructure, you'll prealably need to:
  * Set a GitHub Token with Read Only access to the repo
  * Have a AWS account with an IAM user (with your Access Key and Secret Key) having CloudFormation rights (at least)
  * Set a `incoming-webhook` in your Slack Team (and obviously have a Slack Team)

## Deploying to AWS

To deploy the CloudFormation Stack, I like to use a powerful tool which is [aws-shell](https://github.com/awslabs/aws-shell) which give an enhanced CLI for AWS.</br >
The command to deploy everything is (pretty long):

```
aws cloudformation deploy --template-file ci_infra.yml \
  --stack-name <your-stack-name> \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    GitHubRepo=vue-blog-demo \
    BuildBucket=<bucket-for-builds> \
    BucketName=<bucket-for-website-hosting> \
    CacheControlMaxAge=300 \
    GitHubUser=<github-user> \
    GitHubBranch=<your-branch> \
    GitHubToken=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
    SlackHook=xxxxxxx/xxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxx
```

This will create a CloudFormation Stack with the following resources:
  * **AWS::CodeBuild::Project**: a CodeBuild project to build the project (instructions in the `buildspec.yml` in root directory of this repo)
  * **AWS::IAM::Role**: a CodeBuild IAM role to make CodeDeploy able to execute itself (spawn a container and access to S3 build Bucket and S3 Website bucket)
  * **AWS::CodePipeline::Pipeline**: a CodePipeline pipeline to listen to any change in the GitHub repository and trigger the build
  * **AWS::IAM::Role**: a CodePipeline IAM role to make it able to call CodeBuild and push an artifact to the build bucket
  * **AWS::S3::Bucket**: 2 buckets, one for the website, an other to store the artifacts
  * **AWS::S3::BucketPolicy**: a bucket policy attached to the website bucket, to make it accessible to the whole world

## Update the Stack

To update the stack (if you make any change to it), just run the same command than for deploying without the parameters (if you don"t want to override any parameters):

```
aws cloudformation deploy --template-file ci_infra.yml \
  --stack-name <your-stack-name> \
  --capabilities CAPABILITY_NAMED_IAM
```
## Delete the Stack

Since everything is created with CloudFormation, you can delete every resources with one command, without forgeting any resources, avoiding aditional costs. The command is pretty simple:

```
aws cloudformation delete-stack --stack-name ci_infra.yml
```

That's all.
