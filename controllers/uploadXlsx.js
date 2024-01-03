import xlsx from "xlsx";
import fs from "fs/promises";
import { nanoid } from "nanoid";

export const uploadXlsx = (req, res) => {
  const filePath = "public/xlsx/" + nanoid(5) + ".json";
  const getDate = new Date();
  const month = getDate.getMonth() + 1;
  const year = getDate.getFullYear() % 100;
  const formatMonth = month < 10 ? "0" + String(month) : String(month);
  const lot = "000" + formatMonth + String(year);
  try {
    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const mapJson = jsonData.map((e) => ({
      ...e,
      lote: lot,
    }));
    fs.writeFile(filePath, JSON.stringify(mapJson, null, 2), "utf8")
      .then(() => {
        console.log(
          `Se generaron y guardaron ${mapJson.length} items en ${filePath}`
        );
      })
      .catch((error) => {
        console.error("Error al escribir el archivo JSON:", error);
      });
    const idJson = filePath.split("/").pop();
    res.json({ id: idJson.split(".")[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al convertir el archivo XLS a JSON." });
  }
};
