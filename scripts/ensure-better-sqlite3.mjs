import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const packageName = 'better-sqlite3'

function tryLoadPackage() {
    try {
        require(packageName)
        return null
    } catch (error) {
        return error
    }
}

const initialError = tryLoadPackage()

if (!initialError) {
    process.exit(0)
}

const errorMessage =
    initialError instanceof Error ? initialError.message : String(initialError)
const needsRebuild =
    errorMessage.includes('NODE_MODULE_VERSION') ||
    errorMessage.includes('different Node.js version')

if (!needsRebuild) {
    throw initialError
}

console.log(`[preflight] Rebuilding ${packageName} for ${process.version}...`)

execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['rebuild', packageName], {
    stdio: 'inherit',
})

const retryError = tryLoadPackage()

if (retryError) {
    throw retryError
}

console.log(`[preflight] ${packageName} is ready for ${process.version}.`)
