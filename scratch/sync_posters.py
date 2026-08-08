import os
import shutil

src_dir = r"C:\Users\Desigan Tharmen\Desktop\SERV STATION TRAINING IMAGES"
dest_dir = r"C:\Users\Desigan Tharmen\Desktop\Service_Station_OHS_Compliance\public\assets\posters"

os.makedirs(dest_dir, exist_ok=True)

files = [f for f in os.listdir(src_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

print(f"Found {len(files)} image files in {src_dir}")

# Copy all original files into posters folder
for f in files:
    src_file = os.path.join(src_dir, f)
    # Clean filename for web serving
    clean_name = f.replace(" ", "_").replace("(", "").replace(")", "").replace(",", "")
    dest_file = os.path.join(dest_dir, clean_name)
    shutil.copy2(src_file, dest_file)

# Pick representative poster images for key modules
png_files = [f for f in files if f.endswith('.png')]

mapping = {
    "spill_response_poster.png": png_files[0] if len(png_files) > 0 else files[0],
    "evacuation_poster.png": png_files[1] if len(png_files) > 1 else files[0],
    "customer_service_poster.png": png_files[2] if len(png_files) > 2 else files[0],
    "statutory_rights_poster.png": png_files[3] if len(png_files) > 3 else files[0],
    "pass_firefighting_poster.png": png_files[4] if len(png_files) > 4 else files[0],
    "first_responder_poster.png": png_files[5] if len(png_files) > 5 else files[0],
}

for target, src_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, target)
    shutil.copy2(src_path, dest_path)
    print(f"Mapped {target} <- {src_name}")

print(f"Successfully synced poster assets to {dest_dir}")
