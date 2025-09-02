import type { Request, Response } from "express";
import { Readable } from "stream";
import cloudinary from "./utils/cloudinary.js";
import { Model } from "./model.js";

const formattedSize = (bytes: number): string => {
  if(bytes < 1024) return bytes + " B";
  if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(2)+ " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

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
    const size = formattedSize(req.file.size)
    console.log(url);
    console.log(size)

    await Model.create({
      name:req.body.name,
      fileUrl: url,
      fileSize: size
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

export const allModels = async(req: Request, res: Response): Promise<void> => {
  try {
    const models = await Model.find().sort({created: -1})

    // if(!models || models.length == 0) {
    //   res.status(404).json({message: "No Model found"})
    // }
    console.log(models)
    res.status(200).json(models)
    
  } catch (error: any) {
    console.error(error.mesage)
    res.status(500).json({error: error.message})
}
}

export const deleteModel = async(req: Request, res: Response) => {
  try {
    const {id} = req.body
       if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const deletedModel = await Model.findByIdAndDelete(id)
    res.status(200).json({message: "Model successfully deleted"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
  }
}
