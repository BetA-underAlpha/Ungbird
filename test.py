import requests

req = requests.get('http://jin.rf.gd/meal.php?date=20180206')

html = req.text
header = req.headers
status = req.status_code
is_ok = req.ok

print(html)
print(header)
print(status)
print(is_ok)
