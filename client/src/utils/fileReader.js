export const getImageFromFile = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided.");
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export const handleImageChange = async (file, setImageSrc) => {
    if (file) {
        const imageUrl = await getImageFromFile(file);
        setImageSrc(imageUrl);
    } else setImageSrc(null);
};
