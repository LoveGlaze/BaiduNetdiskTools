# 百度网盘解析教程        
```diff
+ 本教程有一定难度，看不懂中文的请绕道
- 本教程有一定难度，看不懂中文的请绕道
```
```json
若脚本被举报下线，请采用手动安装
```
数码小站官网同样有教程[点击跳转数码小站主页](https://www.shuma.ink/zh-cn/install.html)
## 安装教程  
- 第一步，安装油猴插件：[Tampermonkey](https://www.tampermonkey.net)
- 第二步，安装数码小站脚本：[数码小站](https://scriptcat.org/script-show-page/164)  
- 若第二步无法安装，[点击此处安装](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/js/Shuma.user.js)

- 暴力猴可能存在卡密一直查询中的问题
- 也可以使用[KinhDown客户端](https://kinhdown.com)，可批量下载
### 1. Windows  
#### IDM:[点击下载](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/IDM/Internet%20Download%20Manager.exe)  
- 动图：

<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/ShuMa-IDM.gif" />  

- 静图  

<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/IDM1.png" />  

<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/IDM2.png" /> 

<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/IDM3.png" />  

- 以防止被拉黑限速，请设置线程为4  

<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/IDM4.png" />  

##### 错误解决：  
```json
- 403：请重新解析，复制UA后粘贴到IDM中。  
```
<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/403%E9%94%99%E8%AF%AF.png" /> 

```json
- 重新登陆：右上角重新登陆百度网盘。  
```
<img src="https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/%E9%87%8D%E6%96%B0%E7%99%BB%E9%99%86%E9%94%99%E8%AF%AF.png" />  

```json
- 解析失败 等待修复,服务器出问题了，等待修复。  
```
![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5.png)

```json
- IDM安装后未创建桌面图标的，开始菜单自己找。  
```

#### Aria2NG:[点击下载](http://aria2.baisheng999.com/)

- 双击Aria2NG打开软件，此时会自动弹出网页管理页面，点击解析，解析后出现发送到Aria按钮，点击会发送到Aria下载，也可通过[脚本配置](http://settings.shuma.ink)修改保存目录。

![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Aria1.png)  

#### Motrix:[点击下载](https://motrix.app)  
##### 方法一
- 使用方法同IDM,设置UA后复制直链新建任务下载。
  
![Motrix](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Motrix.png)    

##### 方法二
- 也可通过修改脚本配置端口6800为16800后，点击发送到Aria后会发送到Motrix下载，此时下载目录为[脚本配置](http://settings.shuma.ink)页的目录。

![Motrix](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Motrix2.png)  

![Motrix](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Motrix3.png)  

#### KinhDown:[主页](https://kinhdown.com)

- 底部传输管理，然后顶部选择数码小站

![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/KinhDown.png)

- 中途提示卡密流量不够，打开Configure.ini，将新获取的卡密填入以下位置

![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/KinhDown2.png)

#### NDM:[点击下载](http://www.neatdownloadmanager.com/index.php)  

- 使用方法同IDM,设置UA后复制直链新建任务下载。  

### 2. Mac

- Mac我使用的是微软Edge浏览器[点击下载](https://www.microsoft.com/zh-cn/edge#platform)。

#### NDM:[点击下载](http://www.neatdownloadmanager.com/index.php)

- 使用方法同IDM,设置UA后复制直链新建任务下载。

#### Motrix:[点击下载](https://motrix.app)  
##### 方法一
- 使用方法同IDM,设置UA后复制直链新建任务下载。
  
![Motrix](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Motrix.png)    

##### 方法二
- 也可通过修改脚本配置端口6800为16800后，点击发送到Aria后会发送到Motrix下载，此时下载目录为[脚本配置](http://settings.shuma.ink)页的目录。

![Motrix](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Motrix2.png)  

![Motrix](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/Motrix3.png)  

### 3. 手机  

#### Aria2NG:[点击下载](https://gitee.com/LoveGlaze/BaiDuPan/attach_files/860266/download/AriaNg%20GUI%20-%20KinhDown.apk)  

- 下载完毕后打开软件前往解析地址解析，也可以手动打开解析地址：https://baidu.kinh.cc  

![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/AriaS1.png)![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/AriaS2.png)  

![](https://gitee.com/LoveGlaze/BaiDuPan/raw/master/images/AriaS3.png)  

### 4. Linux

#### Motrix:[点击下载](https://motrix.app)

#### Aria2NG:[点击下载](http://aria2.baisheng999.com/)


