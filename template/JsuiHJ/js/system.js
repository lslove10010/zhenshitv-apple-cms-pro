var zanpian = {
  'browser': {
    'url': document.URL,
    'domain': document.domain,
    '127.0.0.1': document.title,
    'language': (navigator.browserLanguage || navigator.language).toLowerCase(),
    'canvas': function () {
      return !!document.createElement('canvas').getContext;
    }(),
    'useragent': function () {
      var ua = navigator.userAgent;
      return {
        'mobile': !!ua.match(/AppleWebKit.*Mobile.*/),
        'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
        'iPhone': ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1,
        'iPad': ua.indexOf('iPad') > -1,
        'trident': ua.indexOf('Trident') > -1,
        'presto': ua.indexOf('Presto') > -1,
        'webKit': ua.indexOf('AppleWebKit') > -1,
        'gecko': ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1,
        'weixin': ua.indexOf('MicroMessenger') > -1
      };
    }()
  },
  'cms': {
    'floatdiv': function () {
      $("<link>").attr({
        rel: "stylesheet",
        type: "text/css",
        href: cms.public + "becool/showfloatdiv/css/showfloatdiv.css"
      }).appendTo("head");
      $.getScript(cms.public + "becool/showfloatdiv/js/showfloatdiv.js", function () {});
    },
    'tab': function () {
      $("#myTab li a").click(function (e) {
        $(this).tab('show');
      });
    },
    'collapse': function () {
      var w = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
      if (w > 640) {
        $(".list_type").addClass("in");
      }
    },
    'scrolltop': function () {
      var a = $(window);
      $scrollTopLink = $("a.backtop");
      a.scroll(function () {
        500 < $(this).scrollTop() ? $scrollTopLink.css("display", "block") : $scrollTopLink.css("display", "none")
      });
      $scrollTopLink.on("click", function () {
        $("html, body").animate({
          scrollTop: 0
        }, 400);
        return !1
      })
    },
    'modal': function (url) {
      $('.zanpian-modal').modal('hide');
      $(".modal-dialog .close").trigger('click');
      $('.zanpian-modal').remove();
      $('.modal-backdrop').remove();
      $.ajax({
        type: 'get',
        cache: false,
        url: url,
        timeout: 3000,
        success: function ($html) {
          $('body').append($html);
          $('.zanpian-modal').modal('show');
          $("body").css("padding", "0px");
          $("body").css("padding-top", "60px");
        }
      })
    },
    'all': function (url) {
      $('body').on("click", "#login,#user_login,#navbar_user_login", function (event) {
        $('.zanpian-modal').modal('hide');
        if (!zanpian.user.islogin()) {
          event.preventDefault();
          zanpian.user.loginform();
          return false;
        }
      });
      $('.navbar-search').click(function () {
        $('.user-search').toggle();
        $('#nav-signed,#example-navbar-collapse').hide();
      })
      $('.navbar-navmore').click(function () {
        $('.user-search').toggle();
        $('#nav-signed,.user-search').hide();
      })
      $('body').on("click", "#register", function () {
        zanpian.cms.modal(cms.root + 'index.php?s=user-reg-ajax');
        zanpian.user.reg();
      });
      $('body').on("click", ".more-click", function () {
        var self = $(this);
        var box = $(this).attr('data-box');
        var allNum = $(this).attr('data-count');
        var buNum = allNum - $(this).attr('data-limit');
        var sta = $(this).attr('data-sta');
        var hideItem = $('.' + box).find('li[rel="h"]');
        if (sta == undefined || sta == 0) {
          hideItem.show(200);
          $(this).find('span').text('收起部分' + buNum);
          self.attr('data-sta', 1);
        } else {
          hideItem.hide(200);
          $(this).find('span').text('查看全部' + allNum);
          self.attr('data-sta', 0);
        }
      });
      var prevpage = $("#pre").attr("href");
      var nextpage = $("#next").attr("href");
      $("body").keydown(function (event) {
        if (event.keyCode == 37 && dp != undefined) {
          dp.seek(dp.video.currentTime - 15);
        }
        if (event.keyCode == 39 && dp != undefined) {
          dp.seek(dp.video.currentTime + 15);
        }
      });
      $('body').on("click", "#player-shrink", function () {
        $(".player_right").toggle();
        $(".player_left").toggleClass("max");
        $(".player-shrink").toggleClass("icon-left");
      });
      if ($('.player_playlist').length > 0) {
        zanpian.player.playerlist();
      }
      $(window).resize(function () {
        zanpian.player.playerlist();
      });
      $(".player-tool em").click(function () {
        $html = $(this).html();
        try {
          if ($html == '关灯') {
            $(this).html('开灯')
          } else {
            $(this).html('关灯')
          }
        } catch (e) {}
        $(".player-open").toggle(300);
        $(".player_left").toggleClass("player-top")
        $(".player_right").toggleClass("player-top")
      });
    }
  },
  'list': {
    'more': function () {
      if ($('#content-more').length > 0) {
        var msg_list_loading = false;
        var i = 2;
        $(window).scroll(function () {
          if (!msg_list_loading) {
            load_more_msg(more_ajax_url);
          }
        })

        function load_more_msg(url) {
          var winH = $(window).height();
          var pageH = $(document.body).height();
          var scrollT = $(window).scrollTop();
          var aa = (pageH - winH - scrollT) / winH;
          if (aa < 0.02) {
            msg_list_loading = true;
            $("#content-more").append('<div class="loading" id="moreloading">正在加载中</div>');
            $.get(url + '-p-' + i, function (data, status) {
              var value = jQuery('#content-more', data).html();
              $("#content-more").find("#moreloading").remove();
              if (value == null || value == '') {
                value = '<div class="kong">抱歉，已经没有数据了！</div>';
                msg_list_loading = true;
                $("#content-more").append(value);
                return false;
              }
              $("#content-more").append(value);
              msg_list_loading = false;
              $(".loading").lazyload({
                effect: 'fadeIn'
              });
              i++;
            });
          }
        }
      }
    },
    'ajax': function () {
      $('body').on("click", ".list_type ul li a", function (e) {
        if (type_parms != undefined && type_parms != null) {
          var curdata = $(this).attr('data').split('-');
          if (curdata[0] == 'id' || curdata[0] == 'sid') {
            type_parms = {
              "id": curdata[1],
              "mcid": "0",
              "area": "0",
              "year": "0",
              "letter": "0",
              "sid": "0",
              "wd": "0",
              "sex": "0",
              "zy": "0",
              "order": "0",
              "picm": 1,
              "p": 1
            };
            deltype();
          }
          type_parms[curdata[0]] = curdata[1];
          type_parms['p'] = 1;
          url = parseurl(type_parms);
          $(this).parent().siblings().children("a").removeClass('active');
          $(this).addClass('active');
          zanpian.list.url(url);
          deltitle()
        }
        return false;
      });
      $('body').on("click", ".ajax-page ul li a,.tv_detail_week a", function (e) {
        e.preventDefault();
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        var curdata = $(this).attr('data').split('-');
        type_parms[curdata[0]] = curdata[1];
        var url = parseurl(type_parms);
        zanpian.list.url(url);
      });
      $('body').on("click", ".seach-nav-tabs li a", function (e) {
        e.preventDefault();
        var curdata = $(this).attr('data').split('-');
        type_parms[curdata[0]] = curdata[1];
        type_parms['p'] = 1;
        var url = parseurl(type_parms);
        $('.seach-nav-tabs li a').each(function (e) {
          $(this).removeClass('active');
        });
        $(this).addClass('active');
        zanpian.list.url(url);
      });
      $('body').on("click", "#conreset a", function (e) {
        var curdata = $(this).attr('data').split('-');
        type_parms = {
          "id": curdata[1],
          "mcid": "0",
          "area": "0",
          "year": "0",
          "letter": "0",
          "sid": "0",
          "wd": "0",
          "sex": "0",
          "zy": "0",
          "order": "0",
          "picm": 1,
          "p": 1
        };
        url = parseurl(type_parms);
        zanpian.list.url(url);
        deltype();
        deltitle();
      });

      function deltitle() {
        var constr = '';
        $('.list_type ul li a').each(function (e) {
          if ($(this).attr('class') == 'active') {
            if ($(this).html() == '全部') constr += ' ';
            else constr += '<span>' + $(this).html() + '</span>';
          }
        });
        if (constr != '') $('.conbread').html(constr);
      }

      function deltype() {
        $('.list_type ul li a').each(function (e) {
          $(this).removeClass('active');
          if ($(this).html() == '全部') {
            $(this).attr('class', 'active');
          }
        });
        return false;
      }

      function emptyconbread() {
        $('.list_type ul li a').each(function (e) {
          $(this).removeClass('active');
          if ($(this).html() == '全部') {
            $(this).attr('class', 'active');
          }
        });
        return false;
      }

      function parseurl(rr) {
        var url = cms.root + type_ajax_url;
        for (var c in rr) {
          if (rr[c] != '0') {
            url = url + "-" + c + "-" + rr[c];
          }
        }
        return url;
      }
    },
    'url': function (url) {
      $("#content").html('<div class="loading">拼命讀取中……</div>');
      $.get(url, function (data, status) {
        var value = jQuery('#content', data).html();
        if (value == null || value == '') {
          value = '<div class="kong">抱歉，沒有找到相關內容！</div>';
        }
        $("#content").html(value);
        $("#short-page").html(jQuery('#short-page', data).html())
        $("#long-page").html(jQuery('#long-page', data).html())
        $("#total-page").html(jQuery('#total-page', data).html())
        $("#current-page").html(jQuery('#current-page', data).html())
        $("#count").html(jQuery('#count', data).html())
        $(".loading").lazyload({
          effect: 'fadeIn'
        });
        if (zanpian.browser.language == 'zh-hk' || zanpian.browser.language == 'zh-tw') {
          $(document.body).s2t();
        }
      });
    },
  },
  'detail': {
    'collapse': function () {
      $('body').on("click", "[data-toggle=collapse]", function () {
        $this = $(this);
        $($this.attr('data-target')).toggle();
        $($this.attr('data-default')).toggle();
        if ($this.attr('data-html')) {
          $data_html = $this.html();
          $this.html($this.attr('data-html'));
          $this.attr('data-html', $data_html);
        }
        if ($this.attr('data-val')) {
          $data_val = $this.val();
          $this.val($this.attr('data-val'));
          $this.attr('data-val', $data_val);
        }
      });
    },
    'playlist': function () {
      $(".player-more .dropdown-menu li").click(function () {
        $("#playTab").find('li').removeClass('active');
        var activeTab = $(this).html();
        var prevTab = $('.player-more').prev('li').html();
        $('.player-more').prev('li').addClass('active').html(activeTab);
        $(this).html(prevTab);
      });
      if ($('.player-more').length > 0) {
        $(".dropdown-menu li.active").each(function () {
          var activeTab = $(this).html();
          var prevTab = $('.player-more').prev('li').html();
          $('.player-more').prev('li').addClass('active').html(activeTab);
          $(this).html(prevTab).removeClass('active');
        });
      }
      $(".mplayer .dropdown-menu li").click(function () {
        var sclass = $(this).find('a').attr('class');
        var stext = $(this).text();
        $("#myTabDrop2 .name").text(stext);
        $("#myTabDrop2").removeClass($("#myTabDrop2").attr('class'));
        $("#myTabDrop2").addClass(sclass);
      });
      var WidthScreen = true;
      for (var i = 0; i < $(".playlist ul").length; i++) {}

      function series(div, n1, n2) {
        var len = div.find("li").length;
        var n = WidthScreen ? n1 : n2;
        if (len > 24) {
          for (var i = n2 + 18; i < len - ((n1 / 2) - 2) / 2; i++) {
            div.find("li").eq(i).addClass("hided");
          }
          var t_m = "<li class='more open'><a target='_self' href='javascript:void(0)'>更多剧集</a></li>";
          div.find("li").eq(n2 + 17).after(t_m);
          var more = div.find(".more");
          var _open = false;
          div.css("height", "auto");
          more.click(function () {
            if (_open) {
              div.find(".hided").hide();
              $(this).html("<a target='_self' href='javascript:void(0)'>更多剧集</a>");
              $(this).removeClass("closed");
              $(this).addClass("open");
              $(this).insertAfter(div.find("li").eq(n2 + 17));
              _open = false;
            } else {
              div.find(".hided").show();
              $(this).html("<a target='_self' href='javascript:void(0)'>收起剧集</a>");
              $(this).removeClass("open");
              $(this).addClass("closed");
              $(this).insertAfter(div.find("li:last"));
              _open = true;
            }
          })
        }
      }
    },
    'download': function () {
      $.ajaxSetup({
        cache: true
      });
      if ($("#downlist").length) {
        $.getScript(cms.public + "js/down.js");
      }
    },
  },
  'player': {
    'playerlist': function () {},
    'vip_callback': function ($vod_id, $vod_sid, $vod_pid, $status, $trysee, $tips) {
      if ($status != 200) {
        if ($trysee > 0) {
          window.setTimeout(function () {
            $.get(cms.root + 'index.php?s=home-vod-vip-type-trysee-id-' + $vod_id + '-sid-' + $vod_sid + '-pid-' + $vod_pid, function (html) {
              var index = '<div class="embed-responsive embed-responsive-16by9"><div id="zanpiancms-player-vip"><div class="zanpiancms-player-box jumbotron">' + html + '</div></div></div>';
              $('#zanpiancms_player').html(index);
            }, 'html');
          }, 1000 * 60 * $trysee);
        } else {
          $('#zanpiancms-player-vip .zanpiancms-player-box').html($tips).addClass("jumbotron");
          $('#zanpiancms-player-vip .zanpiancms-player-iframe').hide();
        }
        $('body').on("click", "#user-weixinpwd", function () {
          $(this).text('Loading...');
          $pwd = $(".password").val();
          $.get(cms.root + 'index.php?s=home-vod-vip-type-pwd-id-' + $vod_id + '-sid-' + $vod_sid + '-pid-' + $vod_pid + '-pwd-' + $pwd, function (json) {
            if (json.status == 200) {
              zanpian.user.iframe();
            } else {
              $("#user-weixinpwd").text('播放');
              alert('密码错误或失效,请重新回复');
            }
          }, 'json');
        });
        $('body').on("click", "#user-price", function () {
          $(this).text('Loading...');
          $.get(cms.root + 'index.php?s=home-vod-vip-type-ispay-id-' + $vod_id + '-sid-' + $vod_sid + '-pid-' + $vod_pid, function (json) {
            if (json.status == 200) {
              zanpian.user.iframe();
            } else if (json.status == 500 || json.status == 501) {} else {
              $('#zanpiancms-player-vip .zanpiancms-player-box').html(json.info).addClass("jumbotron");
            }
          }, 'json');
        });
      } else {}
    },
  },
  'updown': {
    'load': function () {
      if ($('#updown').length > 0) {
        $('body').on("click", "#updown #up,#updown #down", function () {
          $.showfloatdiv({
            txt: '数据提交中...',
            cssname: 'loading'
          });
          $.ajax({
            type: 'get',
            dataType: 'json',
            cache: false,
            url: cms.root + "index.php?s=home-updown-index-id-" + $(this).attr("data-id") + "-type-" + $(this).attr("data-type") + "-sid-" + $(this).attr("data-sid"),
            timeout: 3000,
            success: function (r) {
              $.hidediv(r);
              if (parseInt(r.rcode) > 0) {
                $(this).find('#count').text($(this).find('$count').text() + 1)
              }
            }
          });
        });
      }
      $("#flower").hover(function () {
        $(this).find("#flower-count").text("送花");
      }, function () {
        var count = $(this).find("#flower-count").attr("data-count")
        $(this).find("#flower-count").text(count);
      });
      $('body').on("click", "#flower", function () {
        $.showfloatdiv({
          txt: '数据提交中...',
          cssname: 'loading'
        });
        $.ajax({
          type: 'get',
          dataType: 'json',
          cache: false,
          url: cms.root + "index.php?s=home-flower-index-id-" + $(this).attr("data-id") + "-sid-" + $(this).attr("data-sid"),
          timeout: 3000,
          success: function (r) {
            $.hidediv(r);
            if (parseInt(r.rcode) > 0) {
              $("#flower-count").text(r.data)
              $("#flower-count").attr('data-count', r.data)
            }
          }
        });
      });
    },
  },
  'barrage': {
    'index': function () {
      $.ajaxSetup({
        cache: true
      });
      if ($(".play_barrage").length) {
        $("<link>").attr({
          rel: "stylesheet",
          type: "text/css",
          href: cms.public + "admin/barrager/barrager.css"
        }).appendTo("head");
        $.getScript(cms.public + "admin/barrager/jquery.barrager.js");
      }
      if ($('.barrage_switch').is('.on')) {
        zanpian.barrage.get();
      }
      $('body').on("click", "#slider", function () {
        if ($('.barrage_switch').is('.on')) {
          $('.barrage_switch').removeClass('on');
          $.fn.barrager.removeAll();
          clearInterval(looper);
          return false;
        } else {
          $('.barrage_switch').addClass('on');
          zanpian.barrage.get(0);
        }
      });
      $("#barrage-submit").click(function (e) {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        $("#barrage-form").zanpiansub({
          curobj: $("#barrage-submit"),
          txt: '数据提交中,请稍后...',
          onsucc: function (result) {
            $.hidediv(result);
            if (parseInt(result['rcode']) > 0) {
              zanpian.barrage.get(1);
            }
          }
        }).post({
          url: cms.root + 'index.php?s=user-home-addcomm'
        });
        return false;
      });
    },
    'get': function (t) {
      if (cms.id != undefined && cms.id != null && cms.id != '') {
        var url = cms.root + "index.php?s=home-barrage-index-t-" + t + "-id-" + cms.id;
      } else {
        return false;
      }
      $.getJSON(url, function (data) {
        if (typeof (data) != 'object') {
          return false;
        }
        var looper_time = data.looper_time;
        var items = data.items;
        var total = items.length;
        var run_once = true;
        var index = 0;
        barrager();

        function barrager() {
          if (t == 0) {
            if (run_once) {
              looper = setInterval(barrager, looper_time);
              run_once = false;
            }
          }
          $('#zanpiancms_player').barrager(items[index]);
          if (t == 0) {
            index++;
            if (index == total) {
              clearInterval(looper);
              return false;
            }
          }
        }
      });
    }
  },
  'love': {
    'load': function () {
      $(".user-bt").each(function () {
        var a = $(this).find(".sect-btn"),
          b = $(this).find(".cancel"),
          c = $(this).find(".sect-show");
        a.click(function () {
          if (!zanpian.user.islogin()) {
            zanpian.user.loginform();
            return false;
          }
          $.showfloatdiv({
            txt: "数据提交中...",
            cssname: "loading"
          });
          var d = $(this);
          $.ajax({
            type: 'get',
            cache: false,
            url: cms.root + "index.php?s=home-mark-" + a.attr("data-type") + "-id-" + a.attr("data-id") + "-cid-" + a.attr("data-cid"),
            timeout: 3000,
            success: function (a) {
              $.hidediv(a), parseInt(a.rcode) > 0 ? (d.hide(), c.show(), b.show()) : parseInt(a["yjdy"]) > 0 && 1 == parseInt(a["yjdy"]) && (d.hide(a), c.show(), b.show())
            }
          })
        }), b.click(function () {
          $.showfloatdiv({
            txt: "数据提交中...",
            cssname: "loading"
          }), $.ajax({
            type: 'get',
            cache: false,
            url: cms.root + "index.php?s=home-mark-" + a.attr("data-type") + "-id-" + a.attr("data-id") + "-cid-" + a.attr("data-cid"),
            timeout: 3000,
            success: function (b) {
              $.hidediv(b), parseInt(b.rcode) > 0 && (a.show(), c.hide())
            }
          })
        })
      })
    },
  },
  'score': {
    'load': function () {
      if (cms.id != undefined && cms.id != null && cms.id != '' && $('#zanpian-score').length > 0 && $('#zanpian-cm').length <= 0) {
        zanpian.score.ajax(cms.root + "index.php?s=home-mark-ajax-id-" + cms.id)
      }
    },
    'loading': function () {
      if (cms.id != undefined && cms.id != null && cms.id != '' && $('#zanpian-score').length > 0) {
        zanpian.score.ajax(cms.root + "index.php?s=home-mark-ajax-id-" + cms.id)
      }
    },
    'ajax': function (url) {
      $.ajax({
        url: url,
        cache: false,
        timeout: 3000,
        success: function (data) {
          if (data.star != undefined && data.star != null) {
            zanpian.score.stars(data.star);
          };
        }
      });
      return false;
    },
    'stars': function (r) {
      if ($("#rating")) {
        $("ul.rating li").each(function () {
          var b = $(this).attr("title"),
            c = $("ul.rating li"),
            d = $(this).index(),
            e = d + 1;
          $(this).click(function () {
            hadpingfen > 0 ? ($.showfloatdiv({
              txt: "已经评分,请务重复评分"
            }), $.hidediv({})) : ($.showfloatdiv({
              txt: "数据提交中...",
              cssname: "loading"
            }), c.removeClass("active"), $("ul.rating li:lt(" + e + ")").addClass("active"), $("#ratewords").html(b), $.post(cms.root + "index.php?s=home-mark-add", {
              val: $(this).attr("val"),
              id: cms.id,
              sid: cms.sid
            }, function (a) {
              if (parseInt(a.rcode) == 1) {
                $.ajax({
                  type: 'get',
                  cache: false,
                  timeout: 3000,
                  url: cms.root + "index.php?s=home-mark-ajax-id-" + cms.id,
                  success: function (data) {
                    zanpian.score.stars(data.star);
                  }
                });
              }
              parseInt(a.rcode) > 0 ? ($.hidediv(a), loadstat(), hadpingfen = 1) : -2 == parseInt(a.rcode) ? (hadpingfen = 1, $.showfloatdiv({
                txt: "已经评分,请务重复评分"
              }), $.hidediv({})) : ($.closefloatdiv(), $("#innermsg").trigger("click"))
            }, "json"))
          }).hover(function () {
            this.myTitle = this.title, this.title = "", $(this).nextAll().removeClass("active"), $(this).prevAll().addClass("active"), $(this).addClass("active"), $("#ratewords").html(b)
          }, function () {
            this.title = this.myTitle, $("ul.rating li:lt(" + e + ")").removeClass("hover")
          })
        }), $(".rating-panle").hover(function () {
          $(this).find(".rating-show").show()
        }, function () {
          $(this).find(".rating-show").hide()
        })
      }
      var hadpingfen = 0;
      var curstars = parseInt(r.mystars);
      $("#pa").html(r['curpingfen'].a + "人");
      $("#pb").html(r['curpingfen'].b + "人");
      $("#pc").html(r['curpingfen'].c + "人");
      $("#pd").html(r['curpingfen'].d + "人");
      $("#pe").html(r['curpingfen'].e + "人");
      $("#vgold").html(r['curpingfen'].pinfen);
      var totalnum = parseInt(r['curpingfen'].a) + parseInt(r['curpingfen'].b) + parseInt(r['curpingfen'].c) + parseInt(r['curpingfen'].d) + parseInt(r['curpingfen'].e);
      if (totalnum > 0) {
        $("#pam").css("width", ((parseInt(r['curpingfen'].a) / totalnum) * 100) + "%");
        $("#pbm").css("width", ((parseInt(r['curpingfen'].b) / totalnum) * 100) + "%");
        $("#pcm").css("width", ((parseInt(r['curpingfen'].c) / totalnum) * 100) + "%");
        $("#pdm").css("width", ((parseInt(r['curpingfen'].d) / totalnum) * 100) + "%");
        $("#pem").css("width", ((parseInt(r['curpingfen'].e) / totalnum) * 100) + "%")
      };
      if (r['hadpingfen'] != undefined && r['hadpingfen'] != null) {
        hadpingfen = 1;
      }
      var PFbai = r['curpingfen'].pinfen * 10;
      if (PFbai > 0) {
        $("#rating-main").show();
        $("#rating-kong").hide();
        $("#fenshu").animate({
          'width': parseInt(PFbai) + "%"
        });
        $("#total").animate({
          'width': parseInt(PFbai) + "%"
        });
        $("#pingfen").html(r['curpingfen'].pinfen);
        $("#pingfen2").html(r['curpingfen'].pinfen);
      } else {
        $("#rating-main").hide();
        $("#rating-kong").show();
        $(".loadingg").addClass('nopingfen').html('暂时没有人评分，赶快从左边打分吧！');
      };
      if (r['loveid'] != null) {
        $("#love").hide();
        $("#yeslove").show();
      } else {
        $("#love").show();
        $("#yeslove").hide();
      }
      if (r['remindid'] != null) {
        $("#remind").hide();
        $("#yesremind").show();
      } else {
        $("#remind").show();
        $("#yesremind").hide();
      }
      if (curstars > 0) {
        var curnum = curstars - 1;
        $("ul.rating li:lt(" + curnum + ")").addClass("current");
        $("ul.rating li:eq(" + curnum + ")").addClass("current");
        $("ul.rating li:gt(" + curnum + ")").removeClass("current");
        var arr = new Array('很差', '较差', '还行', '推荐', '力荐');
        $("#ratewords").html(arr[curnum]);
      }
    },
  },
  'playlog': {
    'Json': '',
		'Limit':10,
    'load': function () {
      //zanpian.playlog.set();
      zanpian.playlog.get();
    },
    'get': function () {
      if ($(".mac_history_set2").attr('data-id')) {
        var $that = $(".mac_history_set2");
        zanpian.playlog.set($that.attr('data-id'), $that.attr('data-name'), $that.attr('data-playname'), $that.attr('data-link'));
      }
      if ($("#user_playlog").eq(0).length) {
        var jsondata = [];
        if (this.Json) {
          jsondata = this.Json;
        } else {
          var jsonstr = MAC.Cookie.Get('mac_history2');
          if (jsonstr != undefined) {
            jsondata = eval(jsonstr);
          }
        }
        var html = '<div class="playlog-tool"><a class="playlog-clear" rel="nofollow" href="javascript:;" id="playlog-clear" target="_self">清空全部播放记录</a><a class="playlog-close" rel="nofollow" href="javascript:;" id="playlog-close" target="_self">关闭</a></div>';
        html += '<ul>';
        if (jsondata.length > 0) {
          for ($i = 0; $i < jsondata.length; $i++) {
            html += '<li><h5><a href="' + jsondata[$i].link + '">' + jsondata[$i].name + '</a><em>/</em><a target="_blank" href="' + jsondata[$i].link + '">' + jsondata[$i].playname + '</a></h5> <a class="pull-right" target="_blank" href="' + jsondata[$i].link + '">播放</a> </li>';
          }
        } else {
          html += '<strong>暂无观看历史记录列表</strong>';
        }
        html += '</ul>';
        html += '<div class="playlog-todo text-muted" id="playlog-todo"><a rel="nofollow" class="text-color" href="javascript:;">&nbsp;</a><a rel="nofollow" class="text-color" href="javascript:;">&nbsp;</a></div>';
        $(".playlog_list").html(html);
        $('#user_playlog').hover(function () {
          $(this).children('.playlog_list').stop(true, true).show();
        }, function () {
          $(this).children('.playlog_list').stop(true, true).hide();
        })
        $('body').on("click", "#playlog-clear", function () {
          MAC.Cookie.Del('mac_history2');
          $(".playlog_list ul").html('<strong>暂无观看历史记录列表</strong>');
        });
        $('body').on("click", "#playlog-del", function (event) {
          event.preventDefault();
          $(this).parent().remove();
        });
        $('body').on("click", "#playlog-close", function () {
          $('.playlog_list').stop(true, true).hide();
        });
      }
    },
    'set': function (id, name, playname, link) {
      if (!link) {
        link = document.URL;
      }
      var jsondata = MAC.Cookie.Get('mac_history2');

      if (jsondata != undefined) {
        this.Json = eval(jsondata);

        for ($i = 0; $i < this.Json.length; $i++) {
          if (this.Json[$i].link == link) {
            return false;
          }
        }

        jsonstr = '{log:[{"id":"' + id + '","name":"' + name + '","playname":"' + playname + '","link":"' + link + '"},';
        for ($i = 0; $i < this.Json.length; $i++) {
          if ($i <= this.Limit && this.Json[$i] ) {
						if(this.Json[$i].id!=id){
              jsonstr += '{"id":"' + this.Json[$i].id + '","name":"' + this.Json[$i].name + '","playname":"' + this.Json[$i].playname + '","link":"' + this.Json[$i].link + '"},';
						}else{
							continue;
						}
          } else {
            break;
          }
        }
        jsonstr = jsonstr.substring(0, jsonstr.lastIndexOf(','));
        jsonstr += "]}";
      } else {
        jsonstr = '{log:[{"id":"' + id + '","name":"' + name + '","playname":"' + playname + '","link":"' + link + '"}]}';
      }
      this.Json = eval(jsonstr);
      MAC.Cookie.Set('mac_history2', jsonstr, this.Days);
    },
  },
  'cm': {
    'load': function () {
      if ($('#zanpian-cm[data-type=zanpian]').length) {
        this.forum();
      }
      if ($('#zanpian-cm[data-type=uyan]').length) {
        this.uyan();
      }
      if ($('#zanpian-cm[data-type=changyan]').length) {
        this.changyan();
      }
    },
    'forum': function () {
      if ($('#zanpian-score').length > 0) {
        zanpian.cm.ajax(cms.root + "index.php?s=user-cm-get-id-" + cms.id + "-sid-" + cms.sid);
      } else {
        zanpian.cm.ajax(cms.root + "index.php?s=user-cm-ajax-id-" + cms.id + "-sid-" + cms.sid);
      }
      zanpian.cm.emo();
      $("#subcomm").click(function (e) {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        $("#commform").zanpiansub({
          curobj: $("#subcomm"),
          txt: '数据提交中,请稍后...',
          onsucc: function (result) {
            $.hidediv(result);
            if (parseInt(result['rcode']) > 0) {
              zanpian.cm.ajax(cms.root + "index.php?s=user-cm-ajax-id-" + cms.id + "-sid-" + cms.sid)
            }
            if (parseInt(result['rcode']) < -1) {
              zanpian.user.loginform();
              return false;
            }
          }
        }).post({
          url: cms.root + 'index.php?s=user-cm-addcm-sid-' + cms.sid + '-id-' + cms.id
        });
        return false;
      });
      $("#cmt-input-tip .form-control").focus(function () {
        $("#cmt-input-tip").hide(), $("#cmt-input-bd").show(), $("#cmt-input-bd .ui-textarea").focus()
      })
      $("#comm_txt").focus(function (e) {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
      });
    },
    'uyan': function () {
      $("#zanpian-cm").html('<div id="uyan_frame"></div>');
      $.getScript("../../v2.uyan.cc/code/uyan.js@uid=" + $('#zanpian-cm[data-type=uyan]').attr('data-uyan-uid'));
    },
    'changyan': function () {
      $appid = $('#zanpian-cm[data-type=changyan]').attr('data-changyan-id');
      $conf = $('#zanpian-cm[data-type=changyan]').attr('data-changyan-conf');
      $sourceid = cms.sid + '-' + cms.id;
      var width = window.innerWidth || document.documentElement.clientWidth;
      if (width < 768) {
        $("#zanpian-cm").html('<div id="SOHUCS" sid="' + $sourceid + '"></div><script charset="utf-8" id="changyan_mobile_js" src="../../https@changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js@client_id=' + $appid + '&conf=prod_' + $conf + '"><\/script>');
      } else {
        $("#zanpian-cm").html('<div id="SOHUCS" sid="' + $sourceid + '"></div>');
        $.getScript("https://changyan.sohu.com/upload/changyan.js", function () {
          window.changyan.api.config({
            appid: $appid,
            conf: 'prod_' + $conf
          });
        });
      }
    },
    'emo': function () {
      $.get(cms.root + 'index.php?s=user-cm-emots', function (data) {
        $("#emots").html(data);
        $('body').on("click", ".emotion", function () {
          var left = $(this).offset().left;
          var top = $(this).offset().top;
          var id = $(this).attr("data-id");
          $("#smileBoxOuter").css({
            "left": left,
            "top": top + 25
          }).show().attr("data-id", id)
        });
        $("#smileBoxOuter,.emotion").hover(function () {
          $("#smileBoxOuter").attr("is-hover", 1)
        }, function () {
          $("#smileBoxOuter").attr("is-hover", 0)
        });
        $(".emotion,#smileBoxOuter").blur(function () {
          var is_hover = $("#smileBoxOuter").attr("is-hover");
          if (is_hover != 1) {
            $("#smileBoxOuter").hide()
          }
        });
        $(".smileBox").find("a").click(function () {
          var textarea_id = $("#smileBoxOuter").attr("data-id");
          var textarea_obj = $("#reply_" + textarea_id).find("textarea");
          var textarea_val = textarea_obj.val();
          if (textarea_val == "发布评论") {
            textarea_obj.val("")
          }
          var title = "[" + $(this).attr("title") + "]";
          textarea_obj.val(textarea_obj.val() + title).focus();
          $("#smileBoxOuter").hide()
        });
        $("#smileBoxOuter").find(".smilePage").children("a").click(function () {
          $(this).addClass("current").siblings("a").removeClass("current");
          var index = $(this).index();
          $("#smileBoxOuter").find(".smileBox").eq(index).show().siblings(".smileBox").hide()
        });
        $(".comment_blockquote").hover(function () {
          $(".comment_action_sub").css({
            "visibility": "hidden"
          });
          $(this).find(".comment_action_sub").css({
            "visibility": "visible"
          })
        }, function () {
          $(".comment_action_sub").css({
            "visibility": "hidden"
          })
        })
      });
    },
    'ajax': function (url) {
      $.ajax({
        url: url,
        cache: false,
        timeout: 3000,
        success: function (data) {
          if (data.ajaxtxt != '') {
            if ($('#datalist li').length > 3) $("html,body").animate({
              scrollTop: $("#datalist").offset().top - 130
            }, 1000);
            $("#datalist").empty().html(data.ajaxtxt);
            if (zanpian.browser.language == 'zh-hk' || zanpian.browser.language == 'zh-tw') {
              $(document.body).s2t();
            }
            $("#commnum").html(data.count);
            $(".digg a").click(function (e) {
              var id = $(this).attr('data-id');
              var type = $(this).attr('data-type');
              suburl($(this).attr('data'), $(this));
              return false;
            });
            $(".reply").click(function (e) {
              var curid = $(this).attr('data-id');
              var curpid = $(this).attr('data-pid');
              var curtuid = $(this).attr('data-tuid');
              var curvid = $(this).attr('data-vid');
              var cursid = $(this).attr('data-sid');
              if (!zanpian.user.islogin()) {
                zanpian.user.loginform();
                return false;
              } else {
                if ($("#rep" + curid).html() != '') {
                  $("#rep" + curid).html('');
                } else {
                  $(".comms").html('');
                  $("#rep" + curid).html($("#commsub").html());
                  $(".emotion,#smileBoxOuter").blur(function () {
                    var is_hover = $("#smileBoxOuter").attr("is-hover");
                    if (is_hover != 1) {
                      $("#smileBoxOuter").hide()
                    }
                  });
                  $("#rep" + curid + " #comm_pid").val(curpid);
                  $("#rep" + curid + " #comm_id").val(curid);
                  $("#rep" + curid + " #comm_tuid").val(curtuid);
                  $("#rep" + curid + " #comm_sid").val(cursid);
                  $("#rep" + curid + " #comm_vid").val(curvid);
                  $("#rep" + curid + " #row_id").attr("data-id", curid)
                  $("#rep" + curid + " .recm_id").attr("id", 'reply_' + curid)
                  $("#rep" + curid + ".sub").unbind();
                  $("#rep" + curid + ".sub").click(function (e) {
                    if (!zanpian.user.islogin()) {
                      zanpian.user.loginform();
                      return false;
                    }
                    $("#rep" + curid + " #comm-sub-form").zanpiansub({
                      curobj: $("#rep" + curid + ".sub"),
                      txt: '数据提交中,请稍后...',
                      onsucc: function (result) {
                        $.hidediv(result);
                        if (parseInt(result['rcode']) > 0) {
                          zanpian.cm.ajax(cms.root + "index.php?s=user-cm-ajax-id-" + cms.id + "-sid-" + cms.sid);
                        }
                        if (parseInt(result['rcode']) < -1) {
                          zanpian.user.loginform();
                          return false;
                        }
                      }
                    }).post({
                      url: cms.root + 'index.php?s=user-cm-addrecm'
                    });
                  });
                }
              }
            });
          } else {
            $("#datalist").html('<li class="kong">目前沒有評論，趕快留個言吧！</li>');
          };
          if (data.star != undefined && data.star != null) {
            zanpian.score.stars(data.star);
          };
          $("#pages").html(data.pages);
          $("#pagetop").html(data.pagetop);
          $(".ajax-page ul a").click(function (e) {
            var pagegourl = $(this).attr('href');
            zanpian.cm.ajax(pagegourl);
            return false;
          });
        },
        dataType: 'json'
      });
      return false;
    },
  },
  'user': {
    'index': function () {
      zanpian.user.login();
      zanpian.user.reg();
      zanpian.user.home();
      zanpian.user.center();
      $('body').on("click", "#user-vip", function () {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        zanpian.cms.modal(cms.root + 'index.php?s=user-buy-index');
      });
      $('body').on("click", "#user-payment", function () {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        zanpian.user.payment();
      });
      $('body').on("click", "#user-pay-vip", function () {
        $(".form-pay-vip").zanpiansub({
          curobj: $("#pay_vip"),
          txt: "数据提交中,请稍后...",
          onsucc: function (a) {
            if ($.hidediv(a), parseInt(a["rcode"]) > 0) {
              setTimeout(function () {
                $(".modal-dialog .close").trigger('click');
              }, 500);
              $("#viptime").html(a["data"]);
              zanpian.user.iframe();
            }
            if ($.hidediv(a), parseInt(a["rcode"]) == -2) {
              zanpian.user.payment();
            } else -3 == parseInt(a["rcode"])
          }
        }).post({
          url: cms.root + "index.php?s=user-buy-index"
        }), !1;
      });
      $('body').on("click", "#user-pay-card", function () {
        $(".form-pay-card").zanpiansub({
          curobj: $(".form-pay-card"),
          txt: "充值中,请稍后...",
          onsucc: function (a) {
            if ($.hidediv(a), parseInt(a["rcode"]) > 0 || parseInt(a["code"]) > 0) {
              setTimeout(function () {
                $(".modal-dialog .close").trigger('click');
              }, 500);
              $("#usescore").html(parseInt($("#usescore").text()) + parseInt(a["data"]));
              zanpian.user.iframe();
            }
            if ($.hidediv(a), parseInt(a["rcode"]) == -2 || parseInt(a["code"]) == -2) {
              zanpian.user.payment();
            } else -3 == parseInt(a["rcode"])
          }
        }).post({
          url: cms.root + "index.php?s=user-payment-card"
        }), !1;
      });
      $('body').on("click", "#user-pay", function (e) {
        var type = $('input[name="pay_type"]:checked').val();
        var score = $("#score_ext").val();
        if (type == 'weixinpay') {
          e.preventDefault();
          zanpian.cms.modal(cms.root + 'index.php?s=user-payment-index-pay_type-' + type + '-score_ext-' + score);
          payckeck = setInterval(function () {
            check()
          }, 5000);

          function check() {
            if ($(".modal").css("display") == 'none') {
              clearInterval(payckeck);
            }
            $.get(cms.root + 'index.php?s=user-payment-check-type-weixinpay-order-' + $("#order_sign").text(), function (a) {
              if (parseInt(a["rcode"]) > 0 || parseInt(a["code"]) > 0) {
                clearInterval(payckeck);
                $("#success").html('付款成功增加' + parseInt(a["data"]) + '积分');
                $("#usescore").html(parseInt($("#usescore").text()) + parseInt(a["data"]));
                setTimeout(function () {
                  $(".modal-dialog .close").trigger('click');
                }, 5000);
                zanpian.user.iframe();
              }
            });
          }
        }
      });
    },
    'payment': function () {
      if (!zanpian.user.islogin()) {
        zanpian.user.loginform();
        return false;
      }
      zanpian.cms.modal(cms.root + 'index.php?s=user-payment-index');
    },
    'iframe': function () {
      if ($("#zanpiancms-player-vip").length > 0) {
        if ($(".zanpiancms-player-iframe").length > 0 && $('.zanpiancms-player-iframe').attr('src').indexOf("home-vod-vip-type-play") >= 0) {
          $('.zanpiancms-player-iframe').attr('src', $('.zanpiancms-player-iframe').attr('src')).show();
        } else {
          self.location.reload();
        }
      }
    },
    'islogin': function () {
      islogin = 0;
      if (document.cookie.indexOf('auth=') >= 0) {
        islogin = 1;
        return true;
      }
      return false;
    },
    'loginform': function () {
      if (!zanpian.user.islogin()) {
        zanpian.cms.modal(cms.root + 'index.php?s=user-login-ajax');
        zanpian.user.login();
      } else {
        return false;
      }
    },
    'login': function () {
      $('body').on("click", "#login-submit", function () {
        if ("" == $("#username").val()) {
          $.showfloatdiv({
            txt: "请输入用户名或邮箱"
          }), $("#username").focus(), $.hidediv({});
          return false;
        } else {
          if ("" != $("#password").val()) return $("#login-form").zanpiansub({
            curobj: $("#login-submit"),
            txt: "数据提交中,请稍后...",
            isajax: 1,
            onsucc: function (a) {
              if ($.hidediv(a), parseInt(a["rcode"]) > 0) {
                zanpian.user.iframe();
                try {
                  zanpian.playlog.get();
                  zanpian.score.loading();
                } catch (e) {}
                setTimeout(function () {
                  $(".modal-dialog .close").trigger('click');
                }, 500);
              } else -3 == parseInt(a["rcode"])
            }
          }).post({
            url: cms.root + "index.php?s=user-login-index"
          }), !1;
          $.showfloatdiv({
            txt: "请输入密码"
          }), $("#password").focus(), $.hidediv({})
        }
      })
    },
    'reg': function () {
      $('body').on("click", "#reg-submit", function () {
        if ("" == $("#reg-form #username").val()) {
          $.showfloatdiv({
            txt: "请输入用户名"
          }), $("#reg-form #username").focus(), $.hidediv({});
          return false;
        }
        if ("" == $("#reg-form #email").val()) {
          $.showfloatdiv({
            txt: "请输入邮箱"
          }), $("#reg-form #email").focus(), $.hidediv({});
          return false;
        } else {
          if ("" != $("#reg-form #password").val()) return $("#reg-form").zanpiansub({
            curobj: $("#reg-submit"),
            txt: "数据提交中,请稍后...",
            onsucc: function (a) {
              if ($.hidediv(a), parseInt(a["rcode"]) > 0) {
                try {
                  zanpian.playlog.get();
                } catch (e) {}
                setTimeout(function () {
                  $(".modal-dialog .close").trigger('click');
                }, 500);
              } else -3 == parseInt(a["rcode"])
            }
          }).post({
            url: cms.root + "index.php?s=user-reg-index"
          }), !1;
          $.showfloatdiv({
            txt: "请输入密码"
          }), $("#reg-form #password").focus(), $.hidediv({})
        }
      })
    },
    'userinfo': function () {
      if (!zanpian.user.islogin()) {
        return false;
      }
      $.ajax({
        type: 'get',
        cache: false,
        url: cms.root + 'index.php?s=user-home-flushinfo',
        timeout: 3000,
        success: function (a) {
          return -7 == parseInt(a.rcode) ? ($.showfloatdiv({
            txt: a.msg,
            classname: "error"
          }), $.hidediv({
            rcode: -1,
            msg: a.msg
          }), !1) : (a.uid > 0 && (parseInt(a.history) > 10 ? ($("#playlog-todo").html('<a target="_blank" href="' + cms.root + 'index.php?s=user-center-playlog">进入会员中心查看' + a.history + '条播放记录&gt;&gt;</a>'), $("#playlog-todo").show()) : ($("#playlog-todo").html(""), $("#playlog-todo").hide()), loginhtml = $("#navbar_user_login,#user_login").html(), $("#navbar_user_login,#user_login").html(a.html), $("#nav-signed").hide(), $(".logoutbt").unbind(), $('#navbar_user_login .nav-link').removeAttr("href"), $('#navbar_user_login').click(function () {
            $('.user-search,#example-navbar-collapse').hide();
            $(this).children('#nav-signed').toggle();
          }), $('#user_login').hover(function () {
            $(this).children('#nav-signed').stop(true, true).show();
          }, function () {
            $(this).children('#nav-signed').stop(true, true).hide();
          }), $(".logoutbt").click(function (event) {
            event.stopPropagation();
            $.showfloatdiv({
              txt: '数据提交中...',
              cssname: 'loading'
            });
            $.get(cms.root + "index.php?s=home-user-loginout", function (r) {
              if ($.hidediv(r), parseInt(r["rcode"]) > 0) {
                $("#navbar_user_login,#user_login").html(loginhtml);
                zanpian.playlog.get();
                zanpian.user.iframe();
                $("#love,#remind").show();
                $("#yeslove,#yesremind").hide();
              }
            }, 'json');
          })))
        }
      })
    },
    'home': function () {
      $('body').on("click", ".user-home-nav ul a", function () {
        var url = $(this).attr("data-url");
        if (url) {
          var txt = $(this).text();
          $(this).parents().find('li').removeClass('active');
          $(this).parent('li').addClass('active');
          $("#tab_title").text(txt);
          if ($(this).attr("data-id") == 'comm') {
            zanpian.cm.ajax(url);
            zanpian.cm.emo();
          } else {
            zanpian.user.get(url);
          }
        }
      })
    },
    'center': function () {
      if ($("#cxselect").length > 0) {
        $.cxSelect.defaults.url = cms.public + "admin/zanpiancms/libs/jquery-cxselect/js/cityData.json";
        $.cxSelect.defaults.emptyStyle = 'none';
        $('#cxselect').cxSelect({
          selects: ['province', 'city', 'area']
        });
      }
      $('body').on("click", "#send_newemail", function () {
        $.showfloatdiv({
          txt: '邮件发送中...',
          cssname: 'loading'
        });
        $.post(cms.root + "index.php?s=user-reg-send", {
          val: 1
        }, function (a) {
          $.hidediv(a);
        }, 'json')
      });
      $(".user-notice-close").click(function () {
        $(this).parent(".user-notice").fadeOut(400, 0, function () {
          $(this).parent(".user-notice").slideUp(400);
        });
        return false;
      });
      $('body').on("click", ".mdel,.del", function () {
        var parents = $(this).parents('li');
        $.showfloatdiv({
          wantclose: 2,
          succdo: function (r) {
            $("#pids").html(r.pids);
            parents.remove();
          },
          txt: '确认删除?'
        });
      });
      $('body').on("click", ".clearall", function () {
        var url = $(this).attr("data");
        $.showfloatdiv({
          wantclose: 2,
          ispost: 1,
          formid: 'clearcomm',
          url: url,
          succdo: function (r) {
            $("#pids").html(r.pids);
            zanpian.user.get(geturl);
          },
          txt: '确认删除?'
        });
      });
      zanpian.user.setuplabel();
      $('body').on("click", ".label-checkbox", function () {
        zanpian.user.setuplabel();
      });
      $('body').on("click", ".delcheckall", function () {
        checkAll('');
      });
      $('.playlog-ul,.comment-ul').on('mouseenter', 'li', function () {
        $(this).find(".ui-del,.mdel").show();
        $(this).addClass("hover");
      });
      $('.playlog-ul,.comment-ul').on('mouseleave', 'li', function () {
        $(this).find(".ui-del,.mdel").hide();
        $(this).removeClass("hover");
      });
      $('body').on("click", ".user_nav_get li", function () {
        var url = $(this).attr('data-url');
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        zanpian.user.get(url);
      });
      $('body').on("click", "#add-feedback", function () {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        zanpian.cms.modal(cms.root + 'index.php?s=user-center-addgb');
      });
      $('body').on("click", "#user-email", function () {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        zanpian.cms.modal(cms.root + 'index.php?s=user-center-iemail');
      });
      $('body').on("click", "#send-msg", function () {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        var uid = $(this).attr('data-id');
        zanpian.cms.modal(cms.root + 'index.php?s=user-home-msg-uid-' + uid);
      });
      $('body').on("click", "#add-modal-submit", function () {
        var url = $('#modal-form').attr('action');
        $("#modal-form").zanpiansub({
          curobj: $("#add-modal-submit"),
          txt: "数据提交中,请稍后...",
          onsucc: function (a) {
            if ($.hidediv(a), parseInt(a["rcode"]) > 0) {
              if (geturl) {
                zanpian.user.get(geturl);
              }
              setTimeout(function () {
                $(".modal-dialog .close").trigger('click');
              }, 500);
            } else -3 == parseInt(a["rcode"])
          }
        }).post({
          url: url
        })
      })
      $('body').on("click", ".fav-cancel", function (event) {
        $.showfloatdiv({
          wantclose: 2,
          succdo: function (r) {
            if (parseInt(r.rcode) == 1) {
              zanpian.user.get(geturl);
              zanpian.user.hot(hoturl);
              $("#pids").html(r.pids);
            }
          },
          txt: '确认删除?'
        });
      });
      $('body').on("click", ".fav-add", function (e) {
        $.showfloatdiv({
          cssname: 'loading'
        });
        var turl = $(this).attr('href');
        $.get(turl, '', function (data) {
          $.hidediv(data);
          if (parseInt(data.rcode) > 0) {
            zanpian.user.hot(hoturl);
            zanpian.user.get(geturl);
            $("#pids").html(data.pids);
          }
        }, 'json');
        return false;
      });
      $('.user-center-vodlist').on('mouseenter', '.i-rss-list', function () {
        var vid = $(this).find(".play-pic").attr('data');
        if ($("#play" + vid).attr('data') == '') {
          $.ajax({
            url: cms.root + "index.php?s=user-center-getplayurl-id-" + vid,
            success: function (r) {
              $("#play" + vid).html(r);
              $("#play" + vid).attr('data', '1');
            },
            dataType: 'json'
          });
        }
        $(this).find(".i-rss-box").show();
      });
      $('.user-center-vodlist').on('mouseleave', '.i-rss-list', function () {
        $(this).find(".i-rss-box").hide();
      });
      $('form').on('submit', function (e) {
        var url = $(this).attr('action');
        if (!url) {
          url = window.location.href;
        }
        $($(this)).zanpiansub({
          curobj: $("#submit"),
          txt: "数据提交中,请稍后...",
          onsucc: function (a) {
            $.hidediv(a);
          }
        }).post({
          url: url
        })
      })
      $('body').on("click", "#delsns", function () {
        var type = $(this).attr('data-id');
        $.showfloatdiv({
          txt: '数据提交中...',
          cssname: 'loading'
        });
        $.ajax({
          type: 'get',
          dataType: 'json',
          cache: false,
          url: cms.root + "index.php?s=user-center-sns-del-" + type,
          timeout: 3000,
          success: function (r, a) {
            $.hidediv(r);
            if (parseInt(r.code) > 0) {
              $('.btn-success').hide();
              $('.btn-default').show();
            }
          }
        });
      })
      $('body').on("click", "#addsns", function () {
        var type = $(this).attr('data-id');
        var snsckeck = setInterval(snslogin, 1000);
        window.open(cms.root + 'index.php?s=user-snslogin-' + type + "-t-1", "_blank", "width=750, height=525");

        function snslogin() {
          if (zanpian.user.islogin()) {
            zanpian.user.iframe();
            zanpian.playlog.get();
            $(".modal-dialog .close").trigger('click');
            clearInterval(snsckeck);
          } else {
            return false;
          }
        }
      })
      $('body').on("click", ".loginout", function () {
        $.showfloatdiv({
          txt: '正在退出...',
          cssname: 'loading',
          isajax: 1,
          succdo: function (r) {}
        });
        return false;
      });
    },
    'get': function (url) {
      $.ajax({
        url: url,
        cache: false,
        timeout: 3000,
        success: function (data) {
          if (data.ajaxtxt != '') {
            if ($('#datalist li').length > 3) $("html,body").animate({
              scrollTop: $("#datalist li").offset().top - 130
            }, 1000);
            $("#datalist").empty().html(data.ajaxtxt);
          } else {
            $("#datalist").html('<div class="kong">目前沒有任何資料</div>');
          };
          $("#pages").html(data.pages);
          $("#pagetop").html(data.pagetop);
          $("#total").html(data.total);
          $(".ajax-page ul a").click(function (e) {
            var pagegourl = $(this).attr('href');
            zanpian.user.get(pagegourl);
            return false;
          });
        },
        dataType: 'json'
      });
      return false;
    },
    'hot': function (url) {
      $.ajax({
        url: url,
        cache: false,
        timeout: 3000,
        success: function (data) {
          if (data.ajaxtxt != '') {
            $("#hotremind").empty().html(data);
          } else {
            $("#hotremind").html('<li class="kong">目前沒有任何資料</li>');
          };
          $("#pages").html(data.pages);
        },
        dataType: 'json'
      });
      return false;
    },
    'setuplabel': function () {
      if ($('.label-checkbox input').length) {
        $('.label-checkbox').each(function () {
          $(this).removeClass('label-checkbox-on');
        });
        $('.label-checkbox input:checked').each(function () {
          $(this).parent('label').addClass('label-checkbox-on');
        });
      };
      if ($('.label-radio input').length) {
        $('.label-radio').each(function () {
          $(this).removeClass('label-radio-on');
        });
        $('.label-radio input:checked').each(function () {
          $(this).parent('label').addClass('label-radio-on');
        });
      };
    }
  },
  'gbook': {
    'load': function () {
      $('body').on("click", "#gb_types li", function (e) {
        $("#gb_types li").each(function () {
          $(this).removeClass('active');
        });
        $(this).addClass('active');
        $("#gb_type").val($(this).attr('val'));
      });
      $('body').on("click", "#gb-submit", function () {
        if ($("#gb_nickname").val() == '') $.showfloatdiv({
          txt: "请输入您的昵称"
        }), $("#gb_nickname").focus(), $.hidediv({});
        else {
          if ("" != $("#gb_content").val()) return $("#gbook-form").zanpiansub({
            curobj: $("#gb-submit"),
            txt: "数据提交中,请稍后...",
            onsucc: function (a) {
              if ($.hidediv(a), parseInt(a["rcode"]) > 0) {
                zanpian.list.url(cms.root + "index.php?s=gb-show");
              } else -3 == parseInt(a["rcode"])
            }
          }).post({
            url: cms.root + "index.php?s=gb-add"
          }), !1;
          $.showfloatdiv({
            txt: "输入留言内容"
          }), $("#gb_content").focus(), $.hidediv({})
        }
      })
    },
  },
  'search': {
    'autocomplete': function () {
      var $limit = $('.zanpian_search').eq(0).attr('data-limit');
      if ($limit > 0) {
        $.ajaxSetup({
          cache: true
        });
        $.getScript(cms.public + "becool/js/jquery.autocomplete.min.js", function (response, status) {
          $ajax_url = cms.root + 'index.php?s=home-search-vod';
          $('.zanpian_wd').autocomplete({
            serviceUrl: $ajax_url,
            params: {
              'limit': $limit
            },
            paramName: 'q',
            maxHeight: 400,
            transformResult: function (response) {
              var obj = $.parseJSON(response);
              return {
                suggestions: $.map(obj.data, function (dataItem) {
                  return {
                    value: dataItem.vod_name,
                    data: dataItem.vod_url
                  };
                })
              };
            },
            onSelect: function (suggestion) {
              location.href = suggestion.data;
            }
          });
        });
      }
    },
  },
  'language': {
    's2t': function () {
      if (feifei.browser.language == 'zh-hk' || feifei.browser.language == 'zh-tw') {
        $.getScript("../../https@cdn.feifeicms.co/jquery/s2t/0.1.0/s2t.min.js", function (data, status, jqxhr) {
          $(document.body).s2t();
        });
      }
    },
    't2s': function () {
      if (feifei.browser.language == 'zh-cn') {
        $.getScript("../../https@cdn.feifeicms.co/jquery/s2t/0.1.0/s2t.min.js", function (data, status, jqxhr) {
          $(document.body).t2s();
        });
      }
    },
  },
  'image': {
    'swiper': function () {
      $.ajaxSetup({
        cache: true
      });
      $.getScript(cms.public + "js/swiper.min.js", function () {
        var swiper = new Swiper('.box-slide', {
          pagination: '.swiper-pagination',
          lazyLoading: true,
          preventClicks: true,
          paginationClickable: true,
          autoplayDisableOnInteraction: false,
          autoplay: 3000,
          loop: true,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
        });
        var swiper = new Swiper('.details-slide', {
          pagination: '.swiper-pagination',
          autoHeight: true,
          loop: true,
          nextButton: '.details-slide-next',
          prevButton: '.details-slide-pre',
          paginationType: 'fraction',
          keyboardControl: true,
          lazyLoading: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingInPrevNextAmount: 1,
          lazyLoadingOnTransitionStart: true,
        });
        var swiper = new Swiper('.news-switch-3', {
          lazyLoading: true,
          slidesPerView: 3,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 3,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 2,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 1,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.news-switch-4', {
          lazyLoading: true,
          slidesPerView: 4,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.news-switch-5', {
          lazyLoading: true,
          slidesPerView: 5,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-4', {
          lazyLoading: true,
          slidesPerView: 4,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 3,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-5', {
          lazyLoading: true,
          slidesPerView: 5,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 3,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-7', {
          lazyLoading: true,
          slidesPerView: 5.5,
          spaceBetween: 10,
          slidesPerGroup: 5,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4.5,
              spaceBetween: 10
            },
            767: {
              slidesPerView: 3.2,
              spaceBetween: 3,
              freeMode: true,
              slidesPerGroup: 3
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-6', {
          lazyLoading: true,
          slidesPerView: 6,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 5,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 0
            }
          }
        });
      });
    },
    'lazyload': function () {
      $.ajaxSetup({
        cache: true
      });
      $.getScript(cms.public + "js/jquery.lazyload.min.js", function (response, status) {
        $(".loading").lazyload({
          effect: "fadeIn",
          failurelimit: 15
        });
      });
    },
    'qrcode': function () {
      if ($(".qrcode")) {
        $(".qrcode").append('<img class="qrcode" src="https://bshare.optimix.asia/barCode?site=weixin&url=' + encodeURIComponent(cms.murl) + '"/>');
      }
      $("#qrcode").popover({
        html: true
      });
      $("#qrcode").on('show.bs.popover', function () {
        $("#qrcode").attr('data-content', '<img class="qrcode" src="https://bshare.optimix.asia/barCode?site=weixin&url=' + encodeURIComponent(cms.murl) + '"/>');
      })
    },
    'validate': function () {
      return '<label><img class="validate-img" src="' + cms.root + 'index.php?s=user-login-verify-' + Math.random() + '"></label>';
    },
  },
  'validate': {
    'load': function () {
      zanpian.validate.focus();
      zanpian.validate.click();
    },
    'focus': function () {
      $('body').on("focus", "#zanpian-validate", function () {
        $('#validate-zanpian,#validate-zanpian-reg').html(zanpian.image.validate());
        $(this).unbind();
      });
    },
    'click': function () {
      $('body').on('click', 'img.validate-img', function () {
        $('#validate-zanpian,#validate-zanpian-reg').html(zanpian.image.validate());
      });
    }
  },
  'language': {
    's2t': function () {
      if (zanpian.browser.language == 'zh-hk' || zanpian.browser.language == 'zh-tw') {
        $.getScript(cms.public + "js/s2t.min.js", function (data, status, jqxhr) {
          $(document.body).s2t();
        });
      }
    },
    't2s': function () {
      if (zanpian.browser.language == 'zh-cn') {
        $.getScript(cms.public + "js/s2t.min.js", function (data, status, jqxhr) {
          $(document.body).t2s();
        });
      }
    }
  },
  'hits': {
    'load': function () {
      $(".detail-hits").each(function (i) {
        var $this = $(".detail-hits").eq(i);
        $.ajax({
          url: cms.root + 'index.php?s=home-hits-show-id-' + $this.attr("data-id") + '-sid-' + $this.attr("data-sid") + '-type-' + $this.attr("data-type"),
          cache: true,
          dataType: 'json',
          success: function (data) {
            $type = $this.attr('data-type');
            if ($type != 'insert') {
              $this.html(eval('(data.' + $type + ')'));
            }
            $("#detail-hits").html(eval('(data.' + $("#detail-hits").attr('data-type') + ')'));
          }
        });
      });
    }
  },
  'mobile': {
    'jump': function () {
      if (cms.murl && (zanpian.browser.url != cms.murl)) {
        location.replace(cms.murl);
      }
    },
  },
};
$(document).ready(function () {
  //  if (zanpian.browser.useragent.mobile) {
  //    zanpian.mobile.jump();
  //  } else {
  //    zanpian.barrage.index();
  //  }
  zanpian.image.swiper();
  $('.vod-swiper-7').show();
  //zanpian.cms.floatdiv();
  zanpian.cms.all();
  zanpian.cms.tab();
  zanpian.cms.collapse();
  zanpian.cms.scrolltop();
  zanpian.image.lazyload();
  //zanpian.search.autocomplete();
  //zanpian.list.ajax();
  zanpian.detail.collapse();
  zanpian.detail.playlist();
  zanpian.detail.download();
  //zanpian.user.index();
  zanpian.gbook.load();
  zanpian.hits.load();
  zanpian.validate.load();
  zanpian.updown.load();
  zanpian.love.load();
  zanpian.playlog.load();
  //zanpian.language.t2s();

});
