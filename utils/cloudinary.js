import { v2 as cloudinary } from "cloudinary";
import { fs } from "fs";

cloudinary.config({
    cloud_name: 'drujwhndz',
    api_key: '473926636931857',
    api_secret: '***************************'
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return res.status(400).json({ message: "No file path available" })
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        })
        console.log(response)
        console.log(response.url)
        // return res.status(200).json({ message: "File is uploaded on cloudinary", response })
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw new Error(error)
    }
}


export { uploadOnCloudinary };
