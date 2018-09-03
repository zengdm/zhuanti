define(function(require, exports, module) {
    var tip = require('tip');
    var active = function(opt) {
        this.init(opt);
    };
    var obj={
        'hd':['北京鑫敏恒瑞鑫汽车销售有限公司','北京军鹏伟业汽车销售有限公司','北京环耀盛世新能源汽车销售有限公司','北京鹏天奥汽车销售有限公司'],
        'fsh':['北京润城汽车维修有限公司'],
        'cy':['北京欣太新能源汽车销售服务有限公司','北京环耀汽车服务有限公司','北京盛世路骐汽车销售有限公司'],
        'dx':['北京鑫敏恒汽车销售有限公司'],
        'cp':['北京天通利华汽车修理有限公司'],
        'hr':['北京庞大兴迪汽车销售服务有限公司'],
        'ft':['北京福铃丰瑞汽车销售有限公司'],
        'tz':['北京市北方瑞鹏汽车服务有限公司']
    }
    active.prototype = {
        elements: {
            lastName: $('#last-name'),
            mobile: $('#mobile'),
            carlist: $('#carlist'),
            dealer: $('#dealer'),
            area:$('#area')
        },
        init: function(opt) {
            this.bindEvent();
        },
        bindEvent: function() {
            var context = this;
            $('#area').bind('change', function(){
                var id = $(this).val();
                $('#dealer').html("<option value='0'>请选择经销商</option>");
                var arr = obj[id];
                var flagment = '';
                for(var i=0;i<arr.length;i++){
                    flagment+=' <option value="'+id+'">'+arr[i]+'</option>';
                }
                $("#dealer").append(flagment);
              
            })

            // $('.radio-choose').on('click',function(){
            //      $(":checked").parent().addClass("current").siblings().removeClass("current");
            // });

            /*表单提交*/
            $('.card-form-sel-button').on('click', function() {
                 tip.info('活动已结束');
                 return false;

                // var radioUser = $("input[name='radioUser']:checked").val();
                // var name = context.elements.lastName.val();
                // var mobile = context.elements.mobile.val();
                // var cxid = context.elements.carlist.val();
                // var cxname= context.elements.carlist.find("option:selected").text();
                // var dealer = context.elements.dealer.find("option:selected").text();
                // var area = context.elements.area.val();
                // var areaName = context.elements.area.find("option:selected").text();;
                
                // if (typeof(radioUser) == "undefined"){
                //     tip.info('请选择您的身份');
                //     return false;
                // }
            
                // if (context.elements.lastName.val() === '') {
                //     tip.info('请输入真实姓名');
                //     return false;
                // }

                // if (mobile === '') {
                //     tip.info('请输入手机号码');
                //     return false;
                // }
                // if (cxid == 0) {
                //     tip.info('请选择心仪车型');
                //     return false;
                // }
                //   if (area == 0) {
                //     tip.info('请选择地区');
                //     return false;
                // }
                // if (dealer == '请选择经销商') {
                //     tip.info('请选择经销商');
                //     return false;
                // }
                // var jsonData = {
                //     name: name,
                //     mobile: mobile,
                //     cxid:cxid,
                //     car_name:cxname,
                //     ext_1: dealer,
                //     ext_2:areaName,
                //     ext_3:radioUser,
                //     activity_id:'5'
                // }

                // $.ajax({
                //     url: '//item.diandong.com/passport/ark/joinTestDirve',
                //     data: jsonData,
                //     // dataType: 'jsonp',
                //     type: 'POST',
                //     success: function(result) {
                //         console.log(result)
                //         if (result.code == 0) {
                //             if(result.message == 'success ( already join ).'){
                //                 tip.info('请勿重复报名');
                //             }else{
                //                 tip.info('报名成功');
                //                 $('form')[0].reset();
                //             }
                //         } else {
                //             tip.info(result.message);
                //         }
                //     }
                // });
            });



          
        }
    };

    module.exports = active;
});