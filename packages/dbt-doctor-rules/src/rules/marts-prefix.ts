import path from "node:path";
import type { Rule } from "../types.js";
import { report } from "../utils/report.js";

const MART_PATH_SEGMENTS = ["/marts/", "/mart/", "/fct/", "/dim/"];

/** fct_/dim_ facts and dimensions; rpt_/report_ for mart report models (incl. rpt__entity). */
const MART_MODEL_PREFIXES = ["fct_", "dim_", "rpt_", "report_"] as const;

const hasMartModelPrefix = (basename: string): boolean =>
  MART_MODEL_PREFIXES.some((prefix) => basename.startsWith(prefix));

export const martsPrefix: Rule = {
  id: "marts-prefix",
  severity: "warn",
  category: "Naming",
  recommendation: "Use fct_, dim_, rpt_, or report_ prefix for mart models",
  run: ({ sqlFiles }) => {
    const diagnostics = [];
    for (const file of sqlFiles) {
      const relative = file.replace(/\\/g, "/");
      if (!MART_PATH_SEGMENTS.some((segment) => relative.includes(segment))) continue;
      const basename = path.basename(file, path.extname(file));
      if (hasMartModelPrefix(basename)) continue;
      diagnostics.push(
        report(
          martsPrefix,
          file,
          `Mart model "${basename}" should use fct_, dim_, rpt_, or report_ prefix`,
          "Use fct_ for facts, dim_ for dimensions, and rpt_ or report_ for report models.",
        ),
      );
    }
    return diagnostics;
  },
};
