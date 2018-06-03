import json
import thumbs

def main():
    with open("lambda_event.json", "r") as lambda_file:
        data = lambda_file.read()
        jsonData = json.loads(data)
        thumbs.lambda_handler(jsonData, None)

if __name__ == "__main__":
    main()
