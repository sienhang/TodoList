import mongoose from 'mongoose';
import task from './task'

function connectDatabase(){

	let DB_URL = 'mongodb://task:hse123456@60.205.176.58:27017/task';
	//连接
	mongoose.connect(DB_URL);
	//连接成功
	mongoose.connection.on('connected', function () {    
	    console.log('Mongoose connection open to ' + DB_URL);  
	});
	//连接异常
	mongoose.connection.on('error',function (err) {    
	    console.log('Mongoose connection error: ' + err);  
	});
	//连接断开
	mongoose.connection.on('disconnected', function () {    
	    console.log('Mongoose connection disconnected');  
	});	

	const Schema = mongoose.Schema;
	const TaskSchema = new Schema(task());
	M.task = mongoose.model('task',TaskSchema);
}

export default connectDatabase;


