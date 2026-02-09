import config from '../config/config'
//import Database from 'better-sqlite3'
import { KeyVote } from './keyVote'
import {AssetVote} from './assetVote'


export interface NestedKeyVotes {
    [key: string]: {
        [key: string]: KeyVote;
    };
}

export interface NestedAssetVotes {
    [key: string]: {
        [key: string]: {
            [key: string]: AssetVote;
        };
    };
}

const db = require('better-sqlite3')(config.indexFile, { fileMustExist: false }); // verbose: console.log, 
db.pragma('journal_mode = WAL');

const initializeStoreSchema = () => {
    const assetVoteTable = `
        CREATE TABLE IF NOT EXISTS 
        ASSET_VOTE 
        (
            ts LONG,
            uri TEXT,
            format TEXT,
            hash TEXT,
            type TEXT,
            rate INTEGER,
            model TEXT,
            sig TEXT,
            sid TEXT,
            spk TEXT
        )
    `;
    db.prepare(assetVoteTable).run();

    const keyVoteTable = `
        CREATE TABLE IF NOT EXISTS 
        KEY_VOTE 
        (
            ts LONG,
            kid TEXT,
            type TEXT,
            rate INTEGER,
            sig TEXT,
            sid TEXT,
            spk TEXT
        )
    `;
    db.prepare(keyVoteTable).run();
}

initializeStoreSchema()

export const loadStoreKeyVotes = () => {
    const stmt = db.prepare(`
        SELECT * FROM KEY_VOTE
    `);
    return stmt.all().map((st: NestedKeyVotes, i: KeyVote) => {
        st[i.kid] = st[i.kid] || {}
        st[i.kid][i.sid] = st[i.kid][i.sid] = i
        return st
    }, {});
}

export const deleteStoreKeyVotes = db.transaction((keyVotes: KeyVote[]) => {
    const stmt_delete = db.prepare(`
        DELETE FROM KEY_VOTE WHERE kid=? AND sid = ?
    `);
    for (const i in keyVotes) {
        stmt_delete.run(keyVotes[i].kid, keyVotes[i].sid)
    }
});

export const upsertStoreKeyVotes = db.transaction((keyVotes: KeyVote[]) => {
    const stmt_delete = db.prepare(`
        DELETE FROM KEY_VOTE WHERE kid=? AND sid = ?
    `);
    const stmt_insert = db.prepare(`
        INSERT INTO KEY_VOTE (ts, kid, type, rate, sig, sid, spk) VALUES(?,?,?,?,?,?,?)
    `);
    for (const i in keyVotes) {
        stmt_delete.run(keyVotes[i].kid, keyVotes[i].sid)
        stmt_insert.run(
            keyVotes[i].ts, 
            keyVotes[i].kid, 
            keyVotes[i].type, 
            keyVotes[i].rate, 
            keyVotes[i].sig, 
            keyVotes[i].sid,
            keyVotes[i].spk
        )
    }
});

export const loadStoreAssetVotes = () => {
    const stmt = db.prepare(`
        SELECT * FROM ASSET_VOTE
    `);
    return stmt.all().map((st: NestedAssetVotes, i: AssetVote) => {
        st[i.uri] = st[i.uri] || {}
        st[i.uri][i.model] = st[i.uri][i.model] || {}
        st[i.uri][i.model][i.sid] = i
        return st
    }, {});
}

export const deleteStoreAssetVotes = db.transaction((assetVotes: AssetVote[]) => {
    const stmt_delete = db.prepare(`
        DELETE FROM ASSET_VOTE WHERE uri=? AND model = ? AND sid = ?
    `);
    for (const i in assetVotes) {
        stmt_delete.run(assetVotes[i].uri, assetVotes[i].model, assetVotes[i].sid)
    }
})

export const upsertStoreAssetVotes = db.transaction((assetVotes: AssetVote[]) => {
    const stmt_delete = db.prepare(`
        DELETE FROM ASSET_VOTE WHERE uri=? AND model = ? AND sid = ?
    `);
    const stmt_insert = db.prepare(`
        INSERT INTO ASSET_VOTE (ts, uri, format, hash, type, rate, model, sig, sid, spk) VALUES(?,?,?,?,?,?,?,?,?,?)
    `);
    for (const i in assetVotes) {
        stmt_delete.run(assetVotes[i].uri, assetVotes[i].model, assetVotes[i].sid)
        stmt_insert.run(
            assetVotes[i].ts, 
            assetVotes[i].uri, 
            assetVotes[i].format, 
            assetVotes[i].hash, 
            assetVotes[i].type, 
            assetVotes[i].rate, 
            assetVotes[i].model, 
            assetVotes[i].sig, 
            assetVotes[i].sid,
            assetVotes[i].spk
        )
    }
})