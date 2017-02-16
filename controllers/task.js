import _ from 'lodash'

const addUnfinished = async (ctx,next)=>{
   let unfinished=[];
   //查询当天有哪些未完成的任务
   let wherestr = {
      year: ctx.request.body.year,
      month: ctx.request.body.month,
      day: ctx.request.body.day
   };
   let opt = {unfinished:1, _id:0}   
   let res = await M.task.find(wherestr, opt);
   //如果有记录，则更新当天未完成任务的记录；如果没有记录，则添加第一条记录
   if(res.length){//更新当天未完成任务的记录
      unfinished = res[0].unfinished;
      unfinished.push(ctx.request.body.task);
      await M.task.update(wherestr,{unfinished:unfinished})
            .then((res)=>{
               ctx.body={
                 status:'success',
                 msg:'更新数据成功',
                 data:unfinished
               }               
            }, (err)=>{
               ctx.body={
                 status:'error',
                 msg:'更新数据错误'
               }
            })
   }else{//添加未完成任务的新纪录
      unfinished.push(ctx.request.body.task);
      await M.task.create({
           year: ctx.request.body.year,
           month: ctx.request.body.month,
           day: ctx.request.body.day,
           unfinished: unfinished,
           finished: []
      })
      .then((res)=>{
         ctx.body={
           status:'success',
           msg:'添加任务成功', 
           data:unfinished        
         }
      },(err)=>{
         ctx.body={
           status:'error',
           msg:'添加任务失败',         
         }
      })      
   }
}



const findTask = async (ctx,next) => {
   let wherestr = {
      year: ctx.request.body.year,
      month: ctx.request.body.month,
      day: ctx.request.body.day
   };
   let opt = {unfinished:1, finished:1, _id:0}
   await M.task.find(wherestr, opt)
         .then((res)=>{
             let unfinishedArray = res.length==0?[]:res[0].unfinished;
             let finishedArray = res.length==0?[]:res[0].finished;
               ctx.body = {
                  status:'success',
                  msg:'查询任务成功',
                  data: {
                     unfinished: unfinishedArray,
                     finished: finishedArray
                  }
               }               
         }, (err)=>{
            ctx.body = {
               status:'error',
               msg:'查询任务失败',
            }
         })
}


const unfinishedToFinished = async (ctx,next) => {
   //查询当天的未完成任务记录,和已完成记录
   let wherestr = {
      year: ctx.request.body.year,
      month: ctx.request.body.month,
      day: ctx.request.body.day
   };
   let opt = {unfinished:1, finished:1, _id:0}   
   let res = await M.task.find(wherestr, opt);
   if(res.length){//将未完成记录转变成已完成记录
      let unfinishedArray = res[0].unfinished;
      let finishedArray = res[0].finished;
      _.remove(unfinishedArray, function(task){
         return task === ctx.request.body.task;
      })
      finishedArray.push(ctx.request.body.task);
      //更新未完成的数据库记录,和已完成的数据记录
      await M.task.update(wherestr,{unfinished:unfinishedArray, finished:finishedArray})
            .then((res)=>{
               ctx.body={
                 status:'success',
                 msg:'更新数据成功',
                 data:{
                   unfinished:unfinishedArray,
                   finished:finishedArray
                 }
               }               
            }, (err)=>{
               ctx.body={
                 status:'error',
                 msg:'更新数据错误'
               }
            })
   }  
}


const finishedToUnfinished = async (ctx,next) => {
   //查询当天的未完成任务记录,和已完成记录
   let wherestr = {
      year: ctx.request.body.year,
      month: ctx.request.body.month,
      day: ctx.request.body.day
   };
   let opt = {unfinished:1, finished:1, _id:0}   
   let res = await M.task.find(wherestr, opt);
   if(res.length){
      let unfinishedArray = res[0].unfinished;
      let finishedArray = res[0].finished;
      unfinishedArray.push(ctx.request.body.task);
      _.remove(finishedArray, function(task){
         return task === ctx.request.body.task;
      })
      //更新未完成的数据库记录,和已完成的数据记录
      await M.task.update(wherestr,{unfinished:unfinishedArray, finished:finishedArray})
            .then((res)=>{
               ctx.body={
                 status:'success',
                 msg:'更新数据成功',
                 data:{
                   unfinished:unfinishedArray,
                   finished:finishedArray
                 }
               }               
            }, (err)=>{
               ctx.body={
                 status:'error',
                 msg:'更新数据错误'
               }
            })                  
   }

}

const deleteUnfinished = async (ctx, next) => {
   //查询当天的未完成任务记录
   let wherestr = {
      year: ctx.request.body.year,
      month: ctx.request.body.month,
      day: ctx.request.body.day
   };
   let opt = {unfinished:1, _id:0}   
   let res = await M.task.find(wherestr, opt);
   if(res.length){
      let unfinishedArray = res[0].unfinished;
      _.remove(unfinishedArray, function(task){
         return task === ctx.request.body.task;
      })
      //更新未完成的数据库记录
      await M.task.update(wherestr,{unfinished:unfinishedArray})
            .then((res)=>{
               ctx.body={
                 status:'success',
                 msg:'更新数据成功',
                 data:unfinishedArray
               }               
            }, (err)=>{
               ctx.body={
                 status:'error',
                 msg:'更新数据错误'
               }
            })      
   } 

}

const deleteFinished = async (ctx, next) => {
   //查询当天的已完成记录
   let wherestr = {
      year: ctx.request.body.year,
      month: ctx.request.body.month,
      day: ctx.request.body.day
   };
   let opt = {finished:1, _id:0}   
   let res = await M.task.find(wherestr, opt);
   if(res.length){
      let finishedArray = res[0].finished;
      _.remove(finishedArray, function(task){
         return task === ctx.request.body.task;
      })
      //更新已完成的数据记录
      await M.task.update(wherestr,{finished:finishedArray})
            .then((res)=>{
               ctx.body={
                 status:'success',
                 msg:'更新数据成功',
                 data:finishedArray
               }               
            }, (err)=>{
               ctx.body={
                 status:'error',
                 msg:'更新数据错误'
               }
            }) 
   }
}



export default {
	addUnfinished,
   findTask,
   unfinishedToFinished,
   finishedToUnfinished,
   deleteUnfinished,
   deleteFinished
}











