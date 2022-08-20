# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

# Setup
```
npm install -g aws-cdk
cdk init --language typescript
npx cdk diff --profile cpnassignment --toolkit-stack-name cdk-aws-sqs-consumer-stack
```

# Deploy
```
npx cdk bootstrap --profile cpnassignment
npx cdk deploy --profile cpnassignment
```
