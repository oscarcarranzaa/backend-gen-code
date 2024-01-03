import fs from "fs/promises";
import path from "path";

const pathRoot = "public/xlsx/";
export const editOneObject = (req, res) => {
  const data = req.body;
  const IdXlsx = data.IdXlsx;
  const code = data.code;
  const dataObject = data.data;
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
        var dataJson = JSON.parse(content);
        console.log(dataJson);
        const findOneObject = dataJson.findIndex(function (get) {
          return get.Codigo === code;
        });
        if (findOneObject !== -1) {
          // Editar los valores del objeto sin cambiar su posición en el array
          dataJson[findOneObject] = dataObject;
          fs.writeFile(filePath, JSON.stringify(dataJson, null, 2), "utf8")
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
        var dataJson = JSON.parse(content);
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
