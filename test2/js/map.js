/*
 * 地图
 */
(function() {
  //从引擎的RenderObj继承
  Map = Sprite.extend({
    init: function(r, c, wName, ww, wh) {
      this.r = r;
      this.c = c;
      this.ww = ww;
      this.wh = wh
      this.wName = wName;
      this.offX = 0;
      this.offY = 0;
      this.mapData = null;
      this.maze = null;
      this._super();
    },
    reset: function() {
      console.log("开始创建地图");
      var sc = this.owner;
      var maze = MapUtil.primMaze(this.r, this.c, 'wall');
      this.maze = maze;
      this.mapData = MapUtil.convertArrToAS(maze);
      this.offX = (sc.w - this.ww * (2 * this.c + 1)) * 0.5 + (this.ww * 0.5);
      this.offY = (sc.h - this.wh * (2 * this.r + 1)) * 0.5 + (this.wh * 0.5);
      //创建外墙
      for (var i = 0; i < maze.length; i++) {
        var m = maze[i];
        for (var j = 0; j < m.length; j++) {
          //console.log(maze[i][j])
          if (maze[i][j] == 1) {
            var bar = sc.createRObj(Sprite.ClassName);
            var anims = ResManager.getAnimationsByName("sprite", this.wName);
            bar.setAnims(anims);
            bar.w = this.ww;
            bar.h = this.wh;
            bar.moveTo(this.offX + j * this.ww, this.offY + i * this.wh);
          }
        }
        //console.log(m)
      }
    },
    //定位屏幕坐标到数组位置
    mapSCPos: function(x, y) {
      return [(y - this.offY + this.wh * 0.5) / this.wh | 0, (x - this.offX + this.ww * 0.5) / this.ww | 0];
    },
    //定位数组位置到屏幕坐标
    mapPosToSC: function(r, c) {
      return [this.offX + this.ww * c | 0, this.offY + this.wh * r | 0];
    },
    inRange: function(map,target,tips){
      var tips = tips || '目标位置超出地图范围，请重新选择';
      var result = target[0]>0 && target[1]>0 && (target[0]<map.length) && (target[1] < map[0].length)
      console.log('[' + target + '] ' + (result ? 'in' : 'out') + ' of range [1-' + (map.length-1) +',1-'+(map[0].length-1) + ']');
      !result && console.log(tips);
      return result;
    },
    //查找路经
    findPath: function(start, end, type) {
      var type = type || '';
      var m = MapUtil.convertArrToAS(this.maze);
      var p;
      //判断目标位置是否在有效范围内
      if(!this.inRange(m,end)) return;
      switch(type){
        case 'all':
          p = MapUtil.findPathAll(m, start, end, m.length, m.length);
          break;
        case 'adapt':
          p = MapUtil.xAdapt(m, start, end, m.length, m.length);
          break;
        case 'plow':
          p = MapUtil.plowPath(m, start, end, m.length, m.length);
          break;
        case '':
        default:
          p = MapUtil.findPathA(m, start, end, m.length, m.length);
      }
      return p;
    },
    render: function(ctx) {
      return true;
    }
  });
  Map.ClassName = "Map";
  //注册CObj类
  ClassFactory.regClass(Map.ClassName, Map);
}())