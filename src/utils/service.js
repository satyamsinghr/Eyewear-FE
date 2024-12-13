// service.js
export const handleSignOut =(navigate) => {
        navigate("/");
        localStorage.clear();
        localStorage.removeItem("selectedLensCollectionId");
        localStorage.removeItem("collId");
};
