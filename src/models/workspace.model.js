import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      // URL o Base64
      type: String,
      required: true,
      default:
        "https://thumbs.dreamstime.com/b/hecho-con-ai-generativo-293025938.jpg",
    },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel", // Listado de Channel
        required: true,
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relación con el modelo User
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Relación con el modelo User
    },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
