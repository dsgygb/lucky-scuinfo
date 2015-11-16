# Lucky Group 抽奖

//todo 判断开奖时间

//todo 抽奖程序


## api接口

0. 接口格式约定
	
	
		{
		header:{
		"Accept":"application/vnd.scuinfo+json;version=3",
		"Content-Type":"application/json",
		"Authorization":"token"
		   
		},
		params:{
		limit:10,  //可选 限制有多少对象可以被返回，限制范围是从 1-100 项，默认是 10 项
		starting_after: id,  //在分页时使用的指针，决定了列表的第一项从何处开始。假设你的一次请求返回列表的最后一项的 id 是 obj_end，你可以使用 starting_after = obj_end 去获取下一页
		ending_before: id, //在分页时使用的指针，决定了列表的最末项在何处结束。假设你的一次请求返回列表的最后一项的 id 是 obj_start，你可以使用 ending_before = obj_start 去获取上一页
		},
		    
		body:{
		//json
		}
		    
		//错误返回
		return:{
		type:"错误类型"
		message:"xxx",
		code:"",//错误代码
		url:""
		},
		    
		//正确返回
		return:{
		type:"array/object",string
		data: array/object //返回的数据
		}
		}

1. 组合列表

	    {url:"/api/profile",
	    method:"get",
	    header:{
	    "Authorization":"token"
	    },
	    query:{
	    //分页相关
	    },
	    return:{
	    type:"object",
	    data:
	    {
	        _id:id,
	     	activityId:100,
	    	group:[
	    	{
	    	userId:1,
	    	nickName:"小花",
	    	avatar:"http://xxx.com/xxx.jpg",
	    	luckyId:10000001,
	    	createAt:14000000,
	    	isPrimary:true,
	    	status:"是否中奖"
	    	}
	    	],
	    	createAt:1000000000,
	    	gender:1,
	    	avatar:"http://baidu.com/aa.jpg",
	    	nickname:"小明",
	    	openId:"abc",
	    	unionId:"abc"
	    }
	    }
	    
2. 成为组合

		{
		url:"/api/following/:user_id",
		method:"put",
		header:{
	    },
	    body:{
	    user_id:"",
	    access_token:""
	    },
	    return:{
	   
	    }
		}

3. 统计数据

		{
		url:"/api/stat/:activity_id",
		method:"get",
		return:{
		type:"object",
		data:{
		groups:1332, //组合数
		views:13322, //浏览量
		status:"未开奖",
		lucky_time:123431341234,//幸运抽奖时间
		}
		
		}		
		}
		
4. 增加统计


		{
		url:"/api/stat/:activity_id/inc",
		method:"put",
		body:{
		fields:"views" //groups or views,groups
		}
		
		}
		
4. 登录

		登录采取跳转方案，用户进人后会检测sessionStorage是否有access_token，如果没有,跳转到微信授权页面，授权完成后，则跳转到首页并在跳转的url里encode base64 用户的基本信息与token,客户端自行保存后跳转至首页
		
		如果有，则说明客户端已拿到用户的token和基本信息。
## 抽奖方案

每个用户生成自己的抽奖主页，将其分享到朋友圈或群里后，任意的人点击进去之后均可与之组队，并生成该队唯一的抽奖号码，系统在某个时间，统一生成100个随机的抽奖码，队伍抽奖码与之相符则为获奖，2个人都将获得大餐一份。共抽200人，100个组合。

 系统主要包括日志,抽奖，页面,微信登录系统。数据库使用mongodb,使用微信主题库,spa单页面,token


	
活动表：

	{
	_id:id,
	name:"xxx",
	description:"xxxx"
	}
	
中奖号码表
	
	{
	_id:id,
	luckyId:100000001,
	createAt:14000000000,
	activityId:10000001
	}

组合表

	{
	_id:id,
	activityId:100,
	group:[
	{
	userId:1,
	nickName:"小花",
	avatar:"http://xxx.com/xxx.jpg",
	luckyId:10000001,
	createAt:14000000,
	isPrimary:true,
	status:"是否中奖"
	}
	],
	createAt:1000000000,
	gender:1,
	avatar:"http://baidu.com/aa.jpg",
	nickname:"小明",
	openId:"abc",
	unionId:"abc"
	 }
	 
	 




