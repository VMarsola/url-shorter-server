import express, { Request, Response } from "express";
import shortid from "shortid";

const app = express();

const port = 6666;
// Usar JSON no corpo das requisições
app.use(express.json());

// Dicionário para mapear URLs encurtadas para URLs originais
const urlMapping: { [key: string]: string } = {};

// Endpoint para encurtar URLs
app.post("/encurtar", (req: Request, res: Response) => {
  const urlLonga: string = req.body.url;
  const urlCurta: string = shortid.generate();

  // Armazenar a URL longa no dicionário de mapeamento
  urlMapping[urlCurta] = urlLonga;

  res.json({ urlCurta: `${req.protocol}://${req.get("host")}/${urlCurta}` });
});

// Endpoint para redirecionar URLs encurtadas
app.get("/:urlCurta", (req: Request, res: Response) => {
  const urlCurta: string = req.params.urlCurta;
  if (urlCurta in urlMapping) {
    const urlLonga: string = urlMapping[urlCurta];
    res.redirect(urlLonga);
  } else {
    res.status(404).json({ error: "URL curta não encontrada" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
