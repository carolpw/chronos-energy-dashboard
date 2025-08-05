import requests

response = requests.get("http://localhost:8000/forecast")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Data keys: {list(data.keys())}")
    print(f"Timestamps count: {len(data['timestamps'])}")
else:
    print(f"Error: {response.text}")
