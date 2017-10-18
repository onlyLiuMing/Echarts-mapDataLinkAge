const echarts = require( 'echarts' );
const jquery = require( 'jquery' );
const chinaMap = require( __dirname + '/json/map-china.json' );
const cityData = require( __dirname + '/json/city.json' );
const provinceData = require( __dirname + '/json/province.json' );
const provincePY = require( __dirname + '/public/provincePY' );

var option = {
    animation: true,
    animationDelay: function ( idx ) {
        return idx * 5;
    },
    animationDuration: 800,
    animationEasing: 'backOut',
    animationDurationUpdate: 800,
    animationEasingUpdate: 'cubicInOut',
    title: [ {} ],
    toolbox: {
        show: true,
        orient: 'horizontal',
        feature: {
            myBack: {
                show: false,
                title: "返回上一级",
                icon: "path://M940.748908 897.124226s-8.766506 22.571552-20.437775 0c0 0-130.44811-393.710528-448.442318-294.543139v122.214024s-5.099973 71.856272-67.774042 25.057546L91.42784 479.953413s-66.293503-36.076599 4.026941-85.421729L411.444222 123.033132s47.507255-33.882413 58.944055 21.68282l0.351192 131.869262c0.060409 0.059385 592.695474 28.434319 470.009439 620.539012z",
                onclick: function ( params ) { //此函数用于点击时，回退到中国地图
                    var chinaOption = initialOption( option );
                    myChart.setOption( chinaOption, {
                        notMerge: true,
                        lazyUpdate: false,
                        silent: false
                    } );
                }
            }
        },
        iconStyle: {
            normal: {
                borderColor: 'black'
            },
            emphasis: {
                // borderColor: '#b1e4ff'
            }
        },
        right: 40
    },
    tooltip: {
        trigger: 'item',
        formatter: function ( a, b, c ) {
            var c = null;
            if ( a.value instanceof Array ) {
                c = a.name + " : " + flow_unit( a.value[ 2 ] )
            } else {
                c = a.name + " : " + flow_unit( a.value );
            }
            return c
        }
    },
    grid: {
        right: 30,
        top: "10%",
        bottom: 30,
        width: '28%',
        height: '35%'
    },
    xAxis: {
        show: false,
        type: 'value',
        scale: true,
        position: 'top',
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            margin: 2,
            textStyle: {}
        },
    },
    yAxis: {
        show: true,
        position: 'left',
        type: 'category',
        name: '流量排行',
        nameTextStyle: {
            color: "#000000",
            fontSize: 14,
            fontWeight: 'bold'
        },
        nameGap: 15,
        axisLine: {
            show: false,
            lineStyle: {
                color: '#666666'
            }
        },
        axisTick: {
            show: false,
            lineStyle: {
                color: '#666666'
            }
        },
        axisLabel: {
            interval: 0,
            textStyle: {
                color: '#666666'
            }
        },
        data: [ ]
    },
    legend: {},
    backgroundColor: '#fff',
    textStyle: {
        fontSize: 10
    },
    visualMap: [ {
        tyoe: 'continuous',
        min: null,
        max: null,
        inRange: {
            color: [ '#AEE3FF', '#B4C6FF', '#7497FF', '#3C62D5', '#245BFF', '#133FC4' ], //由浅到深
            colorAlpha: 0.85
        },
        dimension: 0,
        seriesIndex: [ 0, 1 ],
        left: 'left',
        bottom: '7%',
        itemWidth: 15,
        itemHeight: 120,
        text: [ '高', '低' ],
        calculable: true,
        formatter: function ( data ) {
            return flow_unit( data )
        }
        } ],
    series: [ {
        name: 'main-map',
        id: 'main-map',
        type: 'map',
        map: '',
        layoutCenter: [ '33%', '50%' ],
        layoutSize: '100%',
        data: [ ],
        symbol: 'circle',
        symbolSize: function ( val ) {
            var value = val[ 2 ];
            var outvalue = 1;
            while ( value >= 10 ) {
                value = Math.ceil( value / 10 );
                outvalue += 3;
            }
            return Math.floor( outvalue / 3 )
        },
        label: {
            normal: {
                show: true,
                position: 'top',
                offset: [ 30, 40 ],
                fontSize: 12,
                color: 'gray'
            },
            emphasis: {
                show: true,
                position: 'top',
                color:'balck'
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#eee',
                color: '#ffd20a',
            },
            emphasis: {
                areaColor: '#ffca60',
                color: '#ffd20a'
            }
        },
        animationDelayUpdate: function ( idx ) {
            return 700
        }
    }, {
        id: 'bar',
        name: '流量统计',
        zlevel: 0,
        type: 'bar',
        data: [ ],
        itemStyle: {
            normal: {
                //			color:"#1ab394"
            },
            emphasis: {
                //			color:"#19aa8d"
            }
        },
        data: [ ]
    }, {
        id: "pie",
        name: '成功率',
        zlevel: 0,
        type: 'pie',
        avoidLabelOverlap: true,
        selectedMode: 'single',
        data: [ ],
        label: {
            normal: {
                show: true,
                position: 'outside',
                formatter: function ( _data ) {
                    var put = "";
                    switch ( _data.name ) {
                        case "five":
                            put = "5xx占比";
                            break;
                        case "four":
                            put = "4xx占比";
                            break;
                        case "success":
                            put = "命中率";
                            break;
                    };
                    return put;
                },
                textStyle: {
                    color: 'gray'
                }
            },
            emphasis: {
                show: true,
            },

        },
        itemStyle: {
            normal: {
                color: function ( params ) {
                    var name = params.name,
                        color;
                    switch ( name ) {
                        case 'four':
                            color = '#ACD0FF';
                            break;
                        case 'five':
                            color = '#2463ff';
                            break;
                        case 'success':
                            color = '#7488ff';
                            break;
                    }
                    return color;
                },
                opacity: 0.8
            }
        },
        center: [ '80%', '70%' ],
        radius: [ 0, '30%' ],
        tooltip: {
            formatter: "{c} %",
        },
        markPoint: {
            symbol: 'rect'
        }
    } ]
};


