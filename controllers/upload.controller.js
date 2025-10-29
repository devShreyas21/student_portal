export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // return file path or URL
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: "File uploaded successfully", filePath });
};
