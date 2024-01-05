import fs from "fs/promises";
import path from "path";

const pathRoot = "public/xlsx/";

// lee un xlsx completo
export const getXlsx = (req, res) => {
  const xlsxId = req.query.id;
  const fileName = xlsxId + ".json";

  async function readJson() {
    try {
      // Lee el contenido del directorio
      const file = await fs.readdir(pathRoot);

      // Busca el archivo por nombre
      const findFile = file.find((arg) => arg === fileName);

      if (findFile) {
        const route = path.join(pathRoot, findFile);

        // Lee el contenido del archivo JSON
        const content = await fs.readFile(route, "utf8");
        const dataJson = JSON.parse(content);

        // Aplicar paginación y clasificación si se proporcionan los parámetros
        const { page = 1, limit = 10 } = req.query;

        let paginatedData = dataJson.slice((page - 1) * limit, page * limit);

        // No hay campo de clasificación, se mantiene el orden original del JSON
        res.json({
          data: paginatedData,
          totalItems: dataJson.length,
          currentPage: +page,
          totalPages: Math.ceil(dataJson.length / limit),
        });
      } else {
        console.log("Archivo no encontrado:", fileName);
        res.status(404).end();
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  readJson();
};
//lee todo los xlsx  que hay disponibles
export const getAllXlsx = (req, res) => {
  async function readFiles() {
    const file = await fs.readdir(pathRoot);
    const idXlsx = await Promise.all(
      file.map(async (fileName) => {
        const filePath = path.join(pathRoot, fileName);
        const fileStat = await fs.stat(filePath);
        const modify = fileStat.mtime;
        const id = fileName.split(".")[0];

        return { id, modify };
      })
    );
    res.json(idXlsx);
  }
  readFiles();
};
// lee solo un objeto que contiene un xlsx en especifico
export const getOneXlsx = (req, res) => {
  const code = req.query.code;
  const xlsxId = req.query.id;
  const fileName = xlsxId + ".json";
  async function readOneObject() {
    try {
      // Lee el contenido del directorio
      const file = await fs.readdir(pathRoot);

      // Busca el archivo por nombre
      const findFile = file.find((arg) => arg === fileName);
      if (findFile) {
        const route = path.join(pathRoot, findFile);

        // Lee el contenido del archivo JSON
        const content = await fs.readFile(route, "utf8");
        const dataJson = JSON.parse(content);
        const indexPosition = dataJson.findIndex(function (obj) {
          return obj.Codigo === code;
        });
        const nextPaginate = Math.ceil(Number(indexPosition + 2) / 10);
        const prevPaginate = Math.ceil(Number(indexPosition) / 10);

        const prevObject =
          indexPosition > 0 ? dataJson[indexPosition - 1].Codigo : false;

        const nextObject =
          indexPosition < dataJson.length - 1
            ? dataJson[indexPosition + 1].Codigo
            : false;

        const findOneObject = dataJson.find(function (get) {
          return get.Codigo === code;
        });
        if (!findOneObject) {
          res.json(undefined);
        }
        res.json({
          ...findOneObject,
          nextCode: nextObject,
          prevCode: prevObject,
          nextPaginate,
          prevPaginate,
        });
      } else {
        console.log("El Objeto no fue encontrado", fileName);
        res.status(404).end();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  readOneObject();
};

/*
export const editOneXlsx = (req, res) => {
  const code = req.query.code;
  const xlsxId = req.query.id;
  const fileName = xlsxId + ".json";
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
        const dataJson = JSON.parse(content);
        const findOneObject = dataJson.findIndex(function (get) {
          return get.Codigo === code;
        });
        res.json(findOneObject);
      } else {
        console.log("El Objeto no fue encontrado", fileName);
        res.status(404).end();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  editOneObject();
};*/
