var apis = Apis()
var mainVue = new Vue({
  el: '#main',
  data: {
    isAuth: false,
    columns: [
      {
        title: '地址',
        key: 'url',
        render: (h, params) => {
          var url = params.row.url
          return h(
            'a',
            {
              domProps: {
                href: url,
                target: '_blank'
              }
            },
            url
          )
        }
      },
      {
        title: '备注',
        key: 'remark'
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render(h, params) {
          return h(
            'i-button',
            {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => mainVue.remove(params.row)
              }
            },
            '删除'
          )
        }
      }
    ],
    bookmarks: [],
    pageSize: 10,
    pageIndex: 1
  },
  computed: {
    total() {
      return this.bookmarks.length
    },
    showItems() {
      return this.bookmarks.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      )
    }
  },
  mounted() {
    chrome.storage.sync.get('token', v => {
      global.token = v.token
      if (global.token) {
        this.isAuth = true
        this.getData()
      }
    })
  },
  methods: {
    getData() {
      apis.getBookmarks().then(v => {
        this.bookmarks = v.data
      })
    },
    remove(v) {
      apis.deleteBookmark({ recordId: v.recordId }).then(v => {
        this.bookmarks = v.data
        this.getData()
      })
    },
    changePage(page) {
      this.pageIndex = page
    }
  }
})
