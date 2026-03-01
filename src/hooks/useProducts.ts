import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchProductsByLocale,
  clearProducts,
  createProduct,
} from "../store/productsSlice";

export function useProducts(
  token: string | null,
  selectedLocale: { locale: string },
) {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.items);

  useEffect(() => {
    if (!token) return;
    const loadProducts = () => {
      dispatch(fetchProductsByLocale({ locale: selectedLocale.locale }));
    };
    loadProducts();
    const intervalId = setInterval(loadProducts, 15000);
    return () => clearInterval(intervalId);
  }, [token, selectedLocale, dispatch]);

  const clear = () => dispatch(clearProducts());

  const addProduct = async (name: string, price: number, currency: string) => {
    const result = await dispatch(
      createProduct({ name, price, currency, locale: selectedLocale.locale }),
    );
    if (createProduct.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  };

  return { products, clear, addProduct };
}
