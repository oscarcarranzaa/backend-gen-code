import fs from "fs/promises";
import path from "path";

const pathRoot = "public/xlsx/";

// lee un xlsx completo
export const getXlsx = (req, res) => {
  const xlsxId = req.query.id;
  const fileName = xlsxId + ".json";

  async function readJson() {
    // Lee el contenido del directorio
    const file = await fs.readdir(pathRoot);

    // Busca el archivo por nombre
    const findFile = file.find((arg) => arg === fileName);

    if (findFile) {
      const route = path.join(pathRoot, findFile);

      // Lee el contenido del archivo JSON
      const content = await fs.readFile(route, "utf8");
      const parseJson = JSON.parse(content);
      const dataJson = parseJson.metadata;

      // Aplicar paginación y clasificación si se proporcionan los parámetros
      const { page = 1, limit = 10 } = req.query;

      let paginatedData = dataJson.slice((page - 1) * limit, page * limit);

      // No hay campo de clasificación, se mantiene el orden original del JSON
      res.json({
        title: parseJson.title,
        data: paginatedData,
        totalItems: dataJson.length,
        currentPage: +page,
        totalPages: Math.ceil(dataJson.length / limit),
      });
    } else {
      console.log("Archivo no encontrado:", fileName);
      res.status(404).end();
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
        const parseJson = JSON.parse(content);
        const dataJson = parseJson.metadata;
        const indexPosition = dataJson.findIndex(function (obj) {
          return obj.Codigo == code;
        });
        function nextPage(sum) {
          const cal = Math.ceil(Number(indexPosition + sum) / 10);
          const totalPages = Math.ceil(dataJson.length / 10);
          return cal == 0 || cal > totalPages ? false : cal;
        }
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
          nextPaginate: nextPage(2),
          prevPaginate: nextPage(0),
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
