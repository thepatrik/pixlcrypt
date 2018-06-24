import json
import awslambda
from dotenv import load_dotenv

def main():
    load_dotenv(dotenv_path='./.env', verbose=True, override=True)
    with open("lambda_event_1.json", "r") as lambda_file_1:
        data = lambda_file_1.read()
        jsonData = json.loads(data)
        awslambda.handler(jsonData, None, False)

    with open("lambda_event_2.json", "r") as lambda_file_2:
        data = lambda_file_2.read()
        jsonData = json.loads(data)
        awslambda.handler(jsonData, None, False)

if __name__ == "__main__":
    main()
