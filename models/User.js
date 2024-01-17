import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "root",
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
    throw new Error("Falló la opercaión del hash");
  }
});
UserSchema.methods.comparePass = async function (clientPass) {
  return await bcrypt.compare(clientPass, this.password);
};
const User = mongoose.model("User", UserSchema);
export default User;