//事件函数：地图map选中区域事件  mapselected
function _mapselected( params ) {
    myChart.showLoading( {
        zlevel: 10
    } );
    var cityName = params.name;
    var cityPY = provincePY[ cityName ];
    var coorUrl = "./mapJson/" + cityPY + ".json";
    var data = {
        province: cityPY,
        csrfmiddlewaretoken: '{{csrf_token}}'
    };

    //如果没有查到对应拼音，则不进行请求地图数据
    if ( cityPY ) {
        //请求指定区域流量数据
        let _cityData = cityData;
        if ( _cityData.flow[ 0 ].name.search( /市$/ ) <= -1 ) {
            for ( var i in _cityData.flow ) {
                _cityData.flow[ i ].name = _cityData.flow[ i ].name + '市';
            }
        }

        var _mapName = cityPY,
            _mapJson = null,
            _convertedData = convertData( _cityData );
        //获取新地图
        jquery.ajax( {
            url: coorUrl,
            type: "get",
            async: false,
            success: function ( res ) {
                _mapJson = res;
                //注册新地图
                echarts.registerMap( _mapName, _mapJson );
            }
        } );
        //设置新地图的option
        var downOption = initialOption(
            option,
            _mapName,
            _convertedData.mapData,
            convertYAxisData( _convertedData.mapData ).data,
            _convertedData.pieData,
            convertYAxisData( _convertedData.mapData ).name,
            _convertedData.cityName,
            _convertedData.max,
            _convertedData.min,
            true );
        myChart.setOption( downOption, {
            notMerge: true
        } );
        myChart.hideLoading( );
    } else {
        myChart.hideLoading( );
    }
    //end of 事件函数
}
//修改option函数
function initialOption( option, mapName, mapData, barData, pieData, yAxisData, yAxisName, max, min, backShow ) {
    var newOption = Object.assign( {}, option ),
        _mapName = mapName ? mapName : 'china',
        _mapData = mapData ? mapData : convertedData.mapData,
        _barData = barData ? barData : convertYAxisData( convertedData.mapData ).data,
        _pieData = pieData ? pieData : convertedData.pieData,
        _yAxisData = yAxisData ? yAxisData : convertYAxisData( convertedData.mapData ).name,
        _yAxisName = yAxisName ? yAxisName : convertedData.cityName + '流量排行',
        _max = max ? max : convertedData.max,
        _min = min ? min : convertedData.min,
        _backShow = backShow ? backShow : false;

    newOption.series[ 0 ].map = _mapName;
    newOption.series[ 0 ].data = _mapData;
    newOption.series[ 1 ].data = _barData;
    newOption.series[ 2 ].data = _pieData;
    newOption.yAxis.data = _yAxisData;
    newOption.yAxis.name = _yAxisName;
    newOption.visualMap[ 0 ].max = _max;
    newOption.visualMap[ 0 ].min = _min;
    newOption.toolbox.feature.myBack.show = _backShow;

    return newOption
}
//end of修改option函数

