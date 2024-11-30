'use server'

import Image from "../../model/model";
import connectDB from "../../config/connectMongo";

export const getImages = async () => {
    try {
        await connectDB();

        const image = await Image.find();
        if (!image.length) {
            console.log('No Images Found');
        } 

        return image.map(im => im.image);

    } catch (error) {
        console.error('Error Fetching Images:', error);
        return { errMsg: error };
    }
};
