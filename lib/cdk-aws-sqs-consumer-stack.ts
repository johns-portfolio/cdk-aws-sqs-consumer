import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Effect } from 'aws-cdk-lib/aws-iam'
import * as events from 'aws-cdk-lib/aws-lambda-event-sources'

export class CdkAwsSqsConsumerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here

    const queue = new sqs.Queue(this, 'UserLoginQueue')

    const bucket = new s3.Bucket(this, 'UsersBucket')

    const topic = new sns.Topic(this, 'UserInfoTopic')

    const fn = new lambda.Function(this, 'UserConsumerFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, 'consumer')),
      environment: {
        ENV: 'PROD',
        LOGIN_QUEUE_URL: queue.queueUrl,
        USER_BUCKET: bucket.bucketName,
        USER_INFO_TOPIC_ARN: topic.topicArn
      }
    })
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['sqs:*', 's3:*', 'sns:*'],
        effect: Effect.ALLOW,
        resources: ['*']
      })
    )

    const LambdaEventSource = new events.SqsEventSource(queue, {
      batchSize: 1
    });
    fn.addEventSource(LambdaEventSource);
  }
}
