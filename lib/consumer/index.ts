import * as AWS from 'aws-sdk'

async function main(event: any) {
  const eventBody = event.Records[0].body
  console.log('🔥 eventBody', eventBody)
  const s3 = new AWS.S3()
  const sns = new AWS.SNS()

  const userLogin = JSON.parse(eventBody)

  // Get data from S3
  try {
    const s3Response = await s3
      .getObject({
        Bucket: process.env.USER_BUCKET!,
        Key: userLogin.username
      })
      .promise()

    const text = s3Response.Body?.toString()
    const userInfo = JSON.parse(text!)
    console.log('🔥 userInfo', userInfo)
    const message = { ...userLogin, ...userInfo }
    console.log('🔥 message', message)

    // Publish data to SNS
    try {
      const result = await sns
        .publish({
          Message: JSON.stringify(message),
          TopicArn: process.env.USER_INFO_TOPIC_ARN
        })
        .promise()
      console.log('🔥 publish result', result)
    } catch (error) {
      console.log('🔥 publish error', error)
    }
  } catch (error) {
    console.log('🔥 getObject error', error)
  }
}

module.exports = { main }
