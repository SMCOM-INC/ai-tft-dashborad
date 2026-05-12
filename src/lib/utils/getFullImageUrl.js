const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return `${import.meta.env.VITE_S3_URL}${imageUrl}`;
};

export default getFullImageUrl;
