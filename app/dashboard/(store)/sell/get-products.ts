// 'use server';

// import { ActionResponse } from '@/app/types/action-reponse';
// import prisma from '@/prisma/client';

// type FilterOption = {
//   pageSize?: number;
//   currentPage?: number;
//   search?: string;
// };

// export type Items = {
//   id: string;
//   name: string;
//   sellingPrice: number;
//   category: string;
//   quantityInStock: number;
// };

// const getItems = async (
//   options: FilterOption = {}
// ): Promise<ActionResponse<Items[]>> => {
//   const { search, pageSize = 10, currentPage = 1 } = options;
//   const skip = (currentPage - 1) * pageSize;

//   try {
//     const productsRaw = await prisma.product.findMany({
//       select: {
//         id: true,
//         name: true,
//         sellingPrice: true,
//         category: { select: { name: true } },
//         InventoryProduct: { select: { quantityInStock: true } },
//         type: true,
//       },
//       where: {
//         status: 'ACTIVE',
//         name: { contains: search },
//       },
//       skip,
//       take: pageSize,
//     });

//     const products = productsRaw.map((product) => ({
//       id: product.id,
//       name: product.name,
//       sellingPrice: product.sellingPrice,
//       category: product.category.name,
//       quantityInStock:
//         product.type !== 'INVENTORY'
//           ? 999999999999999
//           : product.InventoryProduct[0].quantityInStock,
//     }));
//     return { success: true, data: products };
//   } catch (error) {
//     return {
//       success: false,
//       error: 'An unexpected error occurred while processing your request.',
//     };
//   }
// };
// export default getItems;
