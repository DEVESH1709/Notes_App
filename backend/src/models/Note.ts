import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    userId : mongoose.Types.ObjectId;
    content : string ;
    createAt :Date;

}

const noteSchema : Schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }
}, {timestamps: true });

export default mongoose.model<INote>('Note', noteSchema);