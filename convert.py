import os
import mammoth

pustaka_dir = "Pustaka"

for root, dirs, files in os.walk(pustaka_dir):
    for file in files:
        if file.endswith(".docx") and not file.startswith("~$"):
            docx_path = os.path.join(root, file)
            html_path = os.path.splitext(docx_path)[0] + ".html"
            
            print(f"Mengonversi: {file} -> HTML")
            with open(docx_path, "rb") as docx_file:
                result = mammoth.convert_to_html(docx_file)
                html_content = result.value
                
            with open(html_path, "w", encoding="utf-8") as html_file:
                html_file.write(html_content)

print("Selesai! Semua file docx berhasil diubah ke html.")
