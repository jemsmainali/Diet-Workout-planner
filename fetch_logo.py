import urllib.request
import ssl

context = ssl._create_unverified_context()
req = urllib.request.Request(
    'https://media.istockphoto.com/id/1397734203/vector/couple-fitness-logo-vector.jpg', 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req, context=context) as response, open(r'C:\Users\Dell\Desktop\gym_diet_planner\frontend\public\images\gym_logo.jpg', 'wb') as out_file:
        out_file.write(response.read())
    print("Logo downloaded successfully.")
except Exception as e:
    print(f"Failed to download logo: {e}")
