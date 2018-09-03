define(function(require, exports, module) {
    'use strict';
    var tip = require('//zhuanti.diandong.com/zt/common/mobile/js/tip/tip');
    // 立即试驾表单
    var obj;
    var form = {
        tel: '.car-tel',
        telReg: /^1[3,5,7,8]\d{9}$/,
        getVerify: '.car-get-verify',
        getedVerify: 'getedVerify',
        writeVerify: '.car-write-verify',
        verifyTimer: 60,
        submit: '#car-baming',
        hide: 'fn-hide',
        uid:'',
        //身份证头像面图片地址
        group_photo_url:'',
        //购车发票图片地址
        application_form_url:'',
        domainUrl:'//item.diandong.com',
        uploadInput:'.upload-input',
        uploadSubmit:'#form-submit',
        joinid:'',

    }
    var tips = {
        telNone: '请输入手机号码',
        telRet: '请输入正确的手机号码',
        verifyNone: '请输入验证码',
        manCar:'请上传人车合影照片',
        driveList:'请上传试驾申请单',
        bigImg:'图片超过5MB限制，请重新上传',
    }
    var telVal = '',
        verifyVal = '',
        timers;
    var GETVERIFY = form.domainUrl+'/passport/ark/sendVerifyCode';
    var SUBMIT =  form.domainUrl+'/passport/ark/weixinLogin';
    var FEEDBACKTESTDIRVE =  form.domainUrl+'/passport/ark/feedbackTestDirve';
    var CREATESIGN = form.domainUrl+'/oss/createsign';
    var trys = {
        elements: {
        },
        opt: {
        },
        init: function(opts) {
            if (opts && Object.prototype.toString.call(opts) != '[object Object]') {
                opts = {
                    opts
                }
            }
            obj = $.extend(opts, form, tips);
            this.bindEvent();
            this.getVerify();
            this.submitFrom();
            this.getParameters();
            this.bindUploads();
            this.uploadSubmit();
        },


        bindEvent: function() {
            var self = this;
           
        },

        /*
        三个参数
        file：一个是文件(类型是图片格式)，
        w：一个是文件压缩的后宽度，宽度越小，字节越小
        objDiv：一个是容器或者回调函数
        photoCompress()
         */
        photoCompress:function(file,w,objDiv){
            var that = this;
            var ready=new FileReader();
            /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
            ready.readAsDataURL(file);
            ready.onload=function(){
                var re=this.result;
                that.canvasDataURL(re,w,objDiv)
            }
        },

        canvasDataURL:function(path, obj, callback){
            var img = new Image();
            img.src = path;
            img.onload = function(){
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = obj.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);
                // 回调函数返回base64的值
                callback(base64);
            }
        },


          /**
         * 将以base64的图片url数据转换为Blob
         * @param urlData
         *   用url方式表示的base64图片数据
         */
        convertBase64UrlToBlob:function(urlData){
            var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        },

        //图片上传
        bindUploads:function(){
             var self = this;
             $(obj.uploadInput).on('change',function(){
                var that = $(this);
                var fileObj = that.prop('files')[0];
                $.ajax({
                    url:CREATESIGN,
                    type:'POST',
                    dataType:'json',
                    async: false,  
                    cache: false, 
                    contentType: false, //不设置内容类型
                    processData: false, //不处理数据
                    success:function(res){
                        // console.log(res);
                        var ret = res.data;
                        var formdata = new FormData();

                        var data = {
                            'key': ret.key,
                            'policy': ret.policy,
                            'OSSAccessKeyId': ret.accessid,
                            'success_action_status': '200',
                            'callback': ret.callback,
                            'signature': ret.signature,
                        }

                        $.each(data, function (k, v) {
                            formdata.append(k, v);  
                        })
                        var url = ret.host.split(':');
                        // console.log(fileObj);
                        if(fileObj.size/1024 > 1025 ) { //大于1M，进行压缩上传
                            // console.log('大于1m',fileObj.size);
                            if(fileObj.size/1024 > 1024*5){
                                tip.info(obj.bigImg);
                                return false
                            }
                            self.photoCompress(fileObj, {
                                quality: 0.2
                            }, function(base64Codes){
                                // console.log("压缩后：" + base64Codes.length / 1024 + " " + base64Codes);
                                var bl = self.convertBase64UrlToBlob(base64Codes);
                                formdata.append("file", bl, "file_"+Date.parse(new Date())+".jpg"); // 文件对象
                                xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                                xhr.open("POST",url[1], true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                                  xhr.onreadystatechange = function() {
                                    if (xhr.readyState === 4) {
                                        var result = JSON.parse(xhr.responseText);

                                        that.parent().find('img').prop('src', result.img_url);
                                       
                                        var types = that.attr('types');
                                        if(types == 'left'){
                                            obj.group_photo_url = result.img_url;
                                        }else{
                                            obj.application_form_url = result.img_url;
                                        }


                                    }
                                };

                                xhr.send(formdata); //开始上传，发送form数据
                            });
                        }else{
                            formdata.append('file', that.prop('files')[0]);
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', url[1]);
                            xhr.onreadystatechange = function() {
                                if (xhr.readyState === 4) {
                                    var result = JSON.parse(xhr.responseText);

                                    that.parent().find('img').prop('src', result.img_url);
                                   
                                    var types = that.attr('types');
                                    if(types == 'left'){
                                        obj.group_photo_url = result.img_url;
                                    }else{
                                        obj.application_form_url = result.img_url;
                                    }


                                }
                            };
                            xhr.send(formdata);
                        }

                    },
                    error:function(){
                        alert("上传失败！");
                    }
                })

            });
        },

        // 图片上传页点击提交
        uploadSubmit:function(){
            var self = this;
            $(obj.uploadSubmit).on('click',function(){
                  if(!obj.group_photo_url){
                    tip.info(obj.manCar);
                    return false
                 }
                 if(!obj.application_form_url){
                    tip.info(obj.driveList);
                    return false
                 }
                    var opt = {
                        uid: obj.uid,
                        group_photo_url: obj.group_photo_url,
                        application_form_url: obj.application_form_url,
                        joinid:obj.joinid     
                    }
                    console.log(opt);
                   $.ajax({
                    url: FEEDBACKTESTDIRVE,
                    data: opt,
                    type: 'POST',
                    success: function(res) {
                        console.log(res);
                        if (res.code == 0) {
                            window.location.href = "//zhuanti.diandong.com/zt/2018/07/MG/mobile/success.html";
                        } else {
                            $(self).removeAttr('disabled');
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).css("pointer-events", "auto");
                    }
                });

            });
        },
        
        getParameters:function(){
            var url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')
            var theRequest = new Object();
            if ( url.indexOf( "?" ) != -1 ) {
              var str = url.substr( 1 ); //substr()方法返回从参数值开始到结束的字符串；
              var strs = str.split( "&" );
              for ( var i = 0; i < strs.length; i++ ) {
                theRequest[ strs[ i ].split( "=" )[ 0 ] ] = ( strs[ i ].split( "=" )[ 1 ] );
              }
              obj.uid = theRequest.uid;
              obj.joinid = theRequest.joinid;
            } //此时的theRequest就是我们需要的参数；

        },

        empty: function(val, tips) {
            var v = val;
            if (!v) {
                tip.info(tips);
                return false;
            }
            return true;
        },
        // 手机号
        telJudge: function() {
            var that = this,
                telRet;
            telVal = $.trim($(obj.tel).val());
            if (!telVal) {
                tip.info(obj.telNone);
                return false;
            }
            telRet = obj.telReg.test(telVal);
            if (!telRet) {
                tip.info(obj.telRet);
                return false;
            }
            return true;
        },
        // 验证码倒计时
        verifyTimer: function(times) {
            var timer;
            timer = times;
            timer--;
            clearInterval(timers)
            $(obj.getVerify).html(timer + 's');
            $(obj.getVerify).addClass(obj.getedVerify)
            timers = setInterval(func, 1000);

            function func() {
                timer--;
                if (timer <= 0) {
                    timer = 0;
                    $(obj.getVerify).removeAttr('disabled');
                    $(obj.getVerify).html('获取验证码');
                    $(obj.getVerify).removeClass(obj.getedVerify)
                    clearInterval(timers);
                    return;
                }
                $(obj.getVerify).html(timer + 's');
            }
        },
        getVerify: function() {
            var that = this;
            $(obj.getVerify).on('click', function() {
                var self = this;
                var t = that.telJudge();
                if (!t) return false;
                var opt = {
                    mobile: telVal
                }
                $.ajax({
                    url: GETVERIFY,
                    data: opt,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(res) {
                        if (res.code == 0) {
                            that.verifyTimer(obj.verifyTimer);
                            tip.info(res.data.res);
                        } else {
                            $(obj.getVerify).removeAttr('disabled');
                            tip.info(res.description);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).css("pointer-events", "auto");
                    }
                });
                return false;
            });
        },
        initSubmit: function(i) {
            $(obj.getVerify).removeAttr('disabled');
            $(obj.getVerify).removeClass(obj.getedVerify);
            $(obj.getVerify).html('获取验证码');
            $(obj.writeVerify).val('');
            $(obj.tel).val('');
            clearInterval(timers);
        },
        submitFrom: function() {
            var that = this,
                param;
            $(obj.submit).on('click', function() {
                var self = this;
                verifyVal = $.trim($(obj.writeVerify).val());
              
                var t = that.telJudge();
                if (!t) return false;
                var v = that.empty(verifyVal, obj.verifyNone);
                if (!v) return false;
                param = {
                    mobile: telVal,
                    verifyCode: verifyVal
                }
                $.ajax({
                    url: SUBMIT,
                    data: param,
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            that.verifyTimer();
                            window.location.href = "//zhuanti.diandong.com/zt/2018/07/MG/mobile/try-upload.html?uid="+res.data.uid+'&joinid='+res.data.joinid;
                            that.initSubmit();
                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled");
                        $(self).css("pointer-events", "auto");
                    }
                });

                return false;

            })
        }

    };


    module.exports = trys;

})