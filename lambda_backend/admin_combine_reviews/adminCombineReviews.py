import boto3
import os
import json

def lambda_handler(event, context):
    # Initialize the AWS Lambda client
    lambda_client = boto3.client('lambda')
    prefix = event["queryStringParameters"]['prefix']
    bucket_name = os.environ['bucket_name']

    # Define the parameters for the second Lambda function
    function_name = 'combine_reviews'
    invocation_type = 'RequestResponse'  # Use 'Event' for asynchronous invocation

    payload = {
      "output_file_key": prefix,
      "input_file_prefix": prefix
    }

    try:
        # Invoke the second Lambda function
        response = lambda_client.invoke(
            FunctionName=function_name,
            InvocationType=invocation_type,
            Payload=json.dumps(payload)
        )
        
        # Parse and process the response from the second Lambda function
        response_payload = json.loads(response['Payload'].read().decode('utf-8'))
        file_name = response_payload['file_name']
        
        # Let's read the contents of the combined file
        s3_client = boto3.client('s3')
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        file_content = response['Body'].read()

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "https://admin.shoutavouch.com",
                "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
            },    
            'body': file_content
        } 
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "https://admin.shoutavouch.com",
                "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
        },
            'body': f'Error: {str(e)}'
        }
