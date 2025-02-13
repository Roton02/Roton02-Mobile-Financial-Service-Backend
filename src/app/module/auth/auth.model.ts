import { model, Schema } from 'mongoose'
import { IUser } from './auth.interface'
import config from '../../config'
import bcrypt from 'bcryptjs'

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    pin: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5,
    }, // 5 digit PIN
    mobile: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
    balance: { type: Number, default: 0 },
    email: { type: String, required: true, unique: true, trim: true },
    accountType: { type: String, enum: ['Agent', 'User'], required: true }, // Dropdown with fixed values
    nid: { type: String, required: true, unique: true, trim: true }, // National ID (Unique)
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  const salt_round = Number(config.BCRYPT_SALT)
  this.pin = await bcrypt.hash(this.pin, salt_round)
  next()
})

// Hide password after saving
userSchema.post('save', function (doc, next) {
  doc.pin = ''
  next()
})

export const user = model<IUser>('user', userSchema)
