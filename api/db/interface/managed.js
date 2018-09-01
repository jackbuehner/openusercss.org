import mongoose, {Schema,} from 'mongoose'

export default mongoose
export {Schema,}

export const managed = (add) => {
  const schema = new Schema({
    'createdAt': {
      'type':     Date,
      'required': true,
    },
    'updatedAt': {
      'type':     Date,
      'required': true,
    },
  })

  if (add) {
    schema.add(add)
  }

  return schema
}
