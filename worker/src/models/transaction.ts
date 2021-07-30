import { Schema, Model, model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// Create an interface.
interface TransactionAttrs {
  transactionRef: string
  orderId: string
  customerId: string
  productId: string
  totalAmount: number
}

// An interface that describes the properties that a Transaction Document has
interface TransactionDocument extends Document {
  transactionRef: string
  orderId: string
  customerId: string
  productId: string
  totalAmount: number
  createdAt: string
}

// An interface that describes the properties that a Transaction Model has
interface TransactionModel extends Model<TransactionDocument> {
  build(attrs: TransactionAttrs): TransactionDocument
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const transactionSchema = new Schema(
  {
    transactionRef: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    totalAmount: {
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
