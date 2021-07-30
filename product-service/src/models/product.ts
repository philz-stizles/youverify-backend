import { Schema, Model, model, Document } from 'mongoose'
import slugify from 'slugify'

interface ProductAttrs {
  title: string
  description: string
  price: number
  quantity: number
  shipping: boolean
}

interface ProductDocument extends Document {
  title: string
  slug: string
  description: string
  price: number
  quantity: number
  sold: number
  shipping: boolean
}

interface ProductModel extends Model<ProductDocument> {
  build(attrs: ProductAttrs): ProductDocument
}

const productSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    sold: { type: Number, default: 0 },
    shipping: { type: Boolean, default: false },
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

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    title: attrs.title,
    description: attrs.description,
    price: attrs.price.toFixed(2),
    quantity: attrs.quantity,
    shipping: attrs.shipping,
  })
}

productSchema.pre('save', async function (done) {
  this.set('slug', slugify(this.get('title')))

  done()
})

const Product = model<ProductDocument, ProductModel>('Product', productSchema)

export default Product
