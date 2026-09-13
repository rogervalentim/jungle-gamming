import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()
const vite = resolve(cwd, 'node_modules/vite/bin/vite.js')
const lighthouse = resolve(cwd, 'node_modules/lighthouse/cli/index.js')
const reportDir = resolve(cwd, 'reports/lighthouse')
const origin = 'http://127.0.0.1:4173'
const runs = Number(process.env.AUDIT_RUNS ?? '3')
const chromePaths = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].filter(Boolean)
const chromePath = chromePaths.find((path) => existsSync(path))
if (chromePath) process.env.CHROME_PATH = chromePath

function run(command, args) {
  const result = spawnSync(command, args, { cwd, env: process.env, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`${args[0]} terminou com código ${result.status}`)
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(origin)
      if (response.ok) return
    } catch { /* wait for Vite */ }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error('Preview não iniciou em 30 segundos.')
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

if (!Number.isInteger(runs) || runs < 1) throw new Error('AUDIT_RUNS deve ser inteiro positivo.')
mkdirSync(reportDir, { recursive: true })
run(process.execPath, [vite, 'build', '--configLoader', 'native', '--mode', 'demo'])
const preview = spawn(process.execPath, [vite, 'preview', '--configLoader', 'native',
  '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { cwd, stdio: 'inherit' })

try {
  await waitForPreview()
  const summary = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    chromePath: chromePath ?? 'detectado pelo Lighthouse',
    runsPerPageAndProfile: runs,
    results: [],
  }
  for (const [pageName, path] of [['inicio', '/'], ['detalhe', '/mercado?item=emerald-042']]) {
    for (const profile of ['mobile', 'desktop']) {
      const measurements = []
      for (let index = 1; index <= runs; index += 1) {
        const output = resolve(reportDir, `${pageName}-${profile}-${index}`)
        const flags = [
          lighthouse, `${origin}${path}`, '--quiet',
          '--output=json', '--output=html', `--output-path=${output}`,
          '--only-categories=performance,accessibility,best-practices,seo',
          '--chrome-flags=--headless=new',
        ]
        if (profile === 'desktop') flags.push('--preset=desktop')
        run(process.execPath, flags)
        const report = JSON.parse(readFileSync(`${output}.report.json`, 'utf8'))
        measurements.push({
          report: `${pageName}-${profile}-${index}`,
          lighthouseVersion: report.lighthouseVersion,
          chromeVersion: report.environment?.hostUserAgent,
          performance: report.categories.performance.score * 100,
          accessibility: report.categories.accessibility.score * 100,
          bestPractices: report.categories['best-practices'].score * 100,
          seo: report.categories.seo.score * 100,
          lcpMs: report.audits['largest-contentful-paint'].numericValue,
          cls: report.audits['cumulative-layout-shift'].numericValue,
          tbtMs: report.audits['total-blocking-time'].numericValue,
        })
        process.stdout.write(`Lighthouse ${pageName} ${profile} ${index}/${runs}: ${measurements.at(-1).performance}\n`)
      }
      summary.results.push({ page: pageName, profile, measurements, median: {
        performance: median(measurements.map((item) => item.performance)),
        accessibility: median(measurements.map((item) => item.accessibility)),
        bestPractices: median(measurements.map((item) => item.bestPractices)),
        seo: median(measurements.map((item) => item.seo)),
        lcpMs: median(measurements.map((item) => item.lcpMs)),
        cls: median(measurements.map((item) => item.cls)),
        tbtMs: median(measurements.map((item) => item.tbtMs)),
      } })
    }
  }
  writeFileSync(resolve(reportDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
} finally {
  preview.kill()
}
