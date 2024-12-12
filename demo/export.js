import { AsepriteExporter } from "../dist/index.es.js";
import dotenv from 'dotenv';

dotenv.config();

const getConfig = (key) => {
  const env = process.env;
  return {
    autoEmpty: env[`AUTO_EMPTY`] === 'TRUE',
    asePath: env["ASEPRITE_PATH"],
    input: env[`${key}_INPUT`],
    format: env[`${key}_FORMAT`],
    outputs: JSON.parse(env[`${key}_OUTPUTS`]),
    scale: env[`${key}_SCALE`],
    args: env[`${key}_ADDITIONAL_ARGS`]
  };

}
  
new AsepriteExporter(getConfig('TILES'));
new AsepriteExporter(getConfig('ANIMATION'));
new AsepriteExporter(getConfig('UI'));
new AsepriteExporter(getConfig('OBJECTS'));
new AsepriteExporter(getConfig('MEDIA'));

  