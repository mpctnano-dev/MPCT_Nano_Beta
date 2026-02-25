import os
import glob
import re

mapping = {
    "1.jpg": "lab_instructor.jpg",
    "2.jpg": "engineering_building.jpg",
    "3.jpg": "lab_services.jpg",
    "3D.png": "3d_printer.png",
    "4.jpg": "electronics_students.jpg",
    "5.jpg": "campus_gathering.jpg",
    "6.jpg": "computer_lab.jpg",
    "7.jpg": "drone_engineering.jpg",
    "8.jpg": "auditorium_audience.jpg",
    "9.jpg": "north_valley_campus.jpg",
    "10.jpg": "industrial_lab.jpg",
    "11.jpg": "robotics_testing.jpg",
    "12.jpg": "mechanic_student.jpg",
    "13.jpg": "processing_lab.jpg",
    "14.jpg": "flagstaff_campus.jpg",
    "15.jpg": "engineering_lab_hero.jpg",
    "16.jpg": "cleanroom_technician.jpg",
    "17.jpg": "modern_building.jpg",
    "18.jpg": "microscopy_lab.jpg",
    "19.jpg": "nano_fabrication.jpg",
    "20.jpg": "microscope_stage.jpg",
    "21.jpg": "dark_room.jpg",
    "22.jpg": "sem_workstation.jpg",
    "23.jpg": "using_microscope.jpg",
    "89.jpg": "precision_assembly.jpg",
    "99.jpg": "group_instruction.jpg",
    "123.jpg": "atomic_force_microscope.jpg",
    "124.jpg": "drone_repair.jpg",
    "154.jpg": "technical_project.jpg",
    "165.jpg": "laser_optics.jpg",
    "1234.jpg": "part_inspection.jpg"
}

project_dir = "/Users/akhilkinnera/Downloads/Before_Merge/MPCT_Nano_Beta"
images_dir = os.path.join(project_dir, "Images")

print("--- Renaming Physical Files ---")
for old, new in mapping.items():
    old_path = os.path.join(images_dir, old)
    new_path = os.path.join(images_dir, new)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"Renamed: {old} -> {new}")
    else:
        print(f"File not found, skipping rename: {old}")

print("\n--- Updating Codebase References ---")
extensions = ["**/*.html", "**/*.css", "**/*.js"]
files = []
for ext in extensions:
    files.extend(glob.glob(os.path.join(project_dir, ext), recursive=True))

for filepath in files:
    if os.path.isdir(filepath):
        continue
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = content
        for old, new in mapping.items():
            pattern = re.compile(rf"(?i)images[\\/]{re.escape(old)}")
            new_content = pattern.sub(f"Images/{new}", new_content)
            pattern_url = re.compile(rf"(?i)images%2f{re.escape(old)}")
            new_content = pattern_url.sub(f"Images%2F{new}", new_content)
            
        if content != new_content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated references in: {os.path.relpath(filepath, project_dir)}")
    except Exception as e:
        pass

print("Done.")
