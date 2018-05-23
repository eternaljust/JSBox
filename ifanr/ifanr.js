// 爱范儿api接口数据来源: https://github.com/iCodeForever/ifanr
// 反馈邮件: tzqiang1118@163.com

// 加载下一页数据的page
var page = 1
// 爱范儿api
let api = "https://ifanr.com/"
// 网格视图matrix的cell模板
let template = [{
    type: "view",
    props: {
      bgcolor: $color("#ffffff")
    },
    layout: $layout.fill
  },
  {
    type: "image",
    props: {
      id: "image"
    },
    layout: function(make) {
      make.top.left.right.inset(0)
      make.height.equalTo(120)
    }
  },
  {
    type: "label",
    props: {
      id: "category",
      font: $font(13),
      textColor: $color("#ffffff"),
      bgcolor: $color("#666666")
    },
    layout: function(make) {
      make.top.left.inset(5)
      make.height.equalTo(18)
    }
  },
  {
    type: "label",
    props: {
      id: "title",
      font: $font(15),
      lines: 2
    },
    layout: function(make) {
      make.top.equalTo($("image").bottom).offset(5)
      make.left.right.inset(5)
      make.height.equalTo(40)
    }
  },
  {
    type: "label",
    props: {
      id: "time",
      font: $font(11),
      textColor: $color("#999999")
    },
    layout: function(make) {
      make.left.bottom.inset(5)
      make.height.equalTo(11)
    }
  },
  {
    type: "label",
    props: {
      id: "count",
      font: $font(11),
      textColor: $color("#999999"),
      align: $align.right
    },
    layout: function(make) {
      make.bottom.right.inset(5)
      make.height.equalTo(11)
    }
  }
]

// 初始化加载首页数据
loadData()

// ui绘制界面
$ui.render({
  views: [{
    type: "matrix",
    props: {
      bgcolor: $color("#f6f6f6"),
      columns: 2,
      itemHeight: 185,
      spacing: 5,
      template: template
    },
    layout: $layout.fill,
    events: {
      didSelect: function(sender, indexPath, data) {
        let url = sender.data[indexPath.item].url

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

// 网格
var matrix = $("matrix")

// 加载数据(分页加载)
function loadData() {
  $ui.toast("加载数据中...")

  $http.request({
    method: "get",
    url: api + "api/v3.0/?action=ifr_m_latest&posts_per_page=12&page=" + page,
    handler: function(resp) {
      matrix.endFetchingMore()
      let data = resp.data

      if (data.status != 1) {
        $ui.alert("数据加载失败!")
        return
      }

      reloadData(data)
      // 下一页
      page ++
    }
  })
}

// 处理刷新数据
function reloadData(resp) {
  var articles = resp.data
  var data = matrix.data

  for (let article of articles) {
    // 列表数据源添加数据
    data.push({
      title: {
        text: article.title
      },
      count: {
        text: "♥️" + article.like + " ✉️" + article.comments
      },
      time: {
        text: article.pubDate.toString().slice(5, 16)
      },
      category: {
        text: "  " + article.category + "  "
      },
      image: {
        src: article.image
      },
      url: api + article.ID
    })
  }

  // 列表刷新加载下一页数据
  matrix.data = data
}

// 跳转到详情页(web)
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
