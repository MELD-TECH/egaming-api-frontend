import {UploadRequest} from "./models.ts";

export async function getBase64Image(file: File): Promise<UploadRequest> {
    return await convertToBase64Image(file).then((data) => {
        return { base64Image: data, resourceType: 'image'};
    });
}

// An async function to use the result
async function convertToBase64Image(file: File): Promise<string> {
    try {
        return await readFileAsDataURL(file);
    } catch (error) {
            console.error("Error reading the file:", error);
            return '';
    }
}

// A helper function that returns a Promise for the file read operation
function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            // @ts-ignore
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}