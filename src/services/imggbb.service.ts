const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const imgbbService = {
  upload: async (imageBase64: string) => {
    const formData = new FormData();
    formData.append("image", imageBase64);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const ret = await response.json();
    const data = ret.data;
    console.log('uploaded img', data);
    return data
  },
};


export default imgbbService;