//数据处理函数部分		
/*function 处理初始的geojson数据*/
function convertData( data ) {
    var data = JSON.parse( JSON.stringify( data ) );
    var mapData = data.flow,
        pieData = [ ],
        barData = [ ],
        cityName = data.name,
        max,
        min;
    //临时处理数据，正式需调整
    for ( var i in data.flow ) {
        data.flow[ i ].value = data.flow[ i ].flow;
        delete data.flow[ i ].flow;
    }
    //end of 临时处理数据
    for ( var i = 0; i < data.flow.length; i++ ) {
        barData.push( [ data.flow[ i ].name, data.flow[ i ].value ] )

        if ( i == 0 ) {
            max = min = data.flow[ i ].value;
        } else {
            max = ( data.flow[ i ].value >= max ) ? data.flow[ i ].value : max;
            min = ( data.flow[ i ].value <= min ) ? data.flow[ i ].value : min;
        }
    };
    //pie图数据格式化
    pieData = ( function ( data ) {
        var output = [ ];
        for ( var i of Object.keys( data ) ) {
            output.push( {
                name: i,
                value: data[ i ]
            } )
        }
        return output;
    }( data.successRate ) );
    //end of pie图 数据格式化
    return {
        cityName: cityName,
        mapData: mapData,
        barData: barData,
        pieData: pieData,
        max: max,
        min: min
    };
};
/* end of function 处理初始的geojson数据*/
/* 处理yAxis传值排序*/
function convertYAxisData( data ) {
    var data = JSON.parse( JSON.stringify( data ) );
    var name = [ ];
    data = data.sort( function ( a, b ) {
        return a.value - b.value
    } ).slice( data.length - 15 );
    for ( var i in data ) {
        name.push( data[ i ].name );
    };
    return {
        name: name,
        data: data
    }
}
//end of 处理ajax传值

//修改单位
function flow_unit( value ) {
    if ( value ) {
        if ( value > ( 1000 * 1000 * 1000 * 1000 ) ) {
            var res = value / ( 1000 * 1000 * 1000 * 1000 );
            res = res.toFixed( 2 );
            return res + " TB";
        } else if ( value > ( 1000 * 1000 * 1000 ) ) {
            var res = value / ( 1000 * 1000 * 1000 );
            res = res.toFixed( 2 );
            return res + " GB";
        } else if ( value > ( 1000 * 1000 ) ) {
            var res = value / ( 1000 * 1000 );
            res = res.toFixed( 2 );
            return res + " MB";
        } else if ( value > 1000 ) {
            var res = value / 1000;
            res = res.toFixed( 2 );
            return res + " KB";
        } else {
            var res = value;
            res = res.toFixed( 2 );
            return res + " B";
        }
    }
}


/*注册地图*/
echarts.registerMap( 'china', chinaMap, {} );
var myChart = echarts.init( document.getElementById( 'map' ) );
/*end of 注册echarts件*/
let convertedData = convertData( provinceData );
/*注册echarts事件*/
myChart.on( 'mapselected', _mapselected );
//最初的设置
var chinaOption = initialOption( option );
//设置“china”地图的配置
myChart.setOption( chinaOption );
myChart.hideLoading( );
myChart.on( "dblclick", function ( params ) {
    if ( params.seriesType == "map" ) {
        var province = params.name;
        myChart.dispatchAction( {
            type: 'mapSelect',
            name: province
        } );
    }
} );