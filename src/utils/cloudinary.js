import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 

const uploadOnCloudinary = async () => {
    try{
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        }); 
        // its better to console the whole response for better study of the data
        // file  has been uoloaded successfully
        // console.log('file is uploaded on cloudinary', response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }
