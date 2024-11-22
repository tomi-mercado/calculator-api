import bodyParser from "body-parser";
import express from "express";
import z from "zod";
import { calculate } from "./calculate";

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

const app = express();

app.use(bodyParser.json());

const calculateBodySchema = z.object({
  operation: z.string().min(1),
});

app.post("/calculate", (req, res) => {
  const bodyParseResult = calculateBodySchema.safeParse(req.body);

  if (!bodyParseResult.success) {
    res.status(400).json({ error: bodyParseResult.error.message });
    return;
  }

  const { operation } = bodyParseResult.data;

  try {
    const result = calculate(operation);
    res.json({ result });
  } catch (e) {
    const error = e as Error;
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Calculator app listening on port ${PORT}`);
});
