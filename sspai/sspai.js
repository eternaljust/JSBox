// 少数派api接口数据来源于charles抓包
// 反馈邮箱: tzqiang1118@163.com

// 加载下一页数据的offset
var offset = 1
// 少数派api
let api = "https://sspai.com/post/"
// 当前时间戳
let timestamp = Date.parse(new Date())
timestamp = timestamp / 1000
// 列表视图list的cell模板
let template = [{
    type: "image",
    props: {
      id: "image"
    },
    layout: function(make, view) {
      make.top.right.left.inset(5)
      make.height.equalTo(100)
    }
  },
  {
    type: "label",
    props: {
      id: "title",
      font: $font(16),
      lines: 2
    },
    layout: function(make) {
      make.top.equalTo(110)
      make.right.equalTo(-5)
      make.left.inset(5)
      make.height.equalTo(40)
    }
  },
  {
    type: "label",
    props: {
      id: "content",
      textColor: $color("#666666"),
      font: $font(13),
      lines: 2
    },
    layout: function(make) {
      make.left.right.equalTo($("title"))
      make.bottom.inset(21)
      make.height.equalTo(32)
    }
  },
  {
    type: "label",
    props: {
      id: "time",
      font: $font(11),
      textColor: $color("#999999"),
      align: $align.right
    },
    layout: function(make) {
      make.bottom.inset(5)
      make.right.equalTo(-5)
      make.height.equalTo(11)
    }
  },
  {
    type: "label",
    props: {
      id: "count",
      font: $font(11),
      textColor: $color("#999999")
    },
    layout: function(make, view) {
      make.centerX.equalTo(view.super)
      make.bottom.inset(5)
      make.height.equalTo(11)
    }
  },
  {
    type: "label",
    props: {
      id: "nickname",
      font: $font(11),
      textColor: $color("#999999")
    },
    layout: function(make) {
      make.left.bottom.inset(5)
      make.height.equalTo(11)
    }
  }
]

// 初始化加载首页数据
loadData()

// ui绘制界面
$ui.render({
  views: [{
    type: "list",
    props: {
      rowHeight: 210,
      template: template,
    },
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath) {
        let url = sender.data[indexPath.row]["url"]

        // 跳转到web链接
        pushPage(url)
      },
      didReachBottom: function(sender) {
        // 加载下一页      
        loadData()
      }
    }
  }]
})

// 列表
var list = $("list")

// 加载数据(分页加载)
function loadData() {
  $ui.toast("加载数据中...")

  $http.request({
    method: "get",
    url: "https://ios.sspai.com/api/v1/index/article/get?offset=" + offset + "&recommend_to_home_at=" + timestamp + "&type=index&user_id=0",
    handler: function(resp) {
      list.endFetchingMore()
      let data = resp.data

      if (data.error != 0) {
        $ui.toast("加载失败!")
        return
      }
      reloadData(resp.data)

      // 下一页
      offset += 10
    }
  })
}

// 处理刷新数据
function reloadData(resp) {
  var articles = resp.data
  var data = list.data

  for (let article of articles) {
    // 列表数据源添加数据
    data.push({
      title: {
        text: article.title
      },
      content: {
        text: article.summary
      },
      count: {
        text: "❤️" + article.like_total + " 📝" + article.comment_total
      },
      nickname: {
        text: article.author.nickname
      },
      time: {
        text: getTime(article.released_at)
      },
      image: {
        src: article.banner
      },
      url: api + article.id
    })
  }

  // 列表刷新加载下一页数据
  list.data = data
}

// 跳转到详情(web)
function pushPage(url) {
  $ui.push({
    views: [{
      type: "web",
      props: {
        url: url
      },
      layout: $layout.fill
    }]
  })
}

// 时间戳转换
function getTime(timestamp) {
  var date = new Date(timestamp * 1000)
  //let Y = date.getFullYear() + "-"
  let M = date.getMonth() + 1 + "-"
  let d = date.getDate() + " "
  let H = date.getHours() + ":"
  let m = date.getMinutes()

  return M + d + H + m
}