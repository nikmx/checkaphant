import {ChildProcess, spawn} from 'node:child_process';
import {Buffer} from 'node:buffer';
// import fs from 'fs';

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

    public async importKey(keyFile: string): Promise<string> {
        const args = this.gpgArgs.concat(["--import"])
        return _cmd(this.gpgCmd, keyFile, args)
    }

    public async verifySignature(sigFile: string, docFile: string): Promise<string> {
        const args = this.gpgArgs.concat(["--verify", sigFile])
        return _cmd(this.gpgCmd, docFile, args);
    }

    public getSignDocCmd(docFile: string, sigFile: string|null = null): string {
        const args = this.gpgArgs.concat(["--armor", "--detach-sig", "--output", sigFile || docFile + ".sig"])
        // return _cmd(this.gpgCmd, [sigFile || docFile + '.sig', docFile], args);
        return `${this.gpgCmd} ${args.join(" ")} ${docFile}`
    }

    // public async signDoc(docFile: string, sigFile: string|null): Promise<string> {
    //     const args = this.gpgArgs.concat(["--armor", "--detach-sig", "--output"])
    //     return _cmd(this.gpgCmd, [sigFile || docFile + '.sig', docFile], args);
    // }

    public async updateTrustdb(checkOnly: boolean = true): Promise<string> {
        return _cmd(this.gpgCmd, null, ["--check-trustdb", "--batch"])
    }
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
