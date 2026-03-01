import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchPackagesByOwner,
  clearPackages,
  createPackageInDb,
  updatePackageInDb,
  deletePackageInDb,
} from "../store/packagesSlice";
import type { UserPackage } from "../types/package";

export function usePackages(
  token: string | null,
  authenticatedUser: string | null,
) {
  const dispatch = useDispatch<AppDispatch>();
  const packages = useSelector((state: RootState) => state.packages.items);

  useEffect(() => {
    if (!token || !authenticatedUser) return;
    const loadPackages = () => {
      dispatch(fetchPackagesByOwner({ ownerUsername: authenticatedUser }));
    };
    loadPackages();
    const intervalId = setInterval(loadPackages, 15000);
    return () => clearInterval(intervalId);
  }, [token, authenticatedUser, dispatch]);

  const clear = () => dispatch(clearPackages());

  const create = async (pkg: Omit<UserPackage, "id">) => {
    await dispatch(createPackageInDb(pkg)).unwrap();
  };

  const update = async (pkg: UserPackage) => {
    await dispatch(updatePackageInDb(pkg)).unwrap();
  };

  const remove = async (packageId: string) => {
    await dispatch(deletePackageInDb(packageId)).unwrap();
  };

  return { packages, clear, create, update, remove };
}
