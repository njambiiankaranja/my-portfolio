import json
import os
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('DYNAMODB_TABLE')
table = dynamodb.Table(table_name)


def handler(event, context):
    for record in event['Records']:
        message_body = record['body']
        message_id = record['messageId']

        item = {
            'id': message_id,
            'payload': message_body,
            'status': 'PROCESSED'
        }

        # Messages that come from S3 describe an uploaded file.
        # Messages sent to the queue by hand are plain text, so ignore parse errors.
        try:
            body = json.loads(message_body)
        except ValueError:
            body = None

        if isinstance(body, dict) and body.get('Event') == 's3:TestEvent':
            # S3 sends this once when the notification is first set up. Nothing to store.
            print("Skipping S3 test event")
            continue

        if isinstance(body, dict) and 'Records' in body:
            s3_info = body['Records'][0].get('s3', {})
            item['bucket'] = s3_info.get('bucket', {}).get('name', '')
            item['key'] = s3_info.get('object', {}).get('key', '')
            item['source'] = 's3'

        table.put_item(Item=item)
        print(f"Successfully processed message {message_id}")

    return {
        'statusCode': 200,
        'body': json.dumps('Event processing complete')
    }
