    $(function () {

        let inputFeedbackType = $('#feedbackType');
        let inputFeedbackContent = $('#feedbackContent');
        let inputFeedbackContact = $('#feedbackContact');

        $('#resetFormBtn').click(function () {
            inputFeedbackContent.val('');
        });


        $('#submitFormBtn').click(function () {
            let fkjy_type = $.trim(inputFeedbackType.val());
            if (!fkjy_type) {
                alert('请先选择反馈类型');
                inputFeedbackType.focus();
                return false;
            }

            let fkjy_content = $.trim(inputFeedbackContent.val());
            if (fkjy_content.length < 1) {
                alert('请输入反馈内容~');
                inputFeedbackContent.focus();
                return false;
            }

            let fkjy_contact = $.trim(inputFeedbackContact.val());
            if (fkjy_contact.length < 1) {
                alert('请输入联系方式~');
                inputFeedbackContact.focus();
                return false;
            }
            if (fkjy_contact.indexOf('@') === -1) {
                alert('联系邮箱格式不正确~');
                inputFeedbackContact.focus();
                return false;
            }

            $.ajax({
                type: "POST",
                url: "/api/suggest",
                data: {
                    "content": "[" + fkjy_type + "] " + fkjy_content,
                    "contact": fkjy_contact,
                },
                success: function (result) {
                    jAlert(result, 'green');
                },
                error: function (e) {
                    if (e.status === 429) {
                        jAlert('提交太频繁，请稍后再试！')
                        return;
                    }
                    jAlert('【提交出错】 ' + e.responseText)
                }
            });

            $('#feedbackModal').modal('hide');
        });

         $('.get-setting-btn').click(function () {
            $.post("/api/sm",
                {
                    key: $(this).data('key'),
                },
                function (data) {
                    if (data.code === 1) {
						jAlert(data.data, 'green', true)
						setTimeout(function() {
							$('.jconfirm-buttons button').each(function() {
								$(this).css({
									'background-color': '#31c27c',
									'color': 'white',
									'border-color': '#31c27c'
									});
									});
									}, 100);
                       
                    }
                });
        });

    });
	
document.addEventListener('click', function(event) {
    var target = event.target;

    while (target && target !== document.body) {
        if (target.nodeName === 'TR' && target.closest('.table.table-hover#myTables')) {
            var links = target.getElementsByTagName('a');
            if (links.length > 0) {
                window.open(links[0].href, '_blank');
                event.preventDefault();
            }
            return;
        }
        target = target.parentNode;
    }
});

	
document.addEventListener('click', function(event) {
    var target = event.target;

    while (target && target !== document.body) {
        if (target.nodeName === 'TR' && target.closest('.table.table-hover#myTable')) {
            var links = target.getElementsByTagName('a');
            if (links.length > 0) {
                window.location.href = links[0].href;
            }
            return; 
        }
        target = target.parentNode;
    }
});
	

!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"JjlDoag99jVEA2T9",ck:"JjlDoag99jVEA2T9"});

  var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?49c19bcfda4e5fdfea1a9bb225456abe";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();