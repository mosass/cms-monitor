import mongoose from 'mongoose';

export function dbconn () {
    console.log('connect to mongo!!')
    mongoose.connect('mongodb://dba:secret@localhost:27017/admin', {useNewUrlParser: true, useUnifiedTopology: true});
}

export default dbconn;
