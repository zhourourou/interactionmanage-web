export default class Dep{
    constructor(){
        //用来存放watcher对象的数组
        this.subs = [] 
    }
    //在subs中添加一个watcher对象
    addSub(sub){
        this.subs.push(sub)
    }
    //通知所有watcher对象更新视图
    notify(){
        this.subs.forEach((sub)=>{
            sub.update()
        })
    }
}

// export default class Watcher{
//     constructor(){
//         Dep.target = this;
//     }
//     update(){
//         console.log('试图更新了')
//     }
// }