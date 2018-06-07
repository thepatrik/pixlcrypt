import json
import awslambda
from dotenv import load_dotenv

def main():
    load_dotenv(dotenv_path='./.env', verbose=True, override=True)
    with open("lambda_event.json", "r") as lambda_file:
        data = lambda_file.read()
        jsonData = json.loads(data)
        awslambda.handler(jsonData, None, False)

if __name__ == "__main__":
    main()
