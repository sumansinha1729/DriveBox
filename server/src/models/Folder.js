import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
  },
  { timestamps: true }
);

folderSchema.index({ name: 1, owner: 1, parent: 1 }, { unique: true });

export default mongoose.model("Folder", folderSchema);
