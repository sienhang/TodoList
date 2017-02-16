import koa from 'koa'
import router from 'koa-router'
import cors from 'koa-cors'
import bodyParer from 'koa-bodyparser'
import views from 'koa-views'
import serve from 'koa-static'
import task from './controllers/task'
import models from './models'

const app = new koa();
const APIRouter = new router();

global.M = {};

models();



app.use(cors());//允许跨域

app.use(bodyParer());//body解析


//===================渲染页面
app.use(views(__dirname + '/views', {
  map: {
    html: 'swig'
  }
}));


//===================初始化静态资源
app.use(serve('static'));


// 将所有的get请求都导向主页
APIRouter.get('/',	async (ctx)=>{
	await ctx.render('index.html')
})


APIRouter.post('/addUnfinished', task.addUnfinished);
APIRouter.post('/findTask', task.findTask);
APIRouter.post('/unfinishedToFinished', task.unfinishedToFinished);
APIRouter.post('/finishedToUnfinished', task.finishedToUnfinished);
APIRouter.post('/deleteUnfinished', task.deleteUnfinished);
APIRouter.post('/deleteFinished', task.deleteFinished);

app.use(APIRouter.routes());


app.listen(3002);