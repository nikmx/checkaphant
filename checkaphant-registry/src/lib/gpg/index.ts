import {ChildProcess, spawn} from 'node:child_process';
import {Buffer} from 'node:buffer';
const fs = require('node:fs');
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

export class GpgClient {
        
    private gpgCmd: string;
    private gpgArgs: string[];
    private gpgId: string|null;

    public constructor(gpgCmd: string, gpgKeyring: string|null, gpgId: string|null) {
        this.gpgCmd = gpgCmd;
        this.gpgArgs = []
        this.gpgId = gpgId;
        if(gpgKeyring)
            this.gpgArgs = ["--no-default-keyring", "--keyring", gpgKeyring]
        if(gpgId)
            this.gpgArgs = this.gpgArgs.concat(["-u", gpgId])
    }

    public async getId(): Promise<string> {
        if(this.gpgId) {
            return Promise.resolve(this.gpgId)
        } else {
            const args = this.gpgArgs.concat(["--fingerprint"])
            return _cmd(this.gpgCmd, null, args)
        }
    }

    public async getPublicKey(): Promise<string> {        
        const args = this.gpgArgs.concat(["--armor", "--export"])
        return _cmd(this.gpgCmd, null, args)
    }

    public async importKey(key: string, keyIsFile: boolean = false): Promise<string> {
        let tmpDir: string = "none"
        let keyFile = key
        let p = Promise.resolve("")
        try {
            if(!keyIsFile) { 
                tmpDir = await _tmpdir()
                keyFile = join(tmpDir, "key.pub")
                fs.writeFileSync(keyFile, key)
            }
            const args = this.gpgArgs.concat(["--import", keyFile])
            p = _cmd(this.gpgCmd, null, args)
        } catch(err) {
            p = Promise.reject(err)
        } finally {
            if(!keyIsFile)
                fs.rm(tmpDir, {recursive: true, force: true}, (err: Error) => {})
        }
        return p
    }

    public async verifySignature(sig: string, doc: string, sigIsFile: boolean = false, docIsFile: boolean = false): Promise<string> {
        let tmpDir: string = "none"
        let docFile: string = doc
        let sigFile: string = sig
        let p: Promise<string> = Promise.resolve("")
        try {
            if(!sigIsFile || !docIsFile)
                tmpDir = await _tmpdir()        
            if(!docIsFile) {
                docFile = join(tmpDir, "doc.dat")
                fs.writeFileSync(docFile, doc)
            }
            if(!sigIsFile) {
                sigFile = docFile.concat(".sig")  
                fs.writeFileSync(sigFile, sig)
            }
            const args = this.gpgArgs.concat(["--verify", sigFile, docFile])
            p = _cmd(this.gpgCmd, null, args);
        } catch(err) {
            p = Promise.reject(err)
        } finally {
            if(!sigIsFile || !docIsFile)
                fs.rm(tmpDir, {recursive: true, force: true}, (err: Error) => {})
        }
        return p
    }

    private _getSignDocCmd(docFile: string, sigFile: string|null = null): string {
        const args = this.gpgArgs.concat(["--armor", "--detach-sig", "--output", sigFile || docFile + ".sig"])
        return `${this.gpgCmd} ${args.join(" ")} ${docFile}`
    }

    public async signDoc(doc: string, docIsFile: boolean = false): Promise<string> {
        let tmpDir: string = "none"
        let docFile: string = doc
        let sig: string = "" 
        try { 
            if(!docIsFile)
                tmpDir = await _tmpdir()        
            if(!docIsFile) {
                docFile = join(tmpDir, "doc.dat")
                fs.writeFileSync(docFile, doc)
            }
            const sigFile = docFile.concat(".sig")                              
            const args = ["-c", this._getSignDocCmd(docFile, sigFile)]
            await _cmdInteractive("sh", null, args);
            sig = await fs.readFileSync(sigFile, 'utf8');            
        } finally {
            if(!docIsFile)
                fs.rm(tmpDir, {recursive: true, force: true}, (err: Error) => {})
        }
        return sig;
    }

    public async updateTrustdb(checkOnly: boolean = true): Promise<string> {
        return _cmd(this.gpgCmd, null, ["--check-trustdb", "--batch"])
    }
}

const _tmpdir =  (prefix: string = "chkp_") => {
    return mkdtemp(join(tmpdir(), prefix));
}

const _cmd = (cmd: string, input: string | Buffer | null, args: string[]) : Promise<string> => {
    
    const proc = spawn(cmd, args || []);
    let res: Buffer[] = [];
    let resLength = 0;
    let err = '';

    return new Promise((resolve, reject) => {
        proc.on('error', (err: Error) => {
            reject(err)
        });
        proc.stdout.on('data', function (buf: Buffer){
            res.push(buf);
            resLength += buf.length;
        });
        proc.stderr.on('data', function(buf: Buffer){
            err += buf.toString('utf8');
        });
        proc.on('close', function(code: number){
            const msg = Buffer.concat(res, resLength);
            if (code !== 0) {
                reject(new Error(err || msg.toString('utf-8')))
            } else {
                resolve(msg.toString());
            }
        });
        
        proc.stdin.end(input);
    });
}

const _cmdInteractive = (cmd: string, input: string | Buffer | null, args: string[]) : Promise<string> => {

    const shell = spawn('sh', args, { stdio: 'inherit' })
    let res: Buffer[] = [];
    let resLength = 0;
    let err = '';
    return new Promise((resolve, reject) => {
        shell.on('error', (err: Error) => {
            reject(err)
        });
        // shell.stdout.on('data', function (buf: Buffer){
        //     res.push(buf);
        //     resLength += buf.length;
        // });
        // shell.stderr.on('data', function(buf: Buffer){
        //     err += buf.toString('utf8');
        // });
        shell.on('close', function(code: number){
            const msg = Buffer.concat(res, resLength);
            if (code !== 0) {
                reject(new Error(err || msg.toString('utf-8')))
            } else {
                resolve(msg.toString());
            }
        });
        
        // shell.stdin.end(input);
    });

}