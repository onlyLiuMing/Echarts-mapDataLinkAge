写了一个echarts的地图数据联动的demo
=====
`头一次写还有点小激动呢`
- 三个图标写在一个echart实例中
- 自己手动处理数据，而不是用echart的多实例联动
- 尝试用webpack进行打包拆分，不过这本来就属于一个图形数据模块，本来不应该拆分解耦的，强行解耦，导致内部有些混乱不堪，看看就好了
- 由于数据是自己瞎几把写的，全国省市东西太多了，所以下钻只有‘广东’有数据可以显示

> 由于用了jQuery.ajax模块，所以需要webpack-dev-server进行模拟服务器请求静态文件,执行以下语句运行代码

    #npm run server

> 如果需要修改代码，修改后请执行webpack重新编译文件

    #webpack
