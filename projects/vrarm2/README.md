# Uniformne Rozhranie pre experiment

### __Komunikačný diagram modulov VRArm__

![alt text](https://cdn.glitch.com/f746543c-47b4-47ec-9167-8a28212e06ed%2FVrarmkomunikacnyDiagram.png?v=1602099726261)


```
import requests

url = "http://192.168.10.105/api/holographic/input/keyboard/text"

querystring = {"text":"h"}

headers = {
    'cache-control': "no-cache",
    'Postman-Token': "e37f1b09-77d0-49eb-afdd-301ea3bc211c"
    }

response = requests.request("POST", url, headers=headers, params=querystring)

print(response.text)
```
