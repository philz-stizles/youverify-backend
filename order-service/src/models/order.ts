import { Schema, Model, model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@devdezyn/common'

// Create an interface.
interface OrderAttrs {
  status: OrderStatus
  customerId: string
  productId: string
  price: number
}

// An interface that describes the properties that a Order Document has
interface OrderDocument extends Document {
  status: OrderStatus
  customerId: string
  productId: string
  price: number
  version: number
  createdAt: string
}

// An interface that describes the properties that a Order Model has
interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

// Without the mongoose-update-if-current
// orderSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   };

//   done();
// });

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

// Create a Model.
const Order = model<OrderDocument, OrderModel>('Order', orderSchema)

export { OrderStatus }
export default Order
