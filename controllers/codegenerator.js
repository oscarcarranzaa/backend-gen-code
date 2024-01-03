import fs from "fs/promises";

export const Codegenerator = (req, res) => {
  const bod = req.body;
  console.log(bod.code);
  const filePath = "public/" + bod.id + ".json";
  console.log(filePath);
  // body.map((data) => {});
  const cantidadItems = bod.amount; // Puedes ajustar este valor según la cantidad deseada
  const items = [];

  for (let i = 1; i <= cantidadItems; i++) {
    const nuevoItem = {
      nombre: bod.name,
      variation: bod.variation,
      code: bod.code,
      // Puedes agregar más propiedades según tus necesidades
    };

    items.push(nuevoItem);
  }
  fs.access(filePath)
    .then(() => {
      // El archivo existe, leer su contenido
      return fs.readFile(filePath, "utf8");
    })
    .then((data) => {
      // Parsear el contenido como JSON
      const jsonData = JSON.parse(data);
      const addItem = [...jsonData, ...items];
      fs.writeFile(filePath, JSON.stringify(addItem, null, 2), "utf8")
        .then(() => {
          console.log(
            `Se generaron y guardaron ${cantidadItems} items en ${filePath}`
          );
        })
        .catch((error) => {
          console.error("Error al escribir el archivo JSON:", error);
        });
    })
    .catch((error) => {
      // Manejar el caso en que el archivo no existe o hay un error al leerlo
      if (error.code === "ENOENT") {
        fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8")
          .then(() => {
            console.log(
              `Se generaron y guardaron ${cantidadItems} items en ${filePath}`
            );
          })
          .catch((error) => {
            console.error("Error al escribir el archivo JSON:", error);
          });
      } else {
        console.error("Error al leer el archivo JSON:", error);
      }
    });
  res.json({
    ok: true,
  });
};
