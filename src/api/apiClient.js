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
      },
    });
    const wishReq = await axios.get(`${API}/wish?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const serverWish = wishReq?.data;

    const serverCart = req?.data;

    for (const item of guestCart) {
      const {productId, ...rest} = item;

      const existItem = serverCart.find(
        (serverItem) => String(serverItem.productId) === String(productId),
      );

      const existItemWish = serverWish.find(
        (serverItem) => String(serverItem.productId) === String(productId),
      );

      if (existItem && item.inStock) {
        await axios.patch(
          `${API}/cart/${existItem.id}`,
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
            productId: item.productId,
            wish: item.wish
              ? item?.wish
              : existItemWish?.wish
                ? existItemWish?.wish
                : false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else if (!existItem && item.inStock) {
        await axios.post(
          `${API}/cart`,
          {
            userId: Number(userId) || userId,
            id: null,
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
            productId: item.productId,
            wish: item?.wish
              ? item?.wish
              : existItemWish?.wish
                ? existItemWish?.wish
                : false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      if (item?.wish && existItemWish) {
        await axios.patch(
          `${API}/wish/${existItemWish.id}`,
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
            productId: item.productId,
            wish: item.wish,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else if (item?.wish && !existItemWish) {
        await axios.post(
          `${API}/wish`,
          {
            userId: Number(userId) || userId,
            id: null,
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
            productId: item.productId,
            wish: item?.wish,
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

export const checkUserId = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken || refreshToken == "undefined") {
    return false;
  }

  if (refreshToken) {
    try {
      const deHas = atob(refreshToken);
      const [email, password] = deHas.split(":");

      const req = await axios.post(`http://localhost:4000/login`, {
        password,
        email,
      });

      const newAccessToken = req.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);

      return req.data.user.id;
    } catch (err) {
      return false;
    }
  }
};
