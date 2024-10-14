import mongoose, { Schema, Document, model } from "mongoose";

export interface ActivityLogDocument extends Document {
  action: string;
  timestamp: Date;
  userId: mongoose.Types.ObjectId;
}

const ActivityLogSchema = new Schema<ActivityLogDocument>({
  action: {
    type: String,
    required: [true, "Action is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ActivityLog = mongoose.models?.ActivityLog || model<ActivityLogDocument>("ActivityLog", ActivityLogSchema);
export default ActivityLog;
