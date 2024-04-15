const API_URL = "http://localhost:8080/api/v1/contacts";

const contactApi = {
  getAllContact: async (access_token) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed!");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },
};

export default contactApi;