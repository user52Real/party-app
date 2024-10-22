import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface PartyDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  date: Date;
  guests: number;
  budget: number;
  location?: string;
  userId: mongoose.Types.ObjectId; 
  guestList: {
    name: string;
    email: string;
    status: string;
  }[]
}

const PartySchema = new Schema<PartyDocument>({
  name: {
    type: String,
    required: [true, "Party name is required"],
  },
  date: {
    type: Date,
    required: [true, "Party date is required"],
  },
  guests: {
    type: Number,
    default: 0,
  },
  budget: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: "", 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  guestList: [{ 
    name: String,
    email: String,
    status: String
  }],
});

const Party = mongoose.models.Party || model<PartyDocument>("Party", PartySchema);
export default Party;
