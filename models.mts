import { release } from "node:os";
import { z } from "zod";

export const PortalLibraryWorldInputSchema = z.object({
  ID: z.string(),
});

export const PortalLibraryCategoryInputSchema = z.object({
  Category: z.string(),
  Worlds: z.array(PortalLibraryWorldInputSchema),
});

export const PortalLibraryInputSchema = z.object({
  ReverseCategories: z.boolean(),
  ShowPrivateWorld: z.boolean(),
  Categories: z.array(PortalLibraryCategoryInputSchema),
});

export const PortalLibraryWorldOutputSchema = z.object({
  ID: z.string(),
  Name: z.string(),
  Description: z.string(),
  Capacity: z.number(),
  RecommendedCapacity: z.number(),
  ReleaseStatus: z.string(),
});

export const PortalLibraryCategoryOutputSchema = z.object({
  Category: z.string(),
  Worlds: z.array(PortalLibraryWorldOutputSchema),
});

export const PortalLibraryOutputSchema = z.object({
  ReverseCategorys: z.boolean(),
  ShowPrivateWorld: z.boolean(),
  Categorys: z.array(PortalLibraryCategoryOutputSchema),
});

export const VRCWorldInfo = z.object({
  capacity: z.number(),
  description: z.string(),
  name: z.string(),
  recommendedCapacity: z.number(),
  releaseStatus: z.string(),
});
