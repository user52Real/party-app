import mongoose, { Schema, Document, model } from "mongoose";

export interface GuestDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  partyId: mongoose.Types.ObjectId; 
}

const GuestSchema = new Schema<GuestDocument>({
  name: {
    type: String,
    required: [true, "Guest name is required"],
  },
  email: {
    type: String,
    required: [true, "Guest email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  phone: String,
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
  },
});

const Guest = mongoose.models?.Guest || model<GuestDocument>("Guest", GuestSchema);
export default Guest;
