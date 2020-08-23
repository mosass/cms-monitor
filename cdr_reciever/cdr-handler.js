import express from 'express'
import {CdrCall} from '../cdr-db/cdr-model.js'

const router = express.Router()

async function saveCallRecord(session, callBridge, rec) {
    let cdrId = rec.call[0].$.id

    let old = await CdrCall.findOne({'header.cdrId': {'$eq': cdrId}})
    console.log('old = '+old)
    let doc = old
    if(!old) {
        doc = new CdrCall({
            header: {
                type: 'call',
                cdrId: cdrId,
                createTime: Date.now(),
                updateTime: Date.now()
            },
            cdrHistory: [
                {
                    session: session,
                    callBridge: callBridge,
                    type: rec.$.type,
                    time: rec.$.time,
                    recordIndex: rec.$.recordIndex,
                    correlatorIndex: rec.$.correlatorIndex
                }
            ],
            body: {}
        })
    } else {
        doc.header.updateTime = Date.now()
        doc.cdrHistory.push({
            session: session,
            callBridge: callBridge,
            type: rec.$.type,
            time: rec.$.time,
            recordIndex: rec.$.recordIndex,
            correlatorIndex: rec.$.correlatorIndex 
        })
    }

    if (rec.$.type === 'callStart') {
        doc.body.name = rec.call[0].name && rec.call[0].name[0]
        doc.body.coSpace = rec.call[0].cospace && rec.call[0].cospace[0]
        doc.body.ownerName = rec.call[0].ownername && rec.call[0].ownername[0]
        doc.body.tenant = rec.call[0].tenant && rec.call[0].tenant[0]
        doc.body.cdrTag = rec.call[0].cdrtag && rec.call[0].cdrtag[0]
        doc.body.callType = rec.call[0].calltype && rec.call[0].calltype[0]
        doc.body.callCorrelator = rec.call[0].callcorrelator && rec.call[0].callcorrelator[0]
        doc.body.startTimestamp = rec.$.time
    } else if (rec.$.type === 'callEnd') {
        doc.body.callLegsCompleted = rec.call[0].calllegscompleted && rec.call[0].calllegscompleted[0]
        doc.body.callLegsMaxActive = rec.call[0].calllegsmaxactive && rec.call[0].calllegsmaxactive[0]
        doc.body.durationSeconds = rec.call[0].durationseconds && rec.call[0].durationseconds[0]
        doc.body.endTimestamp = rec.$.time
    }

    let result
    if(old) {
        console.log('new = '+doc)
        console.log('update !!')
        result = await CdrCall.updateOne({_id: old._id}, doc).exec()
        result = await CdrCall.findOne({'header.cdrId': {'$eq': cdrId}})
    } else {
        console.log('new !!')
        result = await doc.save()
    }
    return result
}

router.post('', async (req, res) => {
    let session = req.body.records.$.session
    let callBridge = req.body.records.$.callBridge

    console.log('session = ' + session)
    console.log('callBridge = ' + callBridge)

    let result
    for(let rec of req.body.records.record) {
        console.log(rec)
        switch (rec.$.type) {
            case 'callStart': case 'callEnd':
                console.log(rec.$.type + ' case !!')
                result = await saveCallRecord(session, callBridge, rec)
                break
            default:
                console.log('default case !!')
        }
    } 

    res.status(200).json(result)
})

export default router