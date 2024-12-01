import axios from "axios";

export async function checkCluster(image: string) {
    try {
        const response = await axios.post('https://embed-api-flask-production.up.railway.app/process', 
            {
                image_string: image
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}