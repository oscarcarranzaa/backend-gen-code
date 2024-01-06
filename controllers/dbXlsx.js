import fs from "fs/promises";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

const pathRoot = "public/xlsx/";
export const editOneObject = (req, res) => {
  const data = req.body;
  const IdXlsx = data.IdXlsx;
  const code = data.code;
  const fileName = IdXlsx + ".json";
  const filePath = "public/xlsx/" + IdXlsx + ".json";

  async function editOneObject() {
    try {
      // Lee el contenido del directorio
      const file = await fs.readdir(pathRoot);

      // Busca el archivo por nombre
      const findFile = file.find((arg) => arg === fileName);

      if (findFile) {
        const route = path.join(pathRoot, findFile);

        // Lee el contenido del archivo JSON
        const content = await fs.readFile(route, "utf8");
        const parseJson = JSON.parse(content);
        var dataJson = parseJson.metadata;
        const findOneObject = dataJson.findIndex(function (get) {
          return get.Codigo === code;
        });
        if (findOneObject !== -1) {
          // Editar los valores del objeto sin cambiar su posición en el array
          const dataSerialize = () => ({
            ...dataJson[findOneObject],
            name: data.name.trim(),
            model: data.model.trim(),
            color: data.color.trim(),
            succes: true,
            edit: new Date(),
          });
          dataJson[findOneObject] = dataSerialize();
          const normalice = { title: parseJson.title, metadata: dataJson };
          fs.writeFile(filePath, JSON.stringify(normalice, null, 2), "utf8")
            .then(() => {
              res.json(dataJson);
            })
            .catch((error) => {
              res.status(500).end();
            });
        } else {
          res.status(404).end();
        }
      } else {
        res.status(404).end();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  editOneObject();
};
export const deleteOneObject = (req, res) => {
  const data = req.body;
  const IdXlsx = data.IdXlsx;
  const code = data.code;
  const fileName = IdXlsx + ".json";
  const filePath = "public/xlsx/" + IdXlsx + ".json";

  async function delOneObject() {
    try {
      // Lee el contenido del directorio
      const file = await fs.readdir(pathRoot);

      // Busca el archivo por nombre
      const findFile = file.find((arg) => arg === fileName);

      if (findFile) {
        const route = path.join(pathRoot, findFile);

        // Lee el contenido del archivo JSON
        const content = await fs.readFile(route, "utf8");
        const parseJson = JSON.parse(content);
        var dataJson = parseJson.metadata;
        console.log(content);
        console.log(dataJson);
        const deleteObject = dataJson.filter(function (get) {
          return get.Codigo !== code;
        });
        if (deleteObject !== -1) {
          // Editar los valores del objeto sin cambiar su posición en el array
          fs.writeFile(filePath, JSON.stringify(deleteObject, null, 2), "utf8")
            .then(() => {
              res.json(deleteObject);
            })
            .catch((error) => {
              res.status(500).end();
            });
        } else {
          res.status(404).end();
        }
      } else {
        res.status(404).end();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  delOneObject();
};
export const playObject = (req, res) => {
  const data = req.body;
  const IdXlsx = data.IdXlsx;
  const fileName = IdXlsx + ".json";

  async function playObj() {
    try {
      // Lee el contenido del directorio
      const file = await fs.readdir(pathRoot);

      // Busca el archivo por nombre
      const findFile = file.find((arg) => arg === fileName);

      if (findFile) {
        const route = path.join(pathRoot, findFile);

        // Lee el contenido del archivo JSON
        const content = await fs.readFile(route, "utf8");
        const parseJson = JSON.parse(content);
        var dataJson = parseJson.metadata;

        const newData = dataJson.flatMap((d) => {
          const cantidadItems = d["(pcs)"]; // Puedes ajustar este valor según la cantidad deseada
          const items = [];

          for (let i = 1; i <= cantidadItems; i++) {
            const nuevoItem = {
              nombre: d.name,
              model: d.model,
              color: d.color,
              lote: d.lote,
              code: d.Codigo,
              // Puedes agregar más propiedades según tus necesidades
            };

            items.push(nuevoItem);
          }
          return items;
        });
        const csvWriter = createObjectCsvWriter({
          path: "public/db-csv/" + IdXlsx + ".csv",
          header: [
            { id: "nombre", title: "Nombre" },
            { id: "model", title: "Modelo" },
            { id: "color", title: "Color" },
            { id: "lote", title: "Lote" },
            { id: "code", title: "Codigo" },
          ],
        });
        csvWriter.writeRecords(newData).then(() => {
          console.log("Archivo CSV creado con éxito");
          res.send("Archivo CSV creado con éxito");
        });
      } else {
        res.status(404).end();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  playObj();
};
