"""POST /contact - validates the form, rate-limits, and emails the owner via SES."""
import json
import os
import re
import time

import boto3
from botocore.exceptions import ClientError

table = boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
ses = boto3.client("ses")

OWNER = os.environ["OWNER_EMAIL"]
HOURLY_LIMIT = int(os.environ.get("HOURLY_LIMIT", "20"))
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
TOPICS_MAX = 100


def _resp(status, body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def _clean(value, limit, single_line=True):
    value = value.strip() if isinstance(value, str) else ""
    # strip control characters; single-line fields (name, email, topic) also lose newlines
    pattern = r"[\x00-\x1f\x7f]" if single_line else r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]"
    return re.sub(pattern, " " if single_line else "", value)[:limit].strip()


def _within_limit():
    """Global cap per clock hour, kept in DynamoDB with a TTL so rows clean themselves up."""
    hour = int(time.time() // 3600)
    try:
        table.update_item(
            Key={"pk": f"contact#{hour}"},
            UpdateExpression="ADD #c :one SET expires_at = :ttl",
            ConditionExpression="attribute_not_exists(#c) OR #c < :max",
            ExpressionAttributeNames={"#c": "count"},
            ExpressionAttributeValues={
                ":one": 1,
                ":max": HOURLY_LIMIT,
                ":ttl": (hour + 2) * 3600,
            },
        )
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return False
        raise


def handler(event, context):
    try:
        data = json.loads(event.get("body") or "{}")
    except (TypeError, ValueError):
        return _resp(400, {"error": "bad_json"})
    if not isinstance(data, dict):
        return _resp(400, {"error": "bad_json"})

    # Honeypot: real visitors never fill this. Pretend success so bots learn nothing.
    if data.get("website"):
        return _resp(200, {"ok": True})

    name = _clean(data.get("name"), 100)
    email = _clean(data.get("email"), 200)
    topic = _clean(data.get("topic"), TOPICS_MAX) or "General"
    message = _clean(data.get("message"), 4000, single_line=False)

    if not name or not message or not EMAIL_RE.match(email):
        return _resp(400, {"error": "invalid_input"})

    if not _within_limit():
        return _resp(429, {"error": "rate_limited"})

    try:
        ses.send_email(
            Source=OWNER,
            Destination={"ToAddresses": [OWNER]},
            ReplyToAddresses=[email],
            Message={
                "Subject": {"Data": f"Portfolio enquiry: {topic}"[:200], "Charset": "UTF-8"},
                "Body": {
                    "Text": {
                        "Data": f"From: {name} <{email}>\nTopic: {topic}\n\n{message}\n",
                        "Charset": "UTF-8",
                    }
                },
            },
        )
    except ClientError as e:
        print("SES error:", e.response["Error"]["Code"])
        return _resp(502, {"error": "send_failed"})

    return _resp(200, {"ok": True})
