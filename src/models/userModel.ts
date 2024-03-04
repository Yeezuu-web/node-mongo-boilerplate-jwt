import jwt from 'jsonwebtoken';
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const emailRegexPattern: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
  username: string;
  password?: string;
  email: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ coursesId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'The username field cannot be empty.'],
    },
    password: {
      type: String,
      required: [true, 'The password field cannot be empty.'],
      minlength: [8, 'The password must contain at least 8 characters.'],
      select: false,
    },
    email: {
      type: String,
      match: [emailRegexPattern, 'Please enter a valid e-mail address'],
      required: [true, 'The email field cannot be empty.'],
      unique: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: { type: String, default: 'user' },
    isVerified: { type: Boolean, default: false },
    courses: [
      {
        coursesId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Sign access token
userSchema.methods.SignAccessToken = function () {
  const payload = {
    sub: this._id, // subject - it should be unique identifier of user
    username: this.username,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || '');
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  const payload = {
    sub: this._id, // subject - it should be unique identifier of user
    username: this.username,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || '');
};

const userModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default userModel;
