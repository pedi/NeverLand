export interface SubCategory {
  id: string;
  name: string;
  deleted: boolean;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  deleted: boolean;
  subcategories: SubCategory[];
}

export interface ProductImage {
  url: string;
  contentType: string;
  thumbnailUrl: string;
}

export interface ProductModel {
  name: string;
  volume: string;
  fabricsType: string[];
  fabricsPrice: number[];
  materialType: string[];
  materialPrice: number[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  images: ProductImage[];
  availableSizesImage: string;
  models: ProductModel[];
  batchRatio: number;
  batchThreshold: number;
  deliveryTime: string;
  downloadLink: string;
  newArrival: boolean;
  smallLot: boolean;
}

export interface Fabric {
  id: string;
  name: string;
  priceGroup: string;
  type: string;
  imageUrl: string;
}

export interface Material {
  id: string;
  name: string;
  priceGroup: string;
  imageUrl: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
}

export interface Downloadable {
  id: string;
  name: string;
  downloadLink: string;
  imageUrl: string;
}

export interface IntroImage {
  url: string;
  contentType: string;
}

export interface Intro {
  type: string;
  content: string;
  images: IntroImage[];
}

export interface UserProfile {
  username: string;
  email: string;
  superUser: boolean;
  checkPrice: boolean;
  remark: string;
}
