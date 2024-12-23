import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Definición del esquema de usuario
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Por defecto, la cuenta no está verificada
    },
    image: {
      type: String,
      required: true,
      default:
        "https://i.pinimg.com/1200x/b5/12/68/b5126803cf115b044849b64ca565a4a7.jpg",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Rol con valor predeterminado 'user'
  },
  { timestamps: true }
);

// Hashear la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar contraseñas
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
