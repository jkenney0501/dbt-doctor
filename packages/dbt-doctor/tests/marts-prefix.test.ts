import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { runCustomRules } from "dbt-doctor-rules";
import { discoverProject } from "@dbt-doctor/project-info";

const writeFile = (rootDir: string, relativePath: string, body: string): void => {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, body);
};

describe("marts-prefix", () => {
  let directory: string;

  afterEach(() => {
    if (directory) fs.rmSync(directory, { recursive: true, force: true });
  });

  it("allows fct_, dim_, rpt_, and report_ (including rpt__) in marts", () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "dbt-doctor-marts-prefix-"));

    writeFile(
      directory,
      "dbt_project.yml",
      'name: marts_prefix_fixture\nversion: "1"\nprofile: default\nmodel-paths: ["models"]\n',
    );
    writeFile(directory, "models/marts/fct_orders.sql", "select 1 as id\n");
    writeFile(directory, "models/marts/dim_customers.sql", "select 1 as id\n");
    writeFile(directory, "models/marts/rpt__active_pages.sql", "select 1 as id\n");
    writeFile(directory, "models/marts/report_monthly_revenue.sql", "select 1 as id\n");

    const diagnostics = runCustomRules({
      rootDirectory: directory,
      project: discoverProject(directory),
      ignoredTags: new Set(),
    }).filter((diagnostic) => diagnostic.rule === "marts-prefix");

    expect(diagnostics).toHaveLength(0);
  });

  it("flags unprefixed models under marts", () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "dbt-doctor-marts-prefix-"));

    writeFile(
      directory,
      "dbt_project.yml",
      'name: marts_prefix_fixture\nversion: "1"\nprofile: default\nmodel-paths: ["models"]\n',
    );
    writeFile(directory, "models/marts/active_pages.sql", "select 1 as id\n");

    const diagnostics = runCustomRules({
      rootDirectory: directory,
      project: discoverProject(directory),
      ignoredTags: new Set(),
    }).filter((diagnostic) => diagnostic.rule === "marts-prefix");

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.message).toContain("active_pages");
  });
});
