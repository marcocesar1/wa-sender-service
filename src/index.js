const qrcode = require("qrcode-terminal");
const Yup = require("yup");
const { Client, LocalAuth } = require("whatsapp-web.js");
//require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

async function init() {
  const client = new Client({
    puppeteer: {
      headless: true,
      //args: ["--no-sandbox"],
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--single-process",
        "--disable-web-security",
      ],
      executablePath: "/usr/bin/chromium",
    },
    authStrategy: new LocalAuth(),
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
  });

  client.on("message", (msg) => {
    console.log({ message: msg.body });
    if (msg.body == "!ping") {
      msg.reply("pong");
    }
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.initialize();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.post("/send", async (req, res) => {
    const { message, phoneNumber } = req.body;

    const schema = Yup.object().shape({
      message: Yup.string().required("El mensaje es obligatorio"),
      phoneNumber: Yup.string()
        .required("El número de teléfono es obligatorio")
        .matches(
          /^\d{10}$/,
          "El número de teléfono debe tener exactamente 10 dígitos"
        ),
    });

    const data = { message, phoneNumber };

    try {
      await schema.validate(data);

      client.sendMessage(`521${phoneNumber}@c.us`, message);

      res.json({ message, phoneNumber });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port 3001`);
  });
}

init();
