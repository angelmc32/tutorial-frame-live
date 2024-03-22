import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import { getPulpaBalance } from "../utils/alchemy.js";
import { mintNft } from "../utils/mint.js";
import { pinata } from "frog/hubs";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: pinata(),
});

app.frame("/", (context) => {
  const { buttonValue, inputText, status } = context;
  const fruit = inputText || buttonValue;
  return context.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "#432889",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 40,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            margin: 16,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Hola! En este Frame podrás acuñar un NFT si cumples con ciertos
          requisitos
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Introduce tu dirección" />,
      <Button action="/inicio">Iniciar</Button>,
      <Button.Link href="https://zora.co">Colección</Button.Link>,
      <Button.Link href="https://warpcast.com/criptostreet">
        Artista
      </Button.Link>,
    ],
  });
});

app.frame("/inicio", async (context) => {
  const { buttonValue, inputText, verified, frameData } = context;
  console.log("verified>>>>>", verified);
  console.log("frameData>>>>>", frameData);
  if (!inputText || !verified) {
    return context.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "#432889",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 16,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Esa dirección no es válida
          </div>
        </div>
      ),
      intents: [<Button.Reset>Reiniciar</Button.Reset>],
    });
  }
  const pulpaBalance = await getPulpaBalance(inputText as string);
  if (parseInt(pulpaBalance) > 0) {
    return context.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "#432889",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 16,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            ¡Perfecto, puedes acuñar el NFT!
          </div>
        </div>
      ),
      intents: [
        <Button action="/acunar" value={inputText}>
          Acuñar
        </Button>,
        <Button.Reset>Reiniciar</Button.Reset>,
      ],
    });
  } else {
    return context.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "#432889",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 16,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Estás iniciando el Frame {buttonValue}
          </div>
        </div>
      ),
      intents: [
        <Button.Transaction target="eip155:10:0x029263aA1BE88127f1794780D9eEF453221C2f30">
          Conseguir $PULPA
        </Button.Transaction>,
        <Button.Reset>Reiniciar</Button.Reset>,
      ],
    });
  }
});

app.frame("/acunar", async (context) => {
  const { buttonValue } = context;
  console.log(buttonValue);
  const mintRes = await mintNft(buttonValue as `0x${string}`);
  if (mintRes.isSuccess) {
    return context.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "#432889",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 16,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Se ha acuñado el NFT, tx: {mintRes.hash}
          </div>
        </div>
      ),
      intents: [
        <Button.Link href={`https://sepolia.etherscan.io/tx/${mintRes.hash}`}>
          Scanner
        </Button.Link>,
        <Button.Reset>Reiniciar</Button.Reset>,
      ],
    });
  } else {
    return context.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "#432889",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              margin: 16,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            Lo sentimos, algo salió mal :'(
          </div>
        </div>
      ),
      intents: [<Button.Reset>Reiniciar</Button.Reset>],
    });
  }
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
