import { readFile, writeFile } from "node:fs/promises";
import { feature as topojsonFeature } from "topojson-client";
import { geoArea, geoLength } from "d3-geo";

const INPUT_PATH = "public/data/phl-adm3.topo.json";
const OUTPUT_PATH = "public/data/Philippines.geojson";
const EARTH_RADIUS_KM = 6371.0088;

const roundNumber = (value, decimals = 5) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const roundCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates)) return coordinates;
  if (typeof coordinates[0] === "number") {
    return [roundNumber(coordinates[0]), roundNumber(coordinates[1])];
  }
  return coordinates.map((item) => roundCoordinates(item));
};

const buildCompactProperties = (properties, geometryFeature) => {
  const sphericalArea = geoArea(geometryFeature);
  const sphericalLength = geoLength(geometryFeature);

  // geoArea returns steradians; multiply by R^2 to get km^2.
  const areaSqKm = sphericalArea * EARTH_RADIUS_KM * EARTH_RADIUS_KM;
  // geoLength returns radians; multiply by R to get km.
  const shapeLengKm = sphericalLength * EARTH_RADIUS_KM;

  return {
    ADM3_EN: properties.ADM3_EN ?? "Unknown Place",
    ADM3_PCODE: properties.ADM3_PCODE ?? null,
    ADM2_EN: properties.ADM2_EN ?? "Unknown Place Group",
    ADM2_PCODE: properties.ADM2_PCODE ?? null,
    ADM1_EN: properties.ADM1_EN ?? "Unknown Region",
    ADM1_PCODE: properties.ADM1_PCODE ?? null,
    ADM0_EN: properties.ADM0_EN ?? "Philippines",
    ADM0_PCODE: properties.ADM0_PCODE ?? "PH",
    Shape_Leng: roundNumber(shapeLengKm, 4),
    Shape_Area: roundNumber(areaSqKm, 4),
    AREA_SQKM: roundNumber(areaSqKm, 4),
  };
};

const main = async () => {
  const topoRaw = await readFile(INPUT_PATH, "utf8");
  const topo = JSON.parse(topoRaw);

  const collection = topojsonFeature(topo, topo.objects.adm3);
  const compactFeatures = collection.features.map((feature) => {
    const compactGeometry = {
      type: feature.geometry.type,
      coordinates: roundCoordinates(feature.geometry.coordinates),
    };

    const featureForMetric = {
      type: "Feature",
      geometry: feature.geometry,
      properties: {},
    };

    return {
      type: "Feature",
      properties: buildCompactProperties(feature.properties ?? {}, featureForMetric),
      geometry: compactGeometry,
    };
  });

  const output = {
    type: "FeatureCollection",
    name: "Philippines_Geojson",
    features: compactFeatures,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output));
  console.log(`Wrote ${compactFeatures.length} features to ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error("Failed to rebuild Philippines.geojson:", error);
  process.exit(1);
});
