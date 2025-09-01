import { Schema, model, Document } from "mongoose";

export interface Model3D extends Document {
    name: string,
    fileUrl: string
}

const modelSchema = new Schema<Model3D>(
    {
        name: {type: String, required: true},
        fileUrl: {type: String, required: true}
    }, {timestamps: true}
)

export const Model = model<Model3D>("model", modelSchema)