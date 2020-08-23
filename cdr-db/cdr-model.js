import mongoose from 'mongoose'

const CDR_COLLECTION = 'cdrs'

var Schema = mongoose.Schema

var cdrHeaderSch = new Schema({
    type: String,
    cdrId: String,
    createTime: Date,
    updateTime: Date
},{ _id : false })

var cdrHistorySch = new Schema({
    session: String,
    callBridge: String,
    type: String,
    time: Date,
    recordIndex: Number,
    correlatorIndex: Number
},{ _id : false })

var cdrCallSchema = new Schema({
    header: cdrHeaderSch,
    body: {
        name: String,
        coSpace: String,
        ownerName: String,
        tenant: String,
        cdrTag: String,
        callType: String,
        callCorrelator: String,
        callLegsCompleted: Number,
        callLegsMaxActive: Number,
        durationSeconds: Number,
        startTimestamp: Date,
        endTimestamp: Date
    },
    cdrHistory: [cdrHistorySch]
});

export const CdrCall = mongoose.model('CdrCall', cdrCallSchema, CDR_COLLECTION)
