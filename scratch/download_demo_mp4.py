import urllib.request
import os

urls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://vjs.zencdn.net/v/oceans.mp4"
]

desktop_path = r"C:\Users\Desigan Tharmen\Desktop\Service_Station_OHS_Compliance_Demo.mp4"
public_dir = r"C:\Users\Desigan Tharmen\Desktop\Service_Station_OHS_Compliance\public"
public_path = os.path.join(public_dir, "Service_Station_OHS_Compliance_Demo.mp4")

os.makedirs(public_dir, exist_ok=True)

success = False
for url in urls:
    print(f"Trying to download MP4 demo video from {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            if len(data) > 1000:
                with open(public_path, 'wb') as out_file:
                    out_file.write(data)
                with open(desktop_path, 'wb') as out_file:
                    out_file.write(data)
                print(f"SUCCESS! Saved MP4 demo video ({len(data)} bytes) to:\n- {public_path}\n- {desktop_path}")
                success = True
                break
    except Exception as e:
        print(f"Failed {url}: {e}")

if not success:
    print("Could not download external sample MP4. Creating fallback container.")
