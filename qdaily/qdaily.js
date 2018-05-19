// 好奇心日报api接口数据来源于charles抓包
// 反馈邮箱: tzqiang1118@163.com

// 加载下一页数据的key
var last_key = "0"
// 好奇心日报api
let api = "http://m.qdaily.com/mobile/"
// 列表list的cell模板
let template = [{
    type: "label",
    props: {
      id: "title",
      font: $font(16),
      lines: 3
    },
    layout: function(make, view) {
      make.right.equalTo(view.super.centerX)
      make.top.left.inset(5)
      make.height.equalTo(58)
    }
  },
  {
    type: "label",
    props: {
      id: "content",
      textColor: $color("#666666"),
      font: $font(13),
      lines: 4
    },
    layout: function(make) {
      make.left.right.equalTo($("title"))
      make.top.equalTo($("title").bottom).offset(3)
      make.bottom.equalTo($("time").top).offset(5)
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
      make.right.equalTo($("title"))
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
    layout: function(make) {
      make.left.equalTo(33)
      make.right.greaterThanOrEqualTo($("time").left).offset(-3)
      make.bottom.inset(5)
      make.height.equalTo(11)
    }
  },
  {
    type: "label",
    props: {
      id: "category",
      font: $font(11),
      textColor: $color("#999999")
    },
    layout: function(make) {
      make.left.bottom.inset(5)
      make.height.equalTo(11)
      make.width.equalTo(23)
    }
  },
  {
    type: "image",
    props: {
      id: "image"
    },
    layout: function(make, view) {
      make.top.right.bottom.inset(5)
      make.left.equalTo(view.super.centerX).offset(5)
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
      rowHeight: 160,
      template: template
    },
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath) {
        let url = sender.data[indexPath.row].url

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
    url: "http://app3.qdaily.com/app3/homes/index/" + last_key + ".json",
    //papers/index/0.json(另外一个接口LBAS)
    handler: function(resp) {
      list.endFetchingMore()
      let data = resp.data

      if (data.meta.status != 200) {
        $ui.toast("加载失败!")
        return
      }

      reloadData(resp.data)
    }
  })
}

// 处理刷新数据
function reloadData(resp) {
  let response = resp.response
  var data = list.data
  // 更新下一页的key
  last_key = response.last_key

  for (let feed of response.feeds) {
    let post = feed.post
    let time = post.publish_time
    let id = post.id + ".html"
    var url = ""
    if (feed.type == 0) {
      url = api + "choices/" + id
    } else {
      url = api + "articles/" + id
    }

    // 列表数据源添加数据
    data.push({
      title: {
        text: post.title
      },
      content: {
        text: post.description
      },
      count: {
        text: "🖊" + post.comment_count + " 👍🏻" + post.praise_count
      },
      category: {
        text: post.category.title
      },
      time: {
        text: getTime(time)
      },
      image: {
        src: post.image
      },
      url: url
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
  var M = date.getMonth() + 1 + "-"
  var d = date.getDate() + " "
  var H = date.getHours() + ":"
  var m = date.getMinutes()

  return M + d + H + m
}