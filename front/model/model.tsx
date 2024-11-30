import { Schema, model, models } from 'mongoose'

const ImageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Image = models.Image || model('Image', ImageSchema);

export default Image;