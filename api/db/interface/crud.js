import mongoose, {Schema,} from 'mongoose'

export default mongoose
export {Schema,}

export const crud = (add) => {
  const schema = new Schema({
    'createdAt': {
      'type':     Date,
      'required': true,
    },
    'updatedAt': {
      'type':     Date,
      'required': true,
    },
    'createdBy': {
      'type':     Schema.Types.ObjectId,
      'ref':      'User',
      'required': true,
    },
    'updatedBy': {
      'type':     Schema.Types.ObjectId,
      'ref':      'User',
      'required': true,
    },
    'display': {
      'type':     String,
      'required': true,
    },
  })

  if (add) {
    schema.add(add)
  }

  return schema
}
