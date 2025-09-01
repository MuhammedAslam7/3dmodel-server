import type { Request, Response } from "express";
import { Readable } from "stream";
import cloudinary from "./utils/cloudinary.js";
import { Model } from "./model.js";

export const uploadModel = async (req: Request, res: Response) => {
  try {
    console.log(req.body.name)

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (buffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "glb_models" },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );

        const readable = new Readable();
        readable._read = () => {};
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
      });
    };
    const url = await streamUpload(req.file.buffer);
    console.log(url);

    await Model.create({
      name:req.body.name,
      fileUrl: url
    })

    res.json({
      message: "File received successfully",
      name: req.body.name,
      filename: req.file.originalname,
      size: req.file.size,
      url: url,
    });
  } catch (error) {
    console.log(error);
  }
};

export const allModels = async(req: Request, res: Response) => {
  try {
    const models = await Model.find()
    console.log(models)
    res.status(200).json(models)
    
  } catch (error) {
    console.log(error)
  }
}
