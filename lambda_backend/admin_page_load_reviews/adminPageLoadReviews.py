import base64
import json
import os
import boto3

def decode_base64_url(data):
    """Add padding to the input and decode base64 url"""
    missing_padding = len(data) % 4
    if missing_padding:
        data += '=' * (4 - missing_padding)
    return base64.urlsafe_b64decode(data)

def decode_jwt(token):
    """Split the token and decode each part"""
    parts = token.split('.')
    if len(parts) != 3:  # a valid JWT has 3 parts
        raise ValueError('Token is not valid')

    header = decode_base64_url(parts[0])
    payload = decode_base64_url(parts[1])
    signature = decode_base64_url(parts[2])

    return json.loads(payload)
    
def trimmed_foldername(full_folderpath):
    return os.path.basename(os.path.normpath(full_folderpath))

def list_subfolders(bucket_name, prefix):
    
    s3 = boto3.client('s3')
    response = s3.list_objects_v2(Bucket=bucket_name, Delimiter='/', Prefix=prefix)
    subfolders = []

    for content in response.get('CommonPrefixes', []):
        folder_name = trimmed_foldername(content.get('Prefix'))
        if folder_name != 'archive':
            subfolders.append(folder_name)
    return subfolders

def list_items(bucket_name, prefix):
    s3 = boto3.client('s3')
    response = s3.list_objects_v2(Bucket=bucket_name, Delimiter='/', Prefix=prefix)
    files = ''

    for content in response.get('Contents', []):
        if content.get('Key').endswith('.json'):
            files += content.get('Key')+'\n'
            
    return files

def lambda_handler(event, context):
    bucket_name = os.environ['bucket_name']
    
    # Let's extract the business name from the token by looking at the group memebership of the user
    token = event['headers']['Authorization']
    decoded = decode_jwt(token)
    prefix = event["queryStringParameters"]['prefix']
    
    if not prefix.endswith('/'):
        prefix += '/'
    
    parts = prefix.split('/')
    if len(parts) == 2:
        data = list_subfolders(bucket_name, prefix)
    elif len(parts) == 3:
        data = list_items(bucket_name, prefix)
    else:
        raise ValueError('prefix is not valid')

    result = {
        "data": data
        }
        
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "https://admin.shoutavouch.com",
            "Access-Control-Allow-Methods": "OPTIONS,PUT,POST,GET"
    },    
        'body': json.dumps(result)
    } 