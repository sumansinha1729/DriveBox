import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    folder: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

imageSchema.index({ name: "text" });

export default mongoose.model("Image", imageSchema);
