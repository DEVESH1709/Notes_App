import mongoose,{Document, Schema} from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; 
    email : string ;
    name: string ;
    dob:Date;
    otp?: string;
    otpExpiry?:Date;
    googleId? : string;
}

const userSchema : Schema =  new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String,required: true },
  dob: { type: Date,required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  googleId: { type: String }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
