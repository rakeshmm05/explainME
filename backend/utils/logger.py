import datetime
import json

def log_request(topic: str, explanations: dict):
    log_data = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "topic": topic,
        "explanations": explanations
    }

    with open("request_log.json", "a") as f:
        f.write(json.dumps(log_data) + "\n")
