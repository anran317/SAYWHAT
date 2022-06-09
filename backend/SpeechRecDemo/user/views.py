import requests, json, traceback
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from service import responseUtil

# 获取微信用户的openid，可以作为唯一的UID
@csrf_exempt
def getOpenID(request):
    try:   
        jscode = request.POST['jscode']
        data ={
            'appid': 'wx9dc6b3932e2262e7',         # 小程序appid
            'secret': '64fa7c7f255a7d39de8ae4f1ebbb5d19',   # 小程序secret_key
            'grant_type':'authorization_code',
            'js_code': jscode 
        }
        url = 'https://api.weixin.qq.com/sns/jscode2session'
        try:
            r = requests.post(url, data=data)
        except:
            traceback.print_exc()
            return responseUtil.sendFail(code=-1, msg='无法获取用户ID')
        res = json.loads(r.text)
        if 'errcode' in res:
            return responseUtil.sendFail(code=-2, msg='无法获取用户ID')
        return responseUtil.sendSuccess(res)
    except Exception as e:
        traceback.print_exc()
        return responseUtil.sendServerError()