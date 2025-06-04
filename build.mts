import portals from "./portals_editable.json" with { type: "json" };
import { writeFile } from "node:fs/promises";
import {
  PortalLibraryInputSchema,
  PortalLibraryOutputSchema,
  PortalLibraryWorldOutputSchema,
  VRCWorldInfo,
} from "./models.mjs";
import { z } from "zod";

const outputPath = "./portals.json";

const inputPortals = PortalLibraryInputSchema.parse(portals);

const worldInfo: Record<
  string,
  z.infer<typeof PortalLibraryWorldOutputSchema>
> = {};
for (const category of inputPortals.Categories) {
  for (const world of category.Worlds) {
    if (world.ID in worldInfo) continue;

    const vrcWorldInfo = await fetch(
      `https://api.vrchat.cloud/api/1/worlds/${world.ID}`,
      {
        headers: {
          "User-Agent": "vrc-gp-portals/1.0.0",
        },
      },
    )
      .then((res) => res.json())
      .then((data) => VRCWorldInfo.parse(data));
    await new Promise((resolve) => setTimeout(resolve, 100)); // Rate limiting

    worldInfo[world.ID] = {
      ID: world.ID,
      Name: vrcWorldInfo.name,
      Description: vrcWorldInfo.description,
      Capacity: vrcWorldInfo.capacity,
      RecommendedCapacity: vrcWorldInfo.recommendedCapacity,
      ReleaseStatus: vrcWorldInfo.releaseStatus,
    };
  }
}

const outputPortals = PortalLibraryOutputSchema.parse({
  ReverseCategorys: inputPortals.ReverseCategories,
  ShowPrivateWorld: inputPortals.ShowPrivateWorld,
  Categorys: inputPortals.Categories.map((category) => ({
    Category: category.Category,
    Worlds: category.Worlds.map((world) => worldInfo[world.ID]),
  })),
});

try {
  await writeFile(outputPath, JSON.stringify(outputPortals, null, 2));
  console.log(`Portal data has been written to ${outputPath}`);
} catch (error) {
  console.error("Error writing portal data:", error);
}
