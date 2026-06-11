import axios from "axios";

export const checkToken = async () => {
  const token = localStorage.getItem("refreshToken");
  
  if (!token || token === "undefined") {
    return false;
  }

  try {
    if (token) {
      try {        
        const deHash = atob(token);
        const [email, password] = deHash.split(":");
        const req = await axios.post("http://localhost:4000/login", {
          email,
          password,
        });
        
        const newAccessToken = req.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        return true;
      } catch (error) {                
        return false;
      }
    } else {            
      return false;
    }
  } catch (err) {    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return false;
  }
};

const API = "http://localhost:4000";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API}/login`, {email, password});

  if (response?.data?.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", btoa(`${email}:${password}`));
    localStorage.setItem("userId", response.data.user.id);
  }

  return response.data;
};

export const registerUser = async (email, password, name) => {
  const response = await axios.post(`${API}/register`, {email, password, name});
  console.log(response);
  
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", btoa(`${email}:${password}`));
    localStorage.setItem("userId", response.data.user.id);
  }

  return response.data;
};

export const mergeGuestCartToServer = async (userId) => {
  const guestCart = JSON.parse(localStorage.getItem("userCartProducts")) || [];
  const token = localStorage.getItem("accessToken");

  if (guestCart.length === 0) return;

  try {

    const req = await axios.get(`${API}/cart?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    const serverCart = req.data;


    for (const item of guestCart) {

      const {id, ...rest} = item;

      const existItem = serverCart.find(serverItem => String(serverItem.id) === String(id))

      if(existItem) {
        await axios.patch(`${API}/cart/${existItem.id}`, {
          userId: Number(userId) || userId,
          id: item.id,
          title: item.title,
          price: item.price,
          oldPrice: item.oldPrice,
          image: item.image,
          rating: item.rating,
          reviewCount: item.reviewCount,
          inStock: item.inStock,
          categoryId: item.categoryId,
          inStockCount: item.inStockCount,
          inShop: item.inShop,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }else {
        await axios.post(
        `${API}/cart`,
        {
          userId: Number(userId) || userId,
          id: item.id,
          title: item.title,
          price: item.price,
          oldPrice: item.oldPrice,
          image: item.image,
          rating: item.rating,
          reviewCount: item.reviewCount,
          inStock: item.inStock,
          categoryId: item.categoryId,
          inStockCount: item.inStockCount,
          inShop: item.inShop,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      }

      
    }

    localStorage.removeItem("userCartProducts");
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
