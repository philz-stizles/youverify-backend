import { Schema, Model, model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// Create an interface.
interface TransactionAttrs {
  customerId: string
  productId: string
  price: number
}

// An interface that describes the properties that a Transaction Document has
interface TransactionDocument extends Document {
  customerId: string
  productId: string
  price: number
  version: number
  createdAt: string
}

// An interface that describes the properties that a Transaction Model has
interface TransactionModel extends Model<TransactionDocument> {
  build(attrs: TransactionAttrs): TransactionDocument
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const transactionSchema = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

transactionSchema.set('versionKey', 'version')
transactionSchema.plugin(updateIfCurrentPlugin)

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs)
}

// Create a Model.
const Transaction = model<TransactionDocument, TransactionModel>(
  'Transaction',
  transactionSchema
)

export default Transaction
