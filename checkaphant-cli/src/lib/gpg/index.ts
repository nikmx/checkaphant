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

    public async importKey(key: string): Promise<string> {
        const tmpDir = await _tmpdir()
        try {            
            const keyFile = join(tmpDir, "key.gpg")
            fs.writeFileSync(keyFile, key)
            const args = this.gpgArgs.concat(["--import"])
            return _cmd(this.gpgCmd, keyFile, args)
        } finally {
            fs.rm(tmpDir, { recursive: true })
        }
    }

    public async verifySignature(sig: string, doc: string): Promise<string> {
        const tmpDir = await _tmpdir()
        try {
            const sigFile = join(tmpDir, "doc.sig")
            const docFile = join(tmpDir, "doc.dat")
            fs.writeFileSync(sigFile, sig)
            fs.writeFileSync(docFile, doc)
            const args = this.gpgArgs.concat(["--verify", sigFile])
            return _cmd(this.gpgCmd, docFile, args);
        } finally {
            fs.rm(tmpDir, { recursive: true })
        }
    }

    private _getSignDocCmd(docFile: string, sigFile: string|null = null): string {
        const args = this.gpgArgs.concat(["--armor", "--detach-sig", "--output", sigFile || docFile + ".sig"])
        return `${this.gpgCmd} ${args.join(" ")} ${docFile}`
    }

    public async signDoc(doc: string): Promise<string> {
        const tmpDir = await _tmpdir()
        try {
            const sigFile = join(tmpDir, "doc.sig")
            const docFile = join(tmpDir, "doc.dat")
            fs.writeFileSync(docFile, doc)
            const args = ["-c", this._getSignDocCmd(docFile, sigFile)]
            await _cmdInteractive("sh", null, args);
            const sig = fs.readFileSync(sigFile, 'utf8');
            return sig;
        } finally {
            fs.rm(tmpDir, { recursive: true })
        }
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