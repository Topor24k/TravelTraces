import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import shp from "shpjs";
import { topology } from "topojson-server";
import topojsonSimplify from "topojson-simplify";

const { presimplify, simplify, quantile } = topojsonSimplify;

const root = process.cwd();
const sourceBase = path.join(
  root,
  "src",
  "Phl_admbnda",
  "Phl_admbnda",
  "phl_admbnda_adm3_psa_namria_20231106",
);
const outputPath = path.join(root, "public", "data", "phl-adm3.topo.json");
const SIMPLIFY_QUANTILE = Number.parseFloat(process.env.PH_MAP_SIMPLIFY_QUANTILE ?? "0.2");

const toBuffer = (value) =>
  value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);

const readSource = async (ext) => readFile(`${sourceBase}.${ext}`);

const keepProperties = (props = {}) => ({
  ADM3_EN: props.ADM3_EN ?? null,
  ADM2_EN: props.ADM2_EN ?? null,
  ADM1_EN: props.ADM1_EN ?? null,
  ADM3_PCODE: props.ADM3_PCODE ?? null,
});

const stripArcWeights = (topo) => ({
  ...topo,
  arcs: topo.arcs.map((arc) => arc.map((point) => [point[0], point[1]])),
});

const run = async () => {
  const [shpBuffer, dbfBuffer, prjBuffer, cpgBuffer] = await Promise.all([
    readSource("shp"),
    readSource("dbf"),
    readSource("prj"),
    readSource("cpg"),
  ]);

  const parsed = await shp({
    shp: toBuffer(shpBuffer),
    dbf: toBuffer(dbfBuffer),
    prj: toBuffer(prjBuffer),
    cpg: toBuffer(cpgBuffer),
  });

  const featureCollection = Array.isArray(parsed) ? parsed[0] : parsed;

  const compactCollection = {
    ...featureCollection,
    features: featureCollection.features.map((feature) => ({
      ...feature,
      properties: keepProperties(feature.properties),
    })),
  };

  // Quantization + simplification reduces payload while preserving overall shape.
  const topo = topology({ adm3: compactCollection }, 1e5);
  const preSimplified = presimplify(topo);
  const minWeight = quantile(preSimplified, SIMPLIFY_QUANTILE);
  const simplified = stripArcWeights(simplify(preSimplified, minWeight));

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(simplified));

  console.log(`Generated: ${path.relative(root, outputPath)}`);
  console.log(`Features: ${compactCollection.features.length}`);
  console.log(`Simplify quantile: ${SIMPLIFY_QUANTILE}`);
};

run().catch((error) => {
  console.error("Failed to build PH map TopoJSON", error);
  process.exit(1);
});
