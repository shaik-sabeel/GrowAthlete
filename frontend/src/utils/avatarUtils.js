export const getFallbackAvatar = (gender) => {
    const maleAvatars = [
        "https://img.freepik.com/free-psd/3d-illustration-business-man-with-glasses_23-2149436194.jpg",
        "https://img.freepik.com/free-psd/3d-illustration-bald-person-with-glasses_23-2149436184.jpg",
        "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    ];

    const femaleAvatars = [
        "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg",
        "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg",
        "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
    ];

    const randomAvatars = [
        "https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611734.jpg",
        "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg",
        "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg",
        "https://api.dicebear.com/7.x/bottts/svg?seed=Pepper"
    ];

    if (gender && gender.toLowerCase() === 'male') {
        return maleAvatars[Math.floor(Math.random() * maleAvatars.length)];
    } else if (gender && gender.toLowerCase() === 'female') {
        return femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)];
    } else {
        // Combine all for random choice if gender is unknown or 'other'
        const allAvatars = [...maleAvatars, ...femaleAvatars, ...randomAvatars];
        return allAvatars[Math.floor(Math.random() * allAvatars.length)];
    }
};
