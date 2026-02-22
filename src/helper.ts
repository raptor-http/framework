import Kernel from "./kernel.ts";
import type { Config } from "./config.ts";

export default function kernel(config?: Config): Kernel {
  return new Kernel(config);
}
