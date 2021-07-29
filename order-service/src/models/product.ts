import { Document, Model, Schema, model } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import Order, { OrderStatus } from './order'

interface ProductAttrs {
  id: string
  title: string
  price: number
}

export interface ProductDocument extends Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface ProductModel extends Model<ProductDocument> {
  build(attrs: ProductAttrs): ProductDocument
  findByIdAndPrevEvent(event: {
    id: string
    version: number
  }): Promise<ProductDocument | null>
}

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

productSchema.set('versionKey', 'version')
productSchema.plugin(updateIfCurrentPlugin)

// Without the mongoose-update-if-current
// productSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   };

//   done();
// });

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

productSchema.statics.findByIdAndPrevEvent = (event: {
  id: string
  version: number
}) => {
  return Product.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

productSchema.methods.isReserved = async function () {
  // Make sure the product is not already reserved
  // Run query to look at all orders. Find an order where the product
  // is the product we just found *and* the orders status is *not* cancelled.
  // If we find an order from that means the product *is* reserved
  // this === the product document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    product: this as ProductDocument,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

const Product = model<ProductDocument, ProductModel>('Product', productSchema)

export default Product